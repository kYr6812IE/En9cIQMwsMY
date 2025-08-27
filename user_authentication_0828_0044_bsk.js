// 代码生成时间: 2025-08-28 00:44:55
 * maintainability and scalability.
 */

// Import necessary packages and modules
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { ServiceConfiguration } from 'meteor/service-configuration';

// User Service
class UserService {
  // Function to register a new user
  static registerUser(username, email, password) {
    try {
      // Check if the user already exists
      if (Meteor.users.findOne({ username })) {
        throw new Meteor.Error('User already exists.');
      }

      // Insert new user into the database
      const userId = Accounts.createUser({
        username,
        email,
        password
      });

      // Return the user ID
      return userId;
    } catch (error) {
      // Handle any errors that occur during registration
      console.error('Registration error:', error.message);
      throw error;
    }
  }

  // Function to login a user
  static loginUser(email, password) {
    try {
      // Attempt to login the user
      const loginResult = Meteor.loginWithPassword(email, password);

      // Check if login was successful
      if (!loginResult.user) {
        throw new Meteor.Error('Login failed. User not found or incorrect password.');
      }

      // Return the user object
      return loginResult.user;
    } catch (error) {
      // Handle any errors that occur during login
      console.error('Login error:', error.message);
      throw error;
    }
  }

  // Function to logout a user
  static logoutUser() {
    try {
      // Attempt to logout the user
      Meteor.logout();
    } catch (error) {
      // Handle any errors that occur during logout
      console.error('Logout error:', error.message);
      throw error;
    }
  }
}

// Export the UserService class
export { UserService };
