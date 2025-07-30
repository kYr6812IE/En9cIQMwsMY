// 代码生成时间: 2025-07-30 16:26:28
import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';

// RandomNumberGenerator class definition
class RandomNumberGenerator {
    // Constructor for the RandomNumberGenerator class
    constructor(min, max) {
        this.min = min;
        this.max = max;
    }

    // Method to generate a random number within the specified range
    generateRandomNumber() {
        // Check if the provided range is valid
        if (this.min > this.max) {
            throw new Error("Minimum value cannot be greater than maximum value.");
        }

        // Generate and return a random number using Meteor's Random module
        return Random.secret();
    }
}

// Export the RandomNumberGenerator class for use in other parts of the application
export const randomNumberGenerator = new RandomNumberGenerator(1, 100);

// Example usage within a Meteor method
Meteor.methods({
    'generateRandomNumber': function() {
        // Check if the method is being called from the client-side
        if (!Meteor.isServer) {
            throw new Meteor.Error("not-authorized", "This method can only be called from the server.");
        }

        // Generate a random number and return it
        return randomNumberGenerator.generateRandomNumber();
    }
});