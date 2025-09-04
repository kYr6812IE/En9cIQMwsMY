// 代码生成时间: 2025-09-04 08:56:29
 * @author [Your Name]
 * @version 1.0
 * @date [Today's Date]
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection to store our data
const DataCollection = new Mongo.Collection('dataCollection');

// Define a function to insert data into the collection
export const insertData = (data) => {
  check(data, [Number]); // Ensure data is an array of numbers
  DataCollection.insert({ data });
};

// Define a sorting function using bubble sort algorithm
export const bubbleSort = (data) => {
  // Error handling for non-array input
  if (!Array.isArray(data) || !data.every(Number.isFinite)) {
    throw new Error('Invalid input for bubble sort: input must be an array of numbers.');
  }

  // Bubble sort algorithm implementation
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < data.length - 1; i++) {
      if (data[i] > data[i + 1]) {
        [data[i], data[i + 1]] = [data[i + 1], data[i]]; // Swap elements
        swapped = true;
      }
    }
  } while (swapped);
  return data;
};

// Define a Meteor method to perform sorting on server-side
Meteor.methods({
  'sortData': function (data) {
    // Check if the user is authorized to perform this action
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User not authorized to perform sorting.');
    }
    
    // Perform the bubble sort and return the sorted array
    return bubbleSort(data);
  },
});

// Define publications for the DataCollection
Meteor.publish('allData', function () {
  return DataCollection.find({});
});

// Define a simple client-side function to call the Meteor method and display results
export const sortAndDisplayData = (data) => {
  // Call the Meteor method and handle the result
  Meteor.call('sortData', data, (error, result) => {
    if (error) {
      console.error('Error sorting data:', error);
    } else {
      console.log('Sorted data:', result);
    }
  });
};

// Example usage of the sorting function
// sortAndDisplayData([5, 3, 8, 1, 2]);