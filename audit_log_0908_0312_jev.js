// 代码生成时间: 2025-09-08 03:12:02
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Create a collection to store audit logs
const AuditLogs = new Mongo.Collection('auditLogs');

// Define the schema for audit logs
const AuditLogSchema = new SimpleSchema({
  action: {
    type: String,
    label: 'The action that was performed'
  },
  user: {
    type: String,
    optional: true,
    label: 'The user who performed the action',
    autoValue: function() {
      // Set user to this.userId when available
      if (this.isInsert && this.userId) {
        return this.userId;
      }
    }
  },
  timestamp: {
    type: Date,
    autoValue: function() {
      // Set timestamp to the current date and time
      return new Date();
    }
  },
  ip: {
    type: String,
    optional: true,
    label: 'The IP address of the user'
  },
  // Additional fields can be added as needed
});

// Attach schema to collection
AuditLogs.attachSchema(AuditLogSchema);

// Helper function to log an audit entry
function logAudit(action, user, ip) {
  try {
    // Check that the action is a string
    check(action, String);
    // Check that the user is either a string or undefined
    check(user, Match.Maybe(String));
    // Check that the IP is either a string or undefined
    check(ip, Match.Maybe(String));
    
    // Insert the audit log into the collection
    AuditLogs.insert({ action, user, ip });
  } catch (error) {
    // Handle any errors that occur during logging
    console.error('Error logging audit entry:', error);
  }
}

// Publish audit logs for authorized users
Meteor.publish('auditLogs', function() {
  if (this.userId) {
    return AuditLogs.find({});
  } else {
    // Throw an error if the user is not logged in
    throw new Meteor.Error('not-authorized', 'Access denied. You must be logged in to view audit logs.');
  }
});

// Example usage of logAudit function, called when a user performs an action
Meteor.methods({
  'performAction': function(action, ip) {
    try {
      // Check that the action is a string and the IP is a string
      check(action, String);
      check(ip, String);
      
      // Perform the action here
      // ...
      
      // Log the audit entry after performing the action
      logAudit(action, this.userId, ip);
    } catch (error) {
      throw new Meteor.Error('invalid-action', 'Invalid action or IP.', error);
    }
  }
});