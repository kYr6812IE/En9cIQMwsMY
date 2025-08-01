// 代码生成时间: 2025-08-01 13:09:32
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

// ReactiveVar to store the current screen size
const currentScreenSize = new ReactiveVar('small');

// Template for the main layout
Template.mainLayout.helpers({
  // Helper function to determine the screen size class
  screenSizeClass() {
    // Check the current screen size and return the appropriate class
    switch (currentScreenSize.get()) {
      case 'small':
        return 'small-screen';
      case 'medium':
        return 'medium-screen';
      case 'large':
        return 'large-screen';
      default:
        return '';
    }
  }
});

// Template for the mobile view
Template.mobileView.helpers({
  // Example helper function for mobile view
  mobileData() {
    return 'Data for mobile view';
  }
});

// Template for the desktop view
Template.desktopView.helpers({
  // Example helper function for desktop view
  desktopData() {
    return 'Data for desktop view';
  }
});

// Event handler to update screen size on window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  if (width < 576) {
    currentScreenSize.set('small');
  } else if (width >= 576 && width < 992) {
    currentScreenSize.set('medium');
  } else {
    currentScreenSize.set('large');
  }
});

// Initialize screen size on app startup
Meteor.startup(() => {
  const width = window.innerWidth;
  if (width < 576) {
    currentScreenSize.set('small');
  } else if (width >= 576 && width < 992) {
    currentScreenSize.set('medium');
  } else {
    currentScreenSize.set('large');
  }
});
