// 代码生成时间: 2025-08-31 14:30:50
import { Meteor } from 'meteor/meteor';
import { NpmModule } from 'meteor/npm';
import { FSCollection } from 'meteor/ostrio:files';
import { check, Match } from 'meteor/check';
import archiver from 'archiver';
import fs from 'fs';
import path from 'path';

// Define a schema for file uploads
const fileSchema = new SimpleSchema({
  file: {
    type: File,
    optional: false,
  },
  description: {
    type: String,
    optional: true,
    autoform: {
      afFieldInput: {
        type: 'textarea',
      },
    },
  },
});

// Create a collection to hold uploaded files
const Files = new FSCollection('files', {
  stores: [
    new FSStore({
      name: 'local',
      path: 'assets',
      filter: new Filter({
        allow: {
          contentTypes: ['application/zip'],
          maxSize: 20971520, // 20MB
        },
        deny: {
          maxSize: 0, // unlimited
        },
      },
    },
  )],
  filter: {
    allow: {
      contentTypes: ['application/zip'],
    },
  },
  schema: fileSchema,
});

// Function to unzip a file
const unzipFile = async (fileId) => {
  try {
    // Check if the file exists and is a zip
    const file = Files.findOne(fileId);
    if (!file) throw new Meteor.Error('File not found');
    if (file.metadata.contentType !== 'application/zip') throw new Meteor.Error('Not a zip file');

    // Create a directory to extract files to
    const outputDir = path.join('assets', file._id);
    fs.mkdirSync(outputDir);

    // Create a zip file reader and extract files to the directory
    const reader = fs.createReadStream(file.path().split('assets/')[1]);
    const extract = archiver('zip', { zlib: { level: 9 } });
    extract.pipe(fs.createWriteStream(outputDir));
    await new Promise((resolve, reject) => {
      reader.on('error', reject);
      extract.on('error', reject);
      extract.on('close', resolve);
      reader.pipe(extract);
    });
    extract.finalize();

    return outputDir;
  } catch (error) {
    console.error('Error unzipping file:', error);
    throw error;
  }
};

// API endpoint to upload and unzip files
Meteor.methods({
  'files.uploadAndUnzip': function (fileData) {
    check(fileData, Match.ObjectIncluding({ fileId: String }));
    try {
      // Check file size and type
      check(fileData.file, File);
      if (fileData.file.size > 20971520) throw new Meteor.Error('File too large');
      if (fileData.file.type !== 'application/zip') throw new Meteor.Error('Not a zip file');

      // Insert the file into the collection and get the file ID
      const file = Files.insert(fileData.file);

      // Unzip the file and return the output directory path
      return unzipFile(file._id);
    } catch (error) {
      throw new Meteor.Error(error.message);
    }
  },
});

// Error handling
Meteor.startup(() => {
  if (Meteor.isDevelopment) {
    Accounts.ui.config({
      passwordSignupFields: 'USERNAME_AND_EMAIL',
    });
  }
});

// Documentation
/**
 * Unzips a file stored in the Files collection
 * @param {String} fileId - ID of the file to unzip
 * @returns {String} - Path to the extracted files
 */

// This code defines a Meteor application that allows users to upload and unzip zip files.
// The Files collection is used to store uploaded files, with a schema that validates the file type and size.
// The 'files.uploadAndUnzip' method handles file uploads and extraction, ensuring that only zip files are processed.
// Error handling is included for invalid file types, sizes, and extraction errors.
