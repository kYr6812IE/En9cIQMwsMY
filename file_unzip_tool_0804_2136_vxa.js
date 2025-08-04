// 代码生成时间: 2025-08-04 21:36:15
 * It includes error handling and following best practices for code maintainability and scalability.
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { HTTP } from 'meteor/http';
import { EJSON } from 'meteor/ejson';
import { check } from 'meteor/check';
import { Meteor } from 'meteor/meteor';
import { serveFiles } from 'meteor/serve-files';
import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import * as path from 'path';
import * as zlib from 'zlib';
import * as tar from 'tar';

// Define the file system collection
FS.Collection('decompressedFiles', {
    stores: [
        // Define the storage for the decompressed files
        {
            store: FS.Store.GridFS,
            name: 'decompressedFilesStore',
            options: {
                collectionName: 'decompressedFilesCollection',
            },
        },
    ],
    permissions: {
        // Define permissions for the collection
        allow: {
            create: function(){ return true; },
            update: function(){ return true; },
            remove: function(file, userId){ return true; },
        },
    },
});

// Function to handle file uploads
Meteor.methods({
    'uploadFile': function(fileData) {
        // Check the file data
        check(fileData, Buffer);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'Not authorized');
        }

        // Save the uploaded file to the file system
        const fileId = FS.File.insert({
            file: fileData,
            meta: {
                userId: this.userId,
            },
        }, {
            collectionName: 'decompressedFilesCollection',
        });

        return fileId;
    },
});

// Function to decompress a file
Meteor.methods({
    'decompressFile': function(fileId) {
        // Check if the file ID is valid
        check(fileId, String);

        if (!this.userId) {
            throw new Meteor.Error('not-authorized', 'Not authorized');
        }

        // Retrieve the file from the file system
        const file = FS.File.findOne(fileId);
        if (!file) {
            throw new Meteor.Error('file-not-found', 'File not found');
        }

        // Create a stream to read the file
        const inputStream = FS.FileReadStream(file, 'decompressedFilesStore');

        // Create a stream to write the decompressed files
        const outputDir = path.join(process.cwd(), 'decompressedFiles');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }

        // Use tar and zlib to decompress the file
        const gunzip = zlib.createGunzip();
        const extract = tar.extract(outputDir, { dmode: 0o755, fmode: 0o644 });

        // Pipe the streams together to decompress the file
        inputStream
            .pipe(gunzip)
            .on('error', (err) => {
                throw new Meteor.Error('decompression-error', 'Error decompressing file', err);
            })
            .pipe(extract)
            .on('error', (err) => {
                throw new Meteor.Error('extraction-error', 'Error extracting file', err);
            })
            .on('finish', () => {
                console.log('File decompressed successfully');
            });
    },
});

// Serve the decompressed files
serveFiles();

// Define the route for serving the decompressed files
Router.route('/files/:filename', { where: 'server' }, function() {
    this.response.writeHead(200, { 'Content-Type': 'application/octet-stream' });
    const filePath = path.join('decompressedFiles', this.params.filename);
    fs.createReadStream(filePath).pipe(this.response);
});