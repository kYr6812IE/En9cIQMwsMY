// 代码生成时间: 2025-09-18 11:59:50
 * Features:
 * - Basic arithmetic operations (add, subtract, multiply, divide)
 * - Power and square root calculations
 * - Error handling
 *
 * This code follows JS best practices, is well-structured, and includes
 * comments for clarity and maintainability.
 */

// Import necessary Meteor packages and modules
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the MathToolbox namespace
const MathToolbox = {
  // Basic arithmetic operations
  add(a, b) {
    check(a, Number);
    check(b, Number);
    return a + b;
  },

  subtract(a, b) {
    check(a, Number);
    check(b, Number);
    return a - b;
  },

  multiply(a, b) {
    check(a, Number);
    check(b, Number);
    return a * b;
  },

  divide(a, b) {
    check(a, Number);
    check(b, Number);
    if (b === 0) {
      throw new Error('Cannot divide by zero.');
    }
    return a / b;
  },

  // Power and square root calculations
  power(a, b) {
    check(a, Number);
    check(b, Number);
    return Math.pow(a, b);
  },

  sqrt(a) {
    check(a, Number);
    if (a < 0) {
      throw new Error('Cannot calculate the square root of a negative number.');
    }
    return Math.sqrt(a);
  }
};

// Expose MathToolbox as a Meteor method for server-side execution
Meteor.methods({
  'mathToolbox.add': function(a, b) {
    return MathToolbox.add(a, b);
  },
  'mathToolbox.subtract': function(a, b) {
    return MathToolbox.subtract(a, b);
  },
  'mathToolbox.multiply': function(a, b) {
    return MathToolbox.multiply(a, b);
  },
  'mathToolbox.divide': function(a, b) {
    return MathToolbox.divide(a, b);
  },
  'mathToolbox.power': function(a, b) {
    return MathToolbox.power(a, b);
  },
  'mathToolbox.sqrt': function(a) {
    return MathToolbox.sqrt(a);
  }
});
