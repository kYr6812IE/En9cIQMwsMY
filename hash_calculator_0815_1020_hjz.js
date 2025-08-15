// 代码生成时间: 2025-08-15 10:20:37
import { Meteor } from 'meteor/meteor';
import { SHA256 } from 'meteor/sha';

// HashCalculator is a class that provides functionality for calculating hashes.
class HashCalculator {
  // Calculates the SHA-256 hash of the provided string.
  static calculateSha256(input) {
    try {
      // Check if input is provided
      if (!input) {
        throw new Error('Input must not be empty');
      }
      // Calculate the hash and return it
      return SHA256(input);
    } catch (error) {
      // Handle any errors that occur during the hashing process
      console.error('Error calculating hash:', error.message);
      throw error;
    }
  }
}

// Expose the HashCalculator class as a Meteor method
Meteor.methods({
  'hashCalculator.calculateSha256': function (input) {
    // Check if the client is authorized to call this method
    if (!this.isSimulation) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to perform this action.');
    }
    // Use the static method to calculate the hash
    return HashCalculator.calculateSha256(input);
  }
});

// Example usage:
// const hashedValue = Meteor.call('hashCalculator.calculateSha256', 'Your input string here');
// console.log(hashedValue);
