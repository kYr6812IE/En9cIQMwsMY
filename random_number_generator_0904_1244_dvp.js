// 代码生成时间: 2025-09-04 12:44:48
import { Random } from 'meteor/random';

// RandomNumberGenerator.js
// This module provides a simple random number generator function.

// Generates a random number between min and max (inclusive)
function generateRandomNumber(min, max) {
  // Check if the inputs are valid numbers
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Invalid input: min and max must be numbers.');
  }

  // Check if max is greater than min
  if (max <= min) {
    throw new Error('Invalid input: max must be greater than min.');
  }

  // Calculate the random number using Meteor's built-in Random package
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

// Example usage:
try {
  const randomNumber = generateRandomNumber(1, 100);
  console.log(`Random number between 1 and 100: ${randomNumber}`);
} catch (error) {
  console.error(error.message);
}