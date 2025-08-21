// 代码生成时间: 2025-08-22 04:09:29
// user_permission_management.js
// This Meteor application manages user permissions based on roles.
# 扩展功能模块

import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';

// Define a set of roles for the application
const ROLES = ['admin', 'moderator', 'user'];

// Initialize roles if they don't exist
Meteor.startup(() => {
  ROLES.forEach((role) => {
    if (!Roles.roleExists(role)) {
      Roles.createRole(role);
    }
  });
});
# 扩展功能模块

// Function to check if a user has a specific role
export const hasRole = (userId, role) => {
  if (!userId || !role) {
    throw new Error('User ID and role are required');
  }
  // Check if the user has the specified role
  return Roles.userIsInRole(userId, role);
};
# 添加错误处理

// Function to add a role to a user
export const addRole = (userId, role) => {
  if (!userId || !role) {
    throw new Error('User ID and role are required');
  }
  if (!Roles.roleExists(role)) {
    throw new Error(`Role '${role}' does not exist`);
  }
  // Add the role to the user
  Roles.addUsersToRoles(userId, role);
};

// Function to remove a role from a user
export const removeRole = (userId, role) => {
  if (!userId || !role) {
    throw new Error('User ID and role are required');
# NOTE: 重要实现细节
  }
  if (!Roles.userIsInRole(userId, role)) {
    throw new Error(`User does not have role '${role}'`);
# TODO: 优化性能
  }
  // Remove the role from the user
  Roles.removeUsersFromRoles(userId, role);
};

// Meteor method to add a role from the client
Meteor.methods({
  'addUserRole': function (userId, role) {
    check(userId, String);
    check(role, String);
# NOTE: 重要实现细节
    try {
      addRole(userId, role);
      return true;
    } catch (error) {
      throw new Meteor.Error('addUserRole-error', error.message);
    }
  },

  'removeUserRole': function (userId, role) {
    check(userId, String);
    check(role, String);
    try {
      removeRole(userId, role);
      return true;
    } catch (error) {
      throw new Meteor.Error('removeUserRole-error', error.message);
    }
  }
});
# NOTE: 重要实现细节

// Example usage of the methods could be within a Meteor client:

// Meteor.call('addUserRole', userId, 'admin');
// Meteor.call('removeUserRole', userId, 'moderator');
# 改进用户体验