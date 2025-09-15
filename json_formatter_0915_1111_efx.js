// 代码生成时间: 2025-09-15 11:11:59
// Import necessary Meteor packages and modules
# TODO: 优化性能
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
# NOTE: 重要实现细节
import { ReactiveVar } from 'meteor/reactive-var';

// Create a new Meteor method to format JSON data
Meteor.methods({
  'formatJSON': function(jsonString) {
    // Check if the user is logged in, for example
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to format JSON.');
    }
    
    try {
      // Attempt to parse the JSON string
      const parsedJson = JSON.parse(jsonString);
      // Format the parsed JSON data
      const formattedJson = JSON.stringify(parsedJson, null, 2);
# FIXME: 处理边界情况
      // Return the formatted JSON string
# TODO: 优化性能
      return formattedJson;
    } catch (error) {
      // If an error occurs, throw a Meteor.Error with the error message
      throw new Meteor.Error('invalid-json', 'Invalid JSON format: ' + error.message);
    }
  }
});

// Define a template for the JSONFormatter
Template.jsonFormatter.onCreated(function() {
# 优化算法效率
  // Initialize a reactive variable to hold the formatted JSON
# FIXME: 处理边界情况
  this.formattedJson = new ReactiveVar('');
});

Template.jsonFormatter.helpers({
  // Helper function to get the formatted JSON
  formattedJson() {
    return Template.instance().formattedJson.get();
  }
# 改进用户体验
});

Template.jsonFormatter.events({
# 优化算法效率
  'submit .json-form'(event, templateInstance) {
    event.preventDefault();
    
    // Get the JSON string from the input field
    const jsonString = event.target.jsonInput.value;
    
    // Call the Meteor method and wait for the result
    Meteor.call('formatJSON', jsonString, (error, result) => {
      if (error) {
        // Handle any errors that occur during the formatting process
        console.error('Error formatting JSON:', error.reason);
        templateInstance.formattedJson.set(error.reason);
      } else {
        // Set the formatted JSON in the reactive variable
        templateInstance.formattedJson.set(result);
      }
    });
  }
});

// Example usage in HTML
// <form class="json-form">
//   <textarea name="jsonInput"></textarea>
//   <input type="submit" value="Format JSON">
// </form>
