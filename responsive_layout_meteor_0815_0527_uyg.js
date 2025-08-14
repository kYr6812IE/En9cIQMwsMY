// 代码生成时间: 2025-08-15 05:27:06
// responsive_layout_meteor.js
// This file contains the Meteor application logic for a responsive layout design.

// Import necessary Meteor packages and modules
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// Define a reactive variable to store the current screen size
const currentScreenSize = new ReactiveVar('');

// Function to determine the screen size and update the reactive variable
function updateScreenSize() {
  if (window.innerWidth <= 480) {
    currentScreenSize.set('small');
  } else if (window.innerWidth <= 768) {
    currentScreenSize.set('medium');
  } else {
    currentScreenSize.set('large');
  }
}

// Call the function on page load and set up a listener for window resizing
updateScreenSize();
window.addEventListener('resize', updateScreenSize);

// Define a template for the layout
Template.layout.helpers({
  // Helper to return the current screen size
  screenSize() {
    return currentScreenSize.get();
  }
});

// Define a template for the small screen layout
Template.smallLayout.helpers({
  // Helper to determine if the current screen size is small
  isSmall() {
    return Template.instance().helpers.get('screenSize') === 'small';
  }
});

// Define a template for the medium screen layout
Template.mediumLayout.helpers({
  // Helper to determine if the current screen size is medium
  isMedium() {
    return Template.instance().helpers.get('screenSize') === 'medium';
  }
});

// Define a template for the large screen layout
Template.largeLayout.helpers({
  // Helper to determine if the current screen size is large
  isLarge() {
    return Template.instance().helpers.get('screenSize') === 'large';
  }
});

// Add error handling for template rendering
Template.registerHelper('renderTemplate', (templateName) => {
  try {
    return Template[templateName];
  } catch (error) {
    console.error(`Error rendering template ${templateName}: ${error.message}`);
    return '';
  }
});

// Best practice: Export the necessary functions and variables for testing
export { updateScreenSize, currentScreenSize };
