// 代码生成时间: 2025-08-30 11:21:09
// Meteor is assumed to be included, such as by being part of a Meteor application
// The following requires the DOMPurify package which is a DOM-only XSS Sanitizer
// Make sure to install it via NPM: `npm install dompurify`
import DOMPurify from 'dompurify';

/**
 * Sanitize input to prevent XSS attacks
 *
 * @param {string} input - The user input to be sanitized
 * @returns {string} - The sanitized input
 */
function sanitizeInput(input) {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Sanitize the input using DOMPurify
  // This will remove all potentially dangerous scripts and attributes
  return DOMPurify.sanitize(input);
}

/**
 * Example usage of sanitizeInput function
 */
try {
  const userInput = '<script>alert("xss")</script>';
  const safeInput = sanitizeInput(userInput);
  console.log('Sanitized Input:', safeInput);
} catch (error) {
  console.error('Error sanitizing input:', error.message);
}

// Export the sanitizeInput function for use in other parts of the application
export { sanitizeInput };
