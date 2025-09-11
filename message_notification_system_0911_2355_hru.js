// 代码生成时间: 2025-09-11 23:55:55
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store messages
const Messages = new Mongo.Collection('messages');

// Define schema for messages collection (using SimpleSchema for validation)
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
const messageSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'User ID'
  },
  message: {
    type: String,
    label: 'Notification Message'
  },
  timestamp: {
    type: Date,
    label: 'Timestamp',
    autoValue: function() {
      return new Date();
    }
  }
});

Messages.attachSchema(messageSchema);

// Publish all messages
Meteor.publish('allMessages', function() {
  return Messages.find();
});

// Method to insert a new message
Meteor.methods({
  'addMessage': function(message) {
    check(message, Object);

    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add a message.');
    }

    // Add user ID to the message
    message.userId = Meteor.userId();
    message.timestamp = new Date();

    // Insert the message into the collection
    const messageId = Messages.insert(message);

    // Notify all clients about the new message
    Meteor.call('notifyAll');

    return messageId;
  },
  'notifyAll': function() {
    // Publish a notification to all clients
    Meteor._debug('Broadcasting notification to all clients...');
  }
});

// Client code to subscribe to messages and handle notifications
Meteor.startup(() => {
  // Subscribe to all messages
  Meteor.subscribe('allMessages');

  // Method to handle incoming notifications
  const notificationMethod = Meteor.methods['notifyAll'];
  Meteor.call('notifyAll'); // Initialize notification

  // Setup a listener for notifications
  const notificationListener = Meteor.setInterval(() => {
    notificationMethod._execute();
  }, 5000); // Check for new notifications every 5 seconds

  // Clear the interval when the client is disconnected
  Meteor.onConnection((connection) => {
    connection.onClose(() => {
      Meteor.clearInterval(notificationListener);
    });
  });
});
