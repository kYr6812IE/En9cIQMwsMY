// 代码生成时间: 2025-09-21 02:39:53
// unzip_tool.js - A Meteor application to unzip files using the JSZip library.

// Import required Meteor packages and JSZip library.
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs'; // cfs stands for CollectionFS
import * as JSZip from 'jszip';
import { FSHttp } from 'meteor/cfs:http';
import { FSCollection } from 'meteor/cfs:collection';

// Define a collection for storing files.
FSCollection.defaultOptions()
  .onBeforeUpload((file) => {
    // Check if the file is a zip file.
    if (!file.contentType.startsWith('application/zip')) {
      throw new Meteor.Error('Invalid file type', 'Only zip files are allowed');
    }
    return true;
  });

// Create a method to unzip files.
Meteor.methods({
  'unzipFile': function(fileId) {
    check(fileId, String); // Check the file ID is a string.

    // Get the file from the FS collection.
    const file = FS.File.findOne(fileId);
    if (!file) {
      throw new Meteor.Error('File not found', 'The file you want to unzip does not exist.');
    }

    // Read the file's buffer.
    const reader = new FileReader();
    reader.onload = function(e) {
      // Create a new JSZip instance and load the zip file.
      const zip = new JSZip();
      zip.loadAsync(e.target.result)
        .then(function(zip) {
          // Loop through each file in the zip.
          const promises = Object.keys(zip.files).map((path) => {
            // Skip directories.
            if (zip.files[path].dir) return;

            // Get the file content.
            return zip.files[path].async('blob').then(function(blob) {
              // Create a new file object and insert it into the FS collection.
              const newFile = new FS.File(blob, {
                contentType: blob.type,
                name: path,
              });
              return FS.FileCollection.insert(newFile);
            });
          });

          // Wait for all files to be extracted and saved.
          Promise.all(promises).then(() => {
            console.log('All files have been unzipped and saved.');
          }).catch((error) => {
            console.error('An error occurred while unzipping the files:', error);
          });
        })
        .catch((error) => {
          console.error('An error occurred while loading the zip file:', error);
        });
    };
    reader.readAsArrayBuffer(file.buffer);
  },
});

// Error handling middleware for the FS.Http method.
FSHttp.listen({
  onException: function(exception, message, stack) {
    console.error('FSHttp onException:', exception, message, stack);
  },
  onAfterUpload: function(file) {
    console.log('FSHttp onAfterUpload:', file);
  },
  onAfterRemove: function(file) {
    console.log('FSHttp onAfterRemove:', file);
  },
  onAfterWrite: function(file) {
    console.log('FSHttp onAfterWrite:', file);
  },
  onAfterRead: function(file) {
    console.log('FSHttp onAfterRead:', file);
  },
  onAfterCopy: function(file) {
    console.log('FSHttp onAfterCopy:', file);
  },
  onAfterMove: function(file) {
    console.log('FSHttp onAfterMove:', file);
  },
  onAfterResumableUpload: function(file) {
    console.log('FSHttp onAfterResumableUpload:', file);
  },
  onAfterResumableUploadComplete: function(file) {
    console.log('FSHttp onAfterResumableUploadComplete:', file);
  },
});
