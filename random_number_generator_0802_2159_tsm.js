// 代码生成时间: 2025-08-02 21:59:30
// Import necessary packages from Meteor
import { Random } from 'meteor/random';

/**
 * Function to generate a random number
 * @param {number} min - The minimum value of the random number
 * @param {number} max - The maximum value of the random number
 * @returns {number} A random number between min and max
 */
function generateRandomNumber(min, max) {
  // Validate input arguments
  if (typeof min !== 'number' || typeof max !== 'number') {
    throw new Error('Invalid input: min and max must be numbers.');
  }

  if (min > max) {
    throw new Error('Invalid input: min cannot be greater than max.');
  }

  // Generate and return the random number
  return Math.floor(Random.fraction() * (max - min + 1) + min);
}

// Example usage
try {
  const randomNumber = generateRandomNumber(1, 100);
  console.log(`Generated random number: ${randomNumber}`);
} catch (error) {
  console.error(`Error: ${error.message}`);
}