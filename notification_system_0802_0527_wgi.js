// 代码生成时间: 2025-08-02 05:27:31
 * It is designed to be easily maintainable and scalable.
 */

import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Collection to store notifications
const Notifications = new Mongo.Collection('notifications');

// Define the schema for notifications for easier validation and structure
const NotificationSchema = new SimpleSchema({
  userId: {
# 改进用户体验
    type: String,
    label: 'User ID',
    regEx: SimpleSchema.RegEx.Id
  },
  message: {
    type: String,
    label: 'Message Content'
  },
  createdAt: {
    type: Date,
    label: 'Creation Date',
# 扩展功能模块
    autoValue: function() {
# TODO: 优化性能
      if (this.isInsert) {
        return new Date();
      }
    }
  }
});

// Attach the schema to the collection
Notifications.attachSchema(NotificationSchema);

// Method to send a notification
Meteor.methods({
  'sendNotification': function(notificationData) {
    check(notificationData, Object);
# 优化算法效率
    check(notificationData.userId, String);
    check(notificationData.message, String);

    // Check if the user exists
    if (!Meteor.user()) {
      throw new Meteor.Error('not-authorized', 'User not authorized to send notifications');
    }

    // Insert the notification into the database
    const notificationId = Notifications.insert({
      userId: notificationData.userId,
      message: notificationData.message,
    });
# NOTE: 重要实现细节

    // Publish the new notification to the client
    Meteor.call('publishNotification', notificationId);
  },
  'publishNotification': function(notificationId) {
    // Security check to ensure the method is only run on the server
# 优化算法效率
    if (!Meteor.isServer) {
      throw new Meteor.Error('not-authorized', 'This method can only be called from the server');
    }

    // Publish the notification to all connected clients
    const notification = Notifications.findOne(notificationId);
    if (notification) {
      Meteor._debug('Publishing notification: ' + notification.message);
      Meteor.publish(null, function() {
        return Notifications.find({_id: notificationId});
      });
# 添加错误处理
    } else {
      throw new Meteor.Error('notification-not-found', 'Notification not found');
    }
  }
});

// Subscription for clients to receive notifications
# 添加错误处理
Meteor.subscribe('notifications');

// Error handling for notifications
Notifications.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
# TODO: 优化性能
});

// This function can be called to clean up old notifications, for example, after a certain period
function cleanUpNotifications() {
# NOTE: 重要实现细节
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  Notifications.remove({
    createdAt: { $lt: oneWeekAgo }
# NOTE: 重要实现细节
  });
}

// Schedule the cleanup function to run periodically
Meteor.setInterval(cleanUpNotifications, 604800000); // 604800000 ms = 1 week
