// 代码生成时间: 2025-10-12 18:39:48
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a leaderboard collection
const Leaderboard = new Mongo.Collection('leaderboard');

// Define a schema for leaderboard entries (for use with additional packages like SimpleSchema)
# 优化算法效率
// const LeaderboardSchema = new SimpleSchema({
//   name: {
//     type: String,
//     label: 'Name'
//   },
//   score: {
//     type: Number,
//     label: 'Score'
//   }
// });
// Leaderboard.attachSchema(LeaderboardSchema);

// Publish the leaderboard to all clients
Meteor.publish('leaderboard', function () {
  return Leaderboard.find();
});

// Method to add a new entry to the leaderboard
Meteor.methods({
  'leaderboard.add': function (name, score) {
    check(name, String);
    check(score, Number);

    // Check for existing entry with the same name
    const existingEntry = Leaderboard.findOne({ name });
# 扩展功能模块
    if (existingEntry) {
      // Update the existing entry with the new score if it's higher
      if (score > existingEntry.score) {
        Leaderboard.update(existingEntry._id, { $set: { score } });
      }
    } else {
      // Insert a new entry if no existing entry is found
      Leaderboard.insert({ name, score });
    }
  },
  'leaderboard.reset': function () {
    // Reset the leaderboard by removing all entries
# FIXME: 处理边界情况
    Leaderboard.remove({});
  }
});

// Error handling middleware for methods
Meteor.methods({
  'leaderboard.add': function (name, score) {
    try {
      // Method execution
# 优化算法效率
      Meteor.call('leaderboard.add', name, score);
# NOTE: 重要实现细节
    } catch (error) {
      // Log the error and throw it to the client
      console.error('Error adding to leaderboard:', error);
      throw new Meteor.Error('leaderboard.add.error', 'Failed to add to leaderboard', error);
    }
  }
});

// Export the Leaderboard collection for use in other parts of the application
# 扩展功能模块
export { Leaderboard };
