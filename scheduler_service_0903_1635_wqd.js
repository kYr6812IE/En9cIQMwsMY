// 代码生成时间: 2025-09-03 16:35:25
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { DDP } from 'meteor/ddp-client';
import { EJSON } from 'meteor/ejson';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

// Define a schema for the scheduled tasks
const ScheduledTaskSchema = new SimpleSchema({
  taskName: {
    type: String,
    label: 'Name of the task'
  },
# TODO: 优化性能
  schedule: {
    type: String,
    label: 'Cron-style schedule for the task'
  },
  lastRun: {
# 添加错误处理
    type: Date,
    optional: true,
    label: 'Last time the task was run'
# 增强安全性
  },
  nextRun: {
    type: Date,
    optional: true,
    label: 'Next time the task is scheduled to run'
# NOTE: 重要实现细节
  },
  enabled: {
    type: Boolean,
    defaultValue: true,
    label: 'Whether the task is enabled'
  }
});

// Method to add a new scheduled task
export const addScheduledTask = new ValidatedMethod({
# TODO: 优化性能
  name: 'scheduler.addTask',
  check: [Match.Any],
  validate: new SimpleSchema(ScheduledTaskSchema).validator(),
  run(task) {
# 增强安全性
    try {
      // Validate the input task
      const { error, value } = ScheduledTaskSchema.validate(task);
      if (error) throw new Meteor.Error('invalid-task', 'Invalid task data');

      // Add the task to the database
      const taskId = Tasks.insert(value);
      Meteor.call('scheduler.scheduleTask', taskId);
# NOTE: 重要实现细节
      return taskId;
# NOTE: 重要实现细节
    } catch (error) {
      throw new Meteor.Error('add-task-failed', error.message);
    }
# 添加错误处理
  }
});

// Method to remove a scheduled task
export const removeScheduledTask = new ValidatedMethod({
  name: 'scheduler.removeTask',
# 改进用户体验
  check: [String],
  run(taskId) {
# 优化算法效率
    try {
# FIXME: 处理边界情况
      Tasks.remove(taskId);
    } catch (error) {
      throw new Meteor.Error('remove-task-failed', error.message);
# NOTE: 重要实现细节
    }
  }
# FIXME: 处理边界情况
});

// Method to enable or disable a scheduled task
export const toggleScheduledTask = new ValidatedMethod({
  name: 'scheduler.toggleTask',
  check: [String, Boolean],
  run(taskId, enabled) {
    try {
      Tasks.update(taskId, { $set: { enabled } });
    } catch (error) {
# NOTE: 重要实现细节
      throw new Meteor.Error('toggle-task-failed', error.message);
    }
  }
});

// Method to manually run a scheduled task
export const runScheduledTask = new ValidatedMethod({
  name: 'scheduler.runTask',
  check: [String],
  run(taskId) {
# 扩展功能模块
    try {
      // Find the task in the database
      const task = Tasks.findOne(taskId);
      if (!task) throw new Meteor.Error('task-not-found', 'Task not found');

      // Run the task function (this should be implemented as a separate method)
      Meteor.call(task.taskName);

      // Update the last run time
# FIXME: 处理边界情况
      Tasks.update(taskId, { $set: { lastRun: new Date() } });
    } catch (error) {
# 添加错误处理
      throw new Meteor.Error('run-task-failed', error.message);
    }
# 添加错误处理
  }
});

// Start the task scheduler
# TODO: 优化性能
Meteor.startup(() => {
  // Find all enabled tasks and schedule them
  Tasks.find({ enabled: true }).forEach((task) => {
# FIXME: 处理边界情况
    Meteor.call('scheduler.scheduleTask', task._id);
  });
});

// Method to schedule a task using Meteor's纤维
export const scheduleTask = new ValidatedMethod({
  name: 'scheduler.scheduleTask',
  run(taskId) {
    const task = Tasks.findOne(taskId);
    if (!task) throw new Meteor.Error('task-not-found', 'Task not found');

    // Use Meteor's fibers to schedule the task
# 改进用户体验
    const schedule = require('node-cron');
    const job = schedule.schedule(task.schedule, () => {
      Meteor.call('scheduler.runTask', taskId);
    }, { scheduled: true });

    // Store the job reference in the task document for later use (e.g., for cancellation)
    Tasks.update(taskId, { $set: { job } });
  }
});
