// 代码生成时间: 2025-09-24 07:59:13
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a new Meteor method for document conversion
Meteor.methods({
  'convertDocument': function(contentType, content, targetFormat) {
    // Input validation
    if (!contentType || !content || !targetFormat) {
      throw new Meteor.Error('invalid-input', 'Invalid input parameters.');
    }

    // Implement your document conversion logic here
    // For demonstration purposes, this is a simple mock conversion
    let convertedContent = '';
    
    try {
      // Mock conversion logic
      if (targetFormat === 'pdf') {
        convertedContent = `Converted ${contentType} content to PDF.`;
      } else if (targetFormat === 'docx') {
        convertedContent = `Converted ${contentType} content to DOCX.`;
      } else {
        throw new Meteor.Error('unsupported-format', 'Unsupported target format.');
      }
    } catch (error) {
      // Handle conversion errors
      throw new Meteor.Error('conversion-error', error.message);
    }

    // Return the converted content
    return convertedContent;
  }
});

// Define a helper function to display conversion results
Template.documentConverter.helpers({
  convertResult: function() {
    return Template.instance().convertResult.get();
  }
});

// Define an event handler for document conversion
Template.documentConverter.events({
  'submit .convert-form': function(event, templateInstance) {
    event.preventDefault();

    // Get the form values
    const contentType = event.target.contentType.value;
    const content = event.target.content.value;
    const targetFormat = event.target.targetFormat.value;

    // Call the Meteor method for document conversion
    Meteor.call('convertDocument', contentType, content, targetFormat, (error, result) => {
      if (error) {
        // Handle errors
        templateInstance.convertResult.set(error.reason);
      } else {
        // Set the conversion result
        templateInstance.convertResult.set(result);
      }
    });
  }
});

// Initialize the reactive variable for conversion results
Template.documentConverter.onCreated(function() {
  this.convertResult = new ReactiveVar('');
});
