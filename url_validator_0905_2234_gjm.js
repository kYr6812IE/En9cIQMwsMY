// 代码生成时间: 2025-09-05 22:34:46
import { Meteor } from 'meteor/meteor';

// URLValidator class defines the functionality for URL validation
class URLValidator {
  // Validates a URL by checking its existence and format
  isValid(url) {
    try {
      // Use the new URL constructor to parse the URL and check its validity
      new URL(url);
      return true;
    } catch (error) {
      // If the URL is invalid, catch the error and return false
      console.error('Invalid URL:', error);
      return false;
    }
  }
}

// Instantiate the URLValidator class
const urlValidator = new URLValidator();

// Expose the URL validation functionality as a Meteor method
Meteor.methods({
  'validateUrl': function(url) {
    // Check if the URL is provided
    if (!url) {
      throw new Meteor.Error('invalid-url', 'No URL provided');
    }

    // Check if the URL is valid
    const isValid = urlValidator.isValid(url);
    if (!isValid) {
      throw new Meteor.Error('invalid-url', 'The provided URL is invalid');
    }

    // If the URL is valid, return a success message
    return {
      message: 'URL is valid',
      isValid
    };
  }
});

// Documentation
/**
 * This Meteor method checks if a provided URL is valid.
 * @param {string} url - The URL to be validated
 * @returns {{message: string, isValid: boolean}} - An object containing a success message and validity status
 * @throws {Meteor.Error} - Throws an error if the URL is invalid or not provided
 */
