// 代码生成时间: 2025-10-01 02:29:23
// Import necessary packages from Meteor
import { Mongo } from 'meteor/mongo';

// Define a new collection named 'Items'
const Items = new Mongo.Collection('items');

// Deny all client-side updates if not authenticated
Items.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; }
});

// Allow all client-side updates if authenticated
Items.allow({
  insert(userId, doc) {
    return !!userId;
  },
  update(userId, doc, fieldNames, modifier) {
    return !!userId && doc.owner === userId;
  },
  remove(userId, doc) {
    return !!userId && doc.owner === userId;
  },
});

// Define a schema for the Items collection using SimpleSchema
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { AutoValue } from 'meteor/aldeed:autovalue';

const itemSchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name',
    max: 200
  },
  description: {
    type: String,
    label: 'Description',
    optional: true
  },
  createdAt: {
    type: Date,
    optional: true,
    autoValue: () => {
      return new Date(); // Set current date and time as the creation date
    },
  },
  owner: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    label: 'Owner',
    optional: true,
    autoValue: (doc) => {
      return doc.userId || ''; // Assign the current user as the owner
    },
    denyUpdate: true // Prevent changing the owner of an item
  }
});

// Attach the schema to the collection
Items.attachSchema(itemSchema);

// Export the collection for use in other parts of the application
export { Items, itemSchema };