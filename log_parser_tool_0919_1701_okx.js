// 代码生成时间: 2025-09-19 17:01:39
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';

// Define a schema for log entries
const LogEntry = new SimpleSchema({
  timestamp: {
    type: Date,
    label: "Timestamp"
  },
  level: {
    type: String,
    label: "Log Level",
    allowedValues: ['info', 'warn', 'error', 'debug']
  },
  message: {
    type: String,
    label: "Log Message"
  }
});

// Create a collection to store parsed log entries
const LogEntries = new Mongo.Collection("logEntries");

// Attach the schema to the collection
LogEntries.attachSchema(LogEntry);

// Function to parse a log file
function parseLogFile(logfile) {
  try {
    // Read the log file content
    const fileContent = FS.File.findOne({ filename: logfile });

    if (!fileContent) {
      throw new Error("Log file not found.");
    }

    // Split the file content into lines
    const lines = fileContent.content.toString().split('\
');

    // Iterate over each line and parse it
    lines.forEach((line) => {
      // Assuming the log format is: [TIMESTAMP] [LEVEL] Message
      const parts = line.trim().split(/\s+/);
      if (parts.length < 3) return;

      const timestamp = new Date(parts[0]);
      const level = parts[1];
      const message = parts.slice(2).join(' ');

      // Insert the parsed log entry into the collection
      LogEntries.insert({
        timestamp,
        level,
        message
      });
    });

    console.log("Log file parsed successfully.");
  } catch (error) {
    console.error("Error parsing log file: ", error.message);
  }
}

// Meteor method to parse a log file from the client
Meteor.methods({
  parseLogFile(logfile) {
    // Simple check to ensure the method is called from the client
    if (!Meteor.isClient) {
      throw new Meteor.Error(403, "This method can only be called from the client.");
    }

    // Call the parseLogFile function
    parseLogFile(logfile);
  }
});

// Client-side code to handle file upload and parsing
Template.upload.onCreated(function() {
  this.file = new ReactiveVar(null);
});

Template.upload.events({
  'change #fileInput'(event) {
    const file = event.target.files[0];
    if (file) {
      // Set the file reactive variable
      Template.instance().file.set(file);
    }
  },
  'click #parseButton'(event) {
    event.preventDefault();
    const file = Template.instance().file.get();
    if (file) {
      // Call the parseLogFile method from the server
      Meteor.call('parseLogFile', file.name, (error, result) => {
        if (error) {
          console.error("Error parsing log file: ", error.message);
        } else {
          console.log("Log file parsed successfully.");
        }
      });
    }
  }
});