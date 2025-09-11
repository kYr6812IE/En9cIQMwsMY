// 代码生成时间: 2025-09-11 16:19:22
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

// Define the MathToolkit namespace
const MathToolkit = {};

// Add function
MathToolkit.add = function(a, b) {
    check(a, Number);
    check(b, Number);
    if (isNaN(a) || isNaN(b)) {
        throw new Meteor.Error('invalid-number', 'Both arguments must be numbers');
    }
    return a + b;
};

// Subtract function
MathToolkit.subtract = function(a, b) {
    check(a, Number);
    check(b, Number);
    if (isNaN(a) || isNaN(b)) {
        throw new Meteor.Error('invalid-number', 'Both arguments must be numbers');
    }
    return a - b;
};

// Multiply function
MathToolkit.multiply = function(a, b) {
    check(a, Number);
    check(b, Number);
    if (isNaN(a) || isNaN(b)) {
        throw new Meteor.Error('invalid-number', 'Both arguments must be numbers');
    }
    return a * b;
};

// Divide function
MathToolkit.divide = function(a, b) {
    check(a, Number);
    check(b, Number);
    if (isNaN(a) || isNaN(b)) {
        throw new Meteor.Error('invalid-number', 'Both arguments must be numbers');
    }
    if (b === 0) {
        throw new Meteor.Error('division-by-zero', 'Cannot divide by zero');
    }
    return a / b;
};

// Export the MathToolkit
export { MathToolkit };
