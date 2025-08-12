// 代码生成时间: 2025-08-12 16:15:54
import { Random } from 'meteor/random';

/**
 * RandomNumberGenerator class
 * This class provides capabilities to generate random numbers.
 * It follows best practices for JavaScript development.
 */
class RandomNumberGenerator {

    /**
     * Generates a random number between a minimum and maximum value.
     *
     * @param {number} min - The minimum value of the random number.
     * @param {number} max - The maximum value of the random number.     *
     * @returns {number} A random number between min and max.
     * @throws Will throw an error if min is greater than max.
     */
    static generateRandom(min, max) {
        // Error handling for invalid input
        if (min > max) {
            throw new Error('Minimum value cannot be greater than maximum value.');
        }

        // Using Meteor's Random API to generate a random number
        const randomNumber = Random.numberInRange(min, max - 1);
        return randomNumber;
    }
}

// Usage example
try {
    const randomNumber = RandomNumberGenerator.generateRandom(1, 100);
    console.log(`Generated random number: ${randomNumber}`);
} catch (error) {
    console.error(`Error: ${error.message}`);
}