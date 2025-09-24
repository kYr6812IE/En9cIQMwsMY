// 代码生成时间: 2025-09-24 19:56:52
// scheduler_meteor.js
// 这是一个使用Meteor框架实现的定时任务调度器

import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { TAPi18n } from 'meteor/tap:i18n';
import { HTTP } from 'meteor/http';
import { Future } from 'meteor/promise';

// 定义定时任务集合的Schema
const ScheduledTasks = new Mongo.Collection('scheduledTasks');
const TaskSchema = new SimpleSchema({
    taskName: {
        type: String,
        label: TAPi18n.__('scheduledTasks.taskName')
    },
    taskFunction: {
        type: String,
        label: TAPi18n.__('scheduledTasks.taskFunction')
    },
    schedule: {
        type: String,
        label: TAPi18n.__('scheduledTasks.schedule')
    }
});

// 初始化集合
ScheduledTasks.attachSchema(TaskSchema);

// 定义定时任务调度器
class TaskScheduler {
    constructor() {
        this.timers = [];
    }

    // 添加定时任务
    addTask(taskName, taskFunction, schedule) {
        try {
            // 将任务添加到集合
            const taskId = ScheduledTasks.insert({
                taskName,
                taskFunction,
                schedule
            });

            // 设置定时器
            const timer = Meteor.setInterval(() => {
                Meteor.call(taskFunction, (err, result) => {
                    if (err) {
                        console.error(`Error executing task ${taskName}: ${err.message}`);
                    } else {
                        console.log(`Task ${taskName} executed successfully.`);
                    }
                });
            }, this.parseSchedule(schedule));

            // 保存定时器引用
            this.timers.push(timer);

            console.log(`Task ${taskName} added successfully.`);
        } catch (error) {
            console.error(`Failed to add task ${taskName}: ${error.message}`);
        }
    }

    // 解析任务调度时间
    parseSchedule(schedule) {
        // 简单的解析，可以根据实际情况扩展
        const match = schedule.match(/(\d+) (second|minute|hour|day)/);
        if (!match) {
            throw new Error(`Invalid schedule format: ${schedule}`);
        }

        const quantity = parseInt(match[1], 10);
        const unit = match[2];

        switch (unit) {
            case 'second':
                return quantity * 1000;
            case 'minute':
                return quantity * 60 * 1000;
            case 'hour':
                return quantity * 60 * 60 * 1000;
            case 'day':
                return quantity * 24 * 60 * 60 * 1000;
            default:
                throw new Error(`Unsupported time unit: ${unit}`);
        }
    }

    // 停止所有定时任务
    stopAll() {
        this.timers.forEach((timer) => Meteor.clearInterval(timer));
        this.timers = [];
        console.log('All tasks stopped.');
    }
}

// 创建调度器实例
const scheduler = new TaskScheduler();

// 添加示例任务
scheduler.addTask(
    'exampleTask',
    'exampleFunction',
    '5 minute'
);

// 添加Meteor方法
Meteor.methods({
    'exampleFunction': function () {
        // 示例任务逻辑
        console.log('Example function executed.');
        return 'Success';
    }
});

// 错误处理和日志记录
Meteor.startup(() => {
    try {
        // 启动后执行的代码
        console.log('Scheduler started.');
    } catch (error) {
        console.error(`Error starting scheduler: ${error.message}`);
    }
});