// 代码生成时间: 2025-08-08 17:24:09
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a helper function to calculate statistics
const calculateStatistics = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error('Invalid data provided for statistics calculation');
  }

  const sum = data.reduce((acc, val) => acc + val, 0);
  const mean = sum / data.length;
  const max = Math.max(...data);
  const min = Math.min(...data);

  return {
    sum,
    mean,
    max,
    min
  };
};

// ReactiveVar to hold the data
const data = new ReactiveVar([]);

// Template for data input
Template.dataInput.helpers({
  data() {
    return data.get();
  },
});

Template.dataInput.events({
  'submit form': (event, templateInstance) => {
    event.preventDefault();
    const inputField = templateInstance.$('input[type="text"]');
    const inputData = inputField.val().split(',').map(Number);

    try {
      const stats = calculateStatistics(inputData);
      data.set(stats);
      inputField.val('');
    } catch (error) {
      alert(error.message);
    }
  },
});

// Template for displaying the statistics
Template.statistics.helpers({
  statistics() {
    return data.get();
  },
});

// Main function to start the Meteor application
Meteor.startup(() => {
  // Render the data input template
  Template.dataInput.render('dataInput');
  // Render the statistics template
  Template.statistics.render('statistics');
});