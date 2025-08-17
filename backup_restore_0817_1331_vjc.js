// 代码生成时间: 2025-08-17 13:31:20
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/calaxy:files';
import { EJSON } from 'meteor/ejson';

// Define the backup collection
const Backups = new FS.Collection('backups', {
  stores: [
    new FS.Store.GridFS('backups', {
      collectionName: 'backups',
      filter: new FS.Filter({
        contentTypes: ['application/json'] // Only allow JSON backups
      })
    })
  ]
});

// Function to backup data
export const backupData = async () => {
  // Retrieve data from collections (example: Meteor.users)
  try {
    const dataToBackup = Meteor.users.find().fetch();
    const backupData = EJSON.stringify(dataToBackup);
    // Create a backup file with a unique name
    const backupFile = Backups.insert({
      backupData,
      createdAt: new Date()
    }, function (error, fileObj) {
      if (error) {
        throw new Meteor.Error('backup-data-error', "Error backing up data: " + error.reason);
      }
      console.log('Backup created:', fileObj._id);
    });
  } catch (error) {
    console.error('Error during backup:', error);
  }
};

// Function to restore data
export const restoreData = async (backupId) => {
  // Check if the backupId exists
  try {
    const backupFile = Backups.findOne(backupId);
    if (!backupFile) {
      throw new Meteor.Error('backup-not-found', 'Backup not found');
    }
    const backupData = EJSON.parse(backupFile.backupData);
    // Restore data to collections (example: Meteor.users)
    backupData.forEach((user) => {
      Meteor.users.upsert({
        _id: user._id
      }, {
        $set: user
      });
    });
    console.log('Data restored successfully');
  } catch (error) {
    console.error('Error during restore:', error);
  }
};

// Meteor methods to expose backup and restore functionality
Meteor.methods({
  'backupData': function () {
    check(this.userId, String); // Ensure the user is logged in
    backupData();
  },
  'restoreData': function (backupId) {
    check(this.userId, String); // Ensure the user is logged in
    check(backupId, String); // Ensure backupId is provided
    restoreData(backupId);
  }
});