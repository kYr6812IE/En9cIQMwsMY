// 代码生成时间: 2025-07-31 10:47:38
// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

// Define the Collection to store configuration settings
const ConfigCollection = new Mongo.Collection('config');

/**
 * @description Checks if the configuration document exists and returns it.
 * @param {String} key The key for the configuration setting.
 * @returns {Object} The configuration document or null if not found.
 */
function getConfig(key) {
  try {
    return ConfigCollection.findOne({ key });
  } catch (error) {
    console.error('Error fetching configuration:', error);
    throw error;
  }
}

/**
 * @description Updates or adds a configuration document.
 * @param {String} key The key for the configuration setting.
 * @param {Object} configObj The configuration object to update or add.
 * @returns {Boolean} True if the operation was successful, false otherwise.
 */
function updateConfig(key, configObj) {
  try {
    const existingConfig = getConfig(key);
    if (existingConfig) {
      // Update existing configuration
      return ConfigCollection.update({ key }, { $set: configObj });
    } else {
      // Insert new configuration
      return ConfigCollection.insert({ key, ...configObj });
    }
  } catch (error) {
    console.error('Error updating configuration:', error);
    throw error;
  }
}

/**
 * @description Removes a configuration document by key.
 * @param {String} key The key for the configuration setting to remove.
 * @returns {Boolean} True if the operation was successful, false otherwise.
 */
function removeConfig(key) {
  try {
    return ConfigCollection.remove({ key });
  } catch (error) {
    console.error('Error removing configuration:', error);
    throw error;
  }
}

// Expose the ConfigManager functions to be used in other parts of the application
export const ConfigManager = {
  getConfig,
  updateConfig,
  removeConfig,
};