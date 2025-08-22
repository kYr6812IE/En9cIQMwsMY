// 代码生成时间: 2025-08-23 04:03:27
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check } from 'meteor/check';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import fs from 'fs';
import path from 'path';
import Future from 'fibers/future';

// Collection to store backup logs
const backups = new Mongo.Collection('backups');

// Check if the Meteor Filesystem (FS) is ready
FS.debug = true;
FS.HTTP = Meteor.settings.public.HTTP;

// Error handling
const errorHandler = function(error) {
    console.error('Error:', error);
    throw error;
};

// Synchronize files to a backup directory
const synchronizeFiles = function(backupPath) {
    const future = new Future();
    try {
        // Use Meteor's FS to list files
        FS.find().forEach(file => {
            const filePath = FS.getFile(file._id).path;
            const backupFilePath = path.join(backupPath, path.basename(filePath));
            
            // Check if the backup file exists
            if (!fs.existsSync(backupFilePath)) {
                // If not, copy the file to the backup directory
                fs.writeFileSync(backupFilePath, fs.readFileSync(filePath));
            }
        });
        // Log the backup operation
        backups.insert({
            timestamp: new Date(),
            path: backupPath
        });
        future.return();
    } catch (error) {
        errorHandler(error);
    }
    return future.wait();
};

// Meteor method to trigger file synchronization
Meteor.methods({
    'synchronizeFiles': function(backupPath) {
        check(backupPath, String);
        try {
            synchronizeFiles(backupPath);
            return 'Files synchronized successfully.';
        } catch (error) {
            errorHandler(error);
        }
    }
});

// Meteor publish function to publish file list
Meteor.publish('fileList', function() {
    return FS.find();
});

// Meteor publish function to publish backup logs
Meteor.publish('backupLogs', function() {
    return backups.find();
});

// Start the backup and sync process on Meteor startup
Meteor.startup(() => {
    // Define the backup path
    const backupPath = path.join(Meteor.settings.backupPath || './backups', Random.id());
    
    // Synchronize files to the backup directory
    synchronizeFiles(backupPath);
});
