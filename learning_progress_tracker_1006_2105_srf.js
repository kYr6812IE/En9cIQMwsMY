// 代码生成时间: 2025-10-06 21:05:47
// Meteor application for tracking learning progress

// Import necessary packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store learning progress
const LearningProgress = new Mongo.Collection('learningProgress');

// Define the schema for learning progress documents
const LearningProgressSchema = new SimpleSchema({
  userId: {
    type: String,
    label: 'User ID',
    index: true,
  },
  courseId: {
    type: String,
    label: 'Course ID',
    index: true,
  },
  progress: {
    type: Number,
    label: 'Progress percentage',
    min: 0,
    max: 100,
  },
  lastUpdated: {
    type: Date,
    label: 'Last updated date',
  },
});

// Attach the schema to the collection
LearningProgress.attachSchema(LearningProgressSchema);

// Method to add or update learning progress
Meteor.methods({
  'learningProgress.addOrUpdate': function (userId, courseId, progress) {
    // Check arguments
    check(userId, String);
    check(courseId, String);
    check(progress, Number);

    // Find if the learning progress already exists
    const existingProgress = LearningProgress.findOne({
      userId,
      courseId,
    });

    // If it exists, update the progress
    if (existingProgress) {
      LearningProgress.update({
        _id: existingProgress._id,
      }, {
        $set: {
          progress,
          lastUpdated: new Date(),
        },
      });
    } else {
      // Otherwise, insert a new document
      LearningProgress.insert({
        userId,
        courseId,
        progress,
        lastUpdated: new Date(),
      });
    }
  },
});

// Publish the learning progress documents
Meteor.publish('learningProgress', function (userId) {
  check(userId, String);
  return LearningProgress.find({ userId });
});

// Error handling
// Add error handling for methods and publications if necessary
Meteor.startup(() => {
  // Code to run on server startup (e.g., data migration, indexing)
  // Implement any server-side error handling here
});

// Client-side code
if (Meteor.isClient) {
  // Client-side code to subscribe to the learning progress publication
  Tracker.autorun(() => {
    const userId = Meteor.userId();
    if (userId) {
      Meteor.subscribe('learningProgress', userId);
    }
  });

  // Client-side code to call the 'learningProgress.addOrUpdate' method
  Template.body.events({
    'submit .learning-progress-form': function (event) {
      event.preventDefault();
      const $form = $(event.target);
      const userId = Meteor.userId();
      const courseId = $form.find('input[name="courseId"]').val();
      const progress = $form.find('input[name="progress"]').val();

      // Add error handling for client-side input
      try {
        Meteor.call('learningProgress.addOrUpdate', userId, courseId, progress, (error, result) => {
          if (error) {
            // Handle the error
            console.error('Error adding or updating learning progress:', error);
          } else {
            // Handle the success
            console.log('Learning progress updated successfully:', result);
          }
        });
      } catch (error) {
        // Handle any exceptions
        console.error('Exception caught:', error);
      }
    },
  });
}
