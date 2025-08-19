// 代码生成时间: 2025-08-19 09:02:28
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

/**
 * MathTools - A class to encapsulate all the mathematical calculation tools.
 */
class MathTools {
  // Constructor
  constructor() {
    // Initialize the ReactiveVar for storing the result
    this.result = new ReactiveVar(null);
  }

  /**
   * Add two numbers.
   * @param {number} num1 - The first number.
   * @param {number} num2 - The second number.
   * @returns {number} - The sum of num1 and num2.
   */
  add(num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }
    return num1 + num2;
  }

  /**
   * Subtract two numbers.
   * @param {number} num1 - The first number.
   * @param {number} num2 - The second number.
   * @returns {number} - The difference of num1 and num2.
   */
  subtract(num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }
    return num1 - num2;
  }

  /**
   * Multiply two numbers.
   * @param {number} num1 - The first number.
   * @param {number} num2 - The second number.
   * @returns {number} - The product of num1 and num2.
   */
  multiply(num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }
    return num1 * num2;
  }

  /**
   * Divide two numbers.
   * @param {number} num1 - The first number.
   * @param {number} num2 - The second number.
   * @returns {number} - The quotient of num1 and num2.
   */
  divide(num1, num2) {
    if (typeof num1 !== 'number' || typeof num2 !== 'number') {
      throw new Error('Both arguments must be numbers.');
    }
    if (num2 === 0) {
      throw new Error('Cannot divide by zero.');
    }
    return num1 / num2;
  }
}

// Create an instance of MathTools
const mathTools = new MathTools();

// Create a Meteor method to perform calculations
Meteor.methods({
  'mathTools.add': function(num1, num2) {
    return mathTools.add(num1, num2);
  },
  'mathTools.subtract': function(num1, num2) {
    return mathTools.subtract(num1, num2);
  },
  'mathTools.multiply': function(num1, num2) {
    return mathTools.multiply(num1, num2);
  },
  'mathTools.divide': function(num1, num2) {
    return mathTools.divide(num1, num2);
  }
});

// Helper function to update the result ReactiveVar
function updateResult(result) {
  mathTools.result.set(result);
}

// Create a template for the Math Tools UI
Template.mathTools.helpers({
  'result': function() {
    return mathTools.result.get();
  }
});

// Create a template for the Math Tools UI
Template.mathTools.events({
  'click button.add': function(event) {
    const num1 = Template.instance().num1.get();
    const num2 = Template.instance().num2.get();
    Meteor.call('mathTools.add', num1, num2, (error, result) => {
      if (error) {
        console.error('Error adding numbers:', error);
      } else {
        updateResult(result);
      }
    });
  },
  'click button.subtract': function(event) {
    const num1 = Template.instance().num1.get();
    const num2 = Template.instance().num2.get();
    Meteor.call('mathTools.subtract', num1, num2, (error, result) => {
      if (error) {
        console.error('Error subtracting numbers:', error);
      } else {
        updateResult(result);
      }
    });
  },
  'click button.multiply': function(event) {
    const num1 = Template.instance().num1.get();
    const num2 = Template.instance().num2.get();
    Meteor.call('mathTools.multiply', num1, num2, (error, result) => {
      if (error) {
        console.error('Error multiplying numbers:', error);
      } else {
        updateResult(result);
      }
    });
  },
  'click button.divide': function(event) {
    const num1 = Template.instance().num1.get();
    const num2 = Template.instance().num2.get();
    Meteor.call('mathTools.divide', num1, num2, (error, result) => {
      if (error) {
        console.error('Error dividing numbers:', error);
      } else {
        updateResult(result);
      }
    });
  }
});