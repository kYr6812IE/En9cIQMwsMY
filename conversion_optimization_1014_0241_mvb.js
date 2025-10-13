// 代码生成时间: 2025-10-14 02:41:24
// Meteor is a full-stack JavaScript platform, it includes a JavaScript runtime,
// a MongoDB database, a publish/subscribe data layer, and a templating engine.

// Import required packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store conversion data
export const Conversions = new Mongo.Collection('conversions');

// Define a schema for the conversion data
import { SimpleSchema } from 'meteor/alanning:simple-schema';
import { MeteorError } from 'meteor/alanning:simple-schema';
export const ConversionsSchema = new SimpleSchema({
  userId: {
    type: String,
  },
  action: {
    type: String,
  },
  timestamp: {
    type: Date,
    defaultValue: new Date(),
  },
  conversionStatus: {
    type: Boolean,
  },
  metadata: {
    type: Object,
    optional: true,
  },
  'metadata.*': {
    type: String,
  },
});

// Attach the schema to the collection
Conversions.attachSchema(ConversionsSchema);

// Method for logging conversions
Meteor.methods({
  'logConversion': function (userId, action, conversionStatus, metadata) {
    check(userId, String);
    check(action, String);
    check(conversionStatus, Boolean);
    check(metadata, { optional: true, type: Object });

    // Check if the user exists
    // You can implement user existence check based on your user collection
    // For example:
    // const userExists = Users.findOne({_id: userId}) ? true : false;
    // if (!userExists) {
    //   throw new MeteorError('user-not-found', 'User not found');
    // }

    // Insert the conversion data into the database
    try {
      Conversions.insert({
        userId,
        action,
        conversionStatus,
        metadata,
      });
    } catch (error) {
      // Handle any errors during database insertion
      throw new MeteorError('insert-error', 'Error inserting conversion data', error);
    }
  },
});

// Example usage of the logConversion method
// You would call this method from a client-side event handler or server-side code
// Meteor.call('logConversion', 'userId123', 'purchase', true, {source: 'email-campaign'}, (error, result) => {
//   if (error) {
//     console.error('Logging conversion failed:', error);
//   } else {
//     console.log('Conversion logged:', result);
//   }
// });

// You can create a publication if you need to expose conversion data to the client
Meteor.publish('conversions', function () {
  // You can implement access control and filtering here
  return Conversions.find();
});