// 代码生成时间: 2025-09-17 20:08:56
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { SyncedCron } from 'meteor/percolate:synced-cron';
import { check, Match } from 'meteor/check';
import { Future } from 'fibers';
import fs from 'fs';

// Define a file collection
FS.Collectionfilesystem("backupFiles", {
  stores: [FS.Store.FileSystem],
  filter: {
    allow: {
      content: true,
      contentTypes: ['application/zip'],
      maxSize: 1024 * 1024 * 5 // 5MB limit
    },
    deny: []
  },
  onBeforeUpload(file) {
    // Simple check to ensure the file uploaded is a zip file
    if (!file.contentType.includes('application/zip')) {
      throw new Meteor.Error('Unsupported file type');
    }
  }
});

// Define a function to backup files
function backupFiles(sourcePath, destinationPath) {
  try {
    // Check if the source path exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source path does not exist');
    }

    // Create the destination directory if it does not exist
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // Loop through all files in the source directory
    fs.readdirSync(sourcePath).forEach(file => {
      const sourceFilePath = `${sourcePath}/${file}`;
      const destinationFilePath = `${destinationPath}/${file}`;

      // If it's a file, copy it to the destination directory
      if (fs.lstatSync(sourceFilePath).isFile()) {
        fs.copyFileSync(sourceFilePath, destinationFilePath);
      }
      // If it's a directory, recursively backup the directory
      else if (fs.lstatSync(sourceFilePath).isDirectory()) {
        backupFiles(sourceFilePath, destinationFilePath);
      }
    });
  } catch (error) {
    console.error('Backup error:', error.message);
    throw error;
  }
}

// Define a function to sync files
function syncFiles(sourcePath, destinationPath) {
  try {
    // Check if the source path exists
    if (!fs.existsSync(sourcePath)) {
      throw new Error('Source path does not exist');
    }

    // Loop through all files in the destination directory
    fs.readdirSync(destinationPath).forEach(file => {
      const destinationFilePath = `${destinationPath}/${file}`;
      const sourceFilePath = `${sourcePath}/${file}`;

      // If the destination file does not exist, copy it from the source directory
      if (!fs.existsSync(sourceFilePath) && fs.existsSync(destinationFilePath)) {
        fs.copyFileSync(destinationFilePath, sourceFilePath);
      }
    });
  } catch (error) {
    console.error('Sync error:', error.message);
    throw error;
  }
}

// Define a scheduled job to perform backup and sync
SyncedCron.add({
  name: 'backup_and_sync',
  schedule: (parser) => parser.cron('*/5 * * * *'), // Every 5 minutes
  job: () => {
    console.log('Backup and sync job started');

    // Define the source and destination paths for backup and sync
    const sourcePath = '/path/to/source/directory';
    const destinationPath = '/path/to/destination/directory';
    const backupFilesPath = '/path/to/backup/files';

    // Perform backup
    backupFiles(sourcePath, backupFilesPath);

    // Perform sync
    syncFiles(backupFilesPath, destinationPath);

    console.log('Backup and sync job completed');
  }
});

Meteor.startup(() => {
  // Start the SyncedCron jobs
  SyncedCron.start();
});
