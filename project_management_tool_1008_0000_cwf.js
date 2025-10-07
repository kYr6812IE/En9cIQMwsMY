// 代码生成时间: 2025-10-08 00:00:43
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define a collection for storing projects
const Projects = new Mongo.Collection('projects');

// Define a schema for the project documents
const projectSchema = new SimpleSchema({
  projectName: {
    type: String,
    label: 'Project Name'
  },
  projectDescription: {
    type: String,
# FIXME: 处理边界情况
    optional: true,
    label: 'Project Description'
# TODO: 优化性能
  },
# 添加错误处理
  status: {
    type: String,
# 优化算法效率
    allowedValues: ['planning', 'in progress', 'completed'],
# 改进用户体验
    label: 'Project Status'
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if (this.isInsert) {
        return new Date();
      }
    },
# 优化算法效率
    label: 'Creation Date'
  }
});

// Attach the schema to the collection
Projects.attachSchema(projectSchema);
# 扩展功能模块

// Define a Meteor method to add a new project
Meteor.methods({
  'projects.insert'(project) {
    check(project, Object);
    // Make sure the user is logged in before inserting a project
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to create a project.');
    }
    return Projects.insert({
      projectName: project.projectName,
      projectDescription: project.projectDescription || '',
# TODO: 优化性能
      status: project.status,
      createdAt: new Date()
    });
  },
  'projects.remove'(projectId) {
    check(projectId, String);
    // Make sure the user is logged in and owns the project before removing it
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to remove a project.');
    }
    const project = Projects.findOne(projectId);
    if (project.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User is not authorized to remove this project.');
    }
    Projects.remove(projectId);
  },
  'projects.update'(project) {
    check(project, Object);
    // Make sure the user is logged in and owns the project before updating it
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to update a project.');
    }
    const projectId = project._id;
    const project = Projects.findOne(projectId);
    if (project.owner !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User is not authorized to update this project.');
    }
    Projects.update(projectId, {
      $set: {
        projectName: project.projectName,
        projectDescription: project.projectDescription,
        status: project.status
      }
    });
  }
});

// Publish the projects list to the client
Meteor.publish('projects.list', function() {
  return Projects.find({
# 优化算法效率
    private: { $ne: true }
  });
});

// Publish a single project to the client
Meteor.publish('project', function(projectId) {
  check(projectId, String);
  return Projects.find({ _id: projectId });
});

// Define a publication for private projects (if needed)
Meteor.publish('project.private', function(projectId) {
  check(projectId, String);
  const project = Projects.findOne(projectId);
  if (project.owner === this.userId) {
    return Projects.find({ _id: projectId });
  } else {
    this.ready();
  }
});

// Define a publication for all projects (if needed)
Meteor.publish('projects.all', function() {
  return Projects.find();
});

// Define a subscription for the projects list
Template.projectsList.helpers({
  projects() {
    return Projects.find({
      private: { $ne: true }
    });
  }
});

// Define a subscription for a single project
# 改进用户体验
Template.project.onCreated(function() {
  const instance = this;
  instance.autorun(() => {
    const projectId = FlowRouter.getParam('projectId');
    instance.subscribe('project', projectId);
  });
});

// Define a form for adding a new project
Template.addProjectForm.helpers({
# 增强安全性
  error() {
    return Session.get('addProjectError');
  }
});

Template.addProjectForm.events({
# 优化算法效率
  'submit form'(event, instance) {
    event.preventDefault();
    const project = {
# TODO: 优化性能
      projectName: event.target.projectName.value,
# TODO: 优化性能
      projectDescription: event.target.projectDescription.value,
      status: event.target.status.value
    };
    Meteor.call('projects.insert', project, (error, result) => {
      if (error) {
        Session.set('addProjectError', error.reason);
      } else {
        Session.set('addProjectError', null);
        FlowRouter.go('/projects');
# 改进用户体验
      }
    });
  }
# 添加错误处理
});

// Define a form for updating a project
Template.editProjectForm.helpers({
  error() {
    return Session.get('editProjectError');
  },
  project() {
    return Projects.findOne(this.projectId);
  }
});

Template.editProjectForm.events({
# 扩展功能模块
  'submit form'(event, instance) {
    event.preventDefault();
    const project = {
      _id: event.target._id.value,
      projectName: event.target.projectName.value,
      projectDescription: event.target.projectDescription.value,
      status: event.target.status.value
    };
    Meteor.call('projects.update', project, (error, result) => {
      if (error) {
        Session.set('editProjectError', error.reason);
      } else {
        Session.set('editProjectError', null);
        FlowRouter.go('/projects');
      }
    });
# NOTE: 重要实现细节
  }
});

// Define a form for removing a project
Template.removeProjectForm.events({
  'submit form'(event, instance) {
# 扩展功能模块
    event.preventDefault();
    const projectId = instance.data._id;
    Meteor.call('projects.remove', projectId, (error, result) => {
      if (error) {
        Session.set('removeProjectError', error.reason);
      } else {
        Session.set('removeProjectError', null);
        FlowRouter.go('/projects');
      }
    });
  }
});