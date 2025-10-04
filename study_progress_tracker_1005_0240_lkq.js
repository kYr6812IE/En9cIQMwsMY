// 代码生成时间: 2025-10-05 02:40:34
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check, Match } from 'meteor/check';

// Collection to store study progress data
const StudyProgress = new Mongo.Collection('studyProgress');
# 扩展功能模块

// Schema for the study progress data, ensuring data integrity
const ProgressSchema = new SimpleSchema({
  userId: {
    type: String,
# TODO: 优化性能
    regEx: SimpleSchema.RegEx.Id
  },
  courseName: {
    type: String
  },
  percentageCompleted: {
    type: Number,
    min: 0,
    max: 100
  },
# 添加错误处理
  lastUpdated: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
# 改进用户体验
      } else {
        this.unset();
      }
    }
  }
});
# 优化算法效率

// Attaching schema to the collection
StudyProgress.attachSchema(ProgressSchema);

// Publication for study progress data
Meteor.publish('studyProgress', function() {
# 扩展功能模块
  check(this.userId, String);
  return StudyProgress.find({ userId: this.userId });
# 改进用户体验
});

// Method to add/update study progress
Meteor.methods({
  'addOrUpdateStudyProgress': function(progressData) {
    check(progressData, {
      userId: String,
      courseName: String,
      percentageCompleted: Number
# FIXME: 处理边界情况
    });

    const userProgress = StudyProgress.findOne({ userId: progressData.userId, courseName: progressData.courseName });
# 增强安全性

    if (userProgress) {
      // Update existing progress
      StudyProgress.update({ _id: userProgress._id }, { $set: {
        percentageCompleted: progressData.percentageCompleted,
        lastUpdated: new Date()
      } });
    } else {
      // Insert new progress
      StudyProgress.insert(progressData);
    }
# 扩展功能模块
  },

  // Method to remove study progress for a course
  'removeStudyProgress': function(progressId) {
# 优化算法效率
    check(progressId, String);
    StudyProgress.remove(progressId);
  }
});

// Error handling for Meteor methods
Meteor.startup(() => {
  // Error handling for method calls
  Meteor.call.error((error) => {
    console.error('Meteor method error:', error);
  });

    // Error handling for publication
    if (Meteor.isServer) {
      Meteor.publish.error((error, args) => {
# 增强安全性
        console.error('Meteor publish error:', error);
      });
    }
  });

// Client-side code to call methods and handle data
if (Meteor.isClient) {
# NOTE: 重要实现细节
  // Reactive data source for study progress
  Template.studyProgress.helpers({
    progressData() {
      return StudyProgress.find();
    }
# NOTE: 重要实现细节
  });

  Template.studyProgress.events({
    // Event to call addOrUpdateStudyProgress method
    'submit .study-progress-form'(event) {
      event.preventDefault();
      const { userId, courseName, percentageCompleted } = event.target;
      Meteor.call('addOrUpdateStudyProgress', {
        userId: userId.value,
        courseName: courseName.value,
        percentageCompleted: percentageCompleted.value
      }, (error) => {
        if (error) {
          // Handle error
          console.error('Error adding/updating study progress:', error);
# 增强安全性
        } else {
          // Handle success
# 优化算法效率
          console.log('Study progress added/updated successfully');
        }
      });
    },

    // Event to call removeStudyProgress method
    'click .remove-progress'(event) {
      event.preventDefault();
# NOTE: 重要实现细节
      const progressId = event.target.getAttribute('data-progress-id');
      Meteor.call('removeStudyProgress', progressId, (error) => {
        if (error) {
          // Handle error
          console.error('Error removing study progress:', error);
        } else {
# 扩展功能模块
          // Handle success
          console.log('Study progress removed successfully');
        }
      });
# NOTE: 重要实现细节
    }
  });
}