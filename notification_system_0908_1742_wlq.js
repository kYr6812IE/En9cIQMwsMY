// 代码生成时间: 2025-09-08 17:42:37
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

// Define a collection to store notifications
const Notifications = new Mongo.Collection('notifications');

// Define schema for notifications
const notificationSchema = new SimpleSchema({
  message: {
    type: String,
    label: 'Message'
  },
  createdAt: {
    type: Date,
    label: 'Created At',
    autoValue: function () {
      if (this.isInsert) {
        return new Date();
      }
    },
    denyUpdate: true,
  },
  userId: {
    type: String,
    label: 'User ID',
    regEx: SimpleSchema.RegEx.Id,
  },
  read: {
    type: Boolean,
    label: 'Read',
    defaultValue: false,
  },
});

// Attach the schema to the collection
Notifications.attachSchema(notificationSchema);

// Method to create a notification
Meteor.methods({
  'notifications.create'(options) {
    check(options, {
      message: String,
      userId: String,
    });

    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to create a notification.');
    }

    // Create a new notification and insert it into the collection
    const notificationId = Notifications.insert({
      message: options.message,
      userId: options.userId,
    });
    return notificationId;
  },
  'notifications.markAsRead'(notificationId) {
    check(notificationId, String);

    // Check if the notification exists and belongs to the user
    const notification = Notifications.findOne(notificationId);
    if (!notification) {
      throw new Meteor.Error('notification-not-found', 'Notification not found.');
    }
    if (notification.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User is not authorized to mark this notification as read.');
    }

    // Update the notification to mark it as read
    Notifications.update(notificationId, { $set: { read: true } });
  },
});

// Publish all notifications for a user
Meteor.publish('notifications', function () {
  return Notifications.find({
    userId: this.userId,
    read: false,
  });
});

// Publish all notifications for a user, including read notifications
Meteor.publish('allNotifications', function () {
  return Notifications.find({ userId: this.userId });
});

// Error handling
Accounts.onLogin((loginInfo) => {
  console.log('User logged in:', loginInfo);
});
Accounts.onLogout((logoutInfo) => {
  console.log('User logged out:', logoutInfo);
});

// Example usage of the notification system
if (Meteor.isServer) {
  Meteor.startup(() => {
    // Code to run on server startup
  });
}

if (Meteor.isClient) {
  // Subscribe to notifications
  Meteor.subscribe('notifications');
  Meteor.subscribe('allNotifications');

  // Example of creating a notification
  Meteor.call('notifications.create', { message: 'Hello, this is a notification!', userId: Meteor.userId() }, (error, result) => {
    if (error) {
      console.error('Error creating notification:', error);
    } else {
      console.log('Notification created:', result);
    }
  });

  // Example of marking a notification as read
  Meteor.call('notifications.markAsRead', 'notificationId123', (error) => {
    if (error) {
      console.error('Error marking notification as read:', error);
    } else {
      console.log('Notification marked as read.');
    }
  });
}