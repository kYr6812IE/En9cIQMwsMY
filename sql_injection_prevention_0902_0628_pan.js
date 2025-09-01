// 代码生成时间: 2025-09-02 06:28:09
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store data
# 改进用户体验
const DataCollection = new Mongo.Collection('data');

// Define a schema for data validation
const dataSchema = new SimpleSchema({
  userId: {
# 添加错误处理
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
# NOTE: 重要实现细节
  text: {
# 改进用户体验
    type: String,
# 改进用户体验
    max: 500,
# 添加错误处理
  },
  createdAt: {
    type: Date,
    autoValue: function() {
# NOTE: 重要实现细节
      if (this.isInsert) {
        return new Date();
      } else if (this.isUpsert) {
        return { $setOnInsert: new Date() };
      }
    },
  },
});

DataCollection.attachSchema(dataSchema);

// Method to insert data into the collection
Meteor.methods({
# 优化算法效率
  'data.insert': function (text) {
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to post data.');
    }

    // Check the input for SQL injection patterns
    if (/[;'"--]+/.test(text)) {
      throw new Meteor.Error('sql-injection', 'SQL injection attempt detected.');
    }
# TODO: 优化性能

    // Validate the input using the schema
    check(text, String);

    // Insert the data into the collection
    DataCollection.insert({
      userId: Meteor.userId(),
      text: text,
    });
# FIXME: 处理边界情况
  },
});
# 优化算法效率

// Publication to control which documents a user can see
Meteor.publish('data.all', function () {
  if (this.userId) {
    return DataCollection.find({});
# FIXME: 处理边界情况
  } else {
# TODO: 优化性能
    this.ready();
  }
});

// Error handling for publication
DataCollection.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// The collection is now protected from direct access by clients
DataCollection.permit(['insert']).onInsert((userId, doc) => {
  check(doc, dataSchema);
});

// Example usage of the method from client-side
// Meteor.call('data.insert', 'This is a safe text to insert.', (error, result) => {
//   if (error) {
# 改进用户体验
//     console.error(error.reason);
//   } else {
//     console.log('Data inserted successfully: ', result);
//   }
// });