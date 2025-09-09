// 代码生成时间: 2025-09-10 01:47:01
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

/**
 * APIResponseFormatter class
 * @class
 */
class APIResponseFormatter {
  
  // Constructor
  constructor() {
    // Initialize any necessary properties or methods here
  }

  /**
   * Formats the response to include status code and message
   * @param {Object} response - The original response object
   * @param {Number} statusCode - The HTTP status code to use
   * @returns {Object} - The formatted response object
   */
  formatResponse(response, statusCode) {
    // Check for valid status code
    if (statusCode < 200 || statusCode >= 600) {
      throw new Meteor.Error('InvalidStatusCode', 'Status code must be between 200 and 599');
    }

    // Create the formatted response object
    const formattedResponse = {
      statusCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    };

    // Return the formatted response
    return formattedResponse;
  }

  /**
   * Handles errors and formats the error response
   * @param {Error} error - The error object to format
   * @returns {Object} - The formatted error response object
   */
  formatErrorResponse(error) {
    // Define the default error message and status code
    const defaultErrorMessage = 'An unexpected error occurred';
    const defaultErrorCode = 500;

    // Check if the error is a Meteor.Error and use its properties, otherwise use defaults
    const errorMessage = error instanceof Meteor.Error ? error.reason : defaultErrorMessage;
    const errorCode = error instanceof Meteor.Error ? error.error : defaultErrorCode;

    // Create the formatted error response object
    const formattedErrorResponse = {
      statusCode: errorCode,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        success: false,
        message: errorMessage
      })
    };

    // Return the formatted error response
    return formattedErrorResponse;
  }
}

// Export the APIResponseFormatter class for use in other parts of the application
export { APIResponseFormatter };

/* Example usage:
 * const apiFormatter = new APIResponseFormatter();
 * try {
 *   const data = HTTP.call('GET', 'https://api.example.com/data');
 *   const response = apiFormatter.formatResponse(data.data, 200);
 * } catch (error) {
 *   const errorResponse = apiFormatter.formatErrorResponse(error);
 * }
 */