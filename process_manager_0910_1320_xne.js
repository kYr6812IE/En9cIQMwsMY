// 代码生成时间: 2025-09-10 13:20:30
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Define a helper function to get system processes
const getProcesses = () => {
  try {
    // Execute the 'ps' command to get the list of processes
    const { result } = HTTP.call('GET', 'http://localhost:4000/ps', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });

    // Parse the JSON response and return the processes
    return JSON.parse(result);
  } catch (error) {
    // Handle any errors that occur during the process retrieval
    console.error('Error fetching processes:', error);
    throw new Meteor.Error('error-fetching-processes', 'Error fetching system processes');
  }
};

// Define a Meteor method to get the system processes
Meteor.methods({
  'processManager.getProcesses': function () {
    check(this.userId, String); // Ensure the user is logged in

    try {
      // Retrieve the system processes
      const processes = getProcesses();

      // Return the list of processes
      return processes;
    } catch (error) {
      // Handle any errors that occur during the process retrieval
      console.error('Error retrieving processes:', error);
      throw new Meteor.Error('error-retrieving-processes', 'Error retrieving system processes');
    }
  }
});

// Define a publication to broadcast the system processes to the client
Meteor.publish('processManager.processes', function () {
  check(this.userId, String); // Ensure the user is logged in

  return Meteor.call('processManager.getProcesses');
});
