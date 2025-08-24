// 代码生成时间: 2025-08-24 11:18:10
import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

// Reactive variable to store the connection status
const connectionStatus = new ReactiveVar('disconnected');

// Function to check the network connection status
function checkConnectionStatus() {
  // Check if there is an active Meteor connection
  const isConnected = Meteor.status().status === 'connected';
  // Update the connection status
  connectionStatus.set(isConnected ? 'connected' : 'disconnected');
  // Log the connection status
  console.log(`Connection status: ${connectionStatus.get()}`);
}

// Function to handle connection status change
function onConnectionStatusChange(status) {
  // If the connection status is not 'connected', check the connection status again after 5 seconds
  if (status.status !== 'connected') {
    setTimeout(() => {
      checkConnectionStatus();
    }, 5000);
  }
}

// Start checking the connection status when the app starts
Meteor.startup(() => {
  checkConnectionStatus();
  // Listen for connection status changes
  Meteor.status().onChange(onConnectionStatusChange);
});

// Helper function to get the current connection status
function getConnectionStatus() {
  return connectionStatus.get();
}

// Export the helper function for use in other modules
export { getConnectionStatus };

// Example usage of the getConnectionStatus function
// getConnectionStatus().then(status => {
//   console.log(`Current connection status: ${status}`);
// });