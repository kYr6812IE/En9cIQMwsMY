// 代码生成时间: 2025-08-08 02:33:03
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// 创建一个新的集合用于存储数据
const DataPoints = new Mongo.Collection('dataPoints');

// 数据分析方法
const analyzeData = (data) => {
  // 验证数据格式
  check(data, [Number]);
  
  // 计算平均值
  const sum = data.reduce((acc, val) => acc + val, 0);
  const average = sum / data.length;
  
  // 计算最大值和最小值
  const min = Math.min(...data);
  const max = Math.max(...data);
  
  // 计算标准差
  const variance = data.reduce((acc, val) => acc + (val - average) ** 2, 0) / data.length;
  const standardDeviation = Math.sqrt(variance);
  
  // 返回分析结果
  return {
    average,
    min,
    max,
    standardDeviation
  };
};

// 插入数据点方法
const insertDataPoint = (dataPoint) => {
  // 验证数据点格式
  check(dataPoint, Number);
  
  // 插入数据点到集合
  DataPoints.insert({ dataPoint, createdAt: new Date() });
};

// 发布数据点集合
Meteor.publish('dataPoints', function () {
  return DataPoints.find();
});

// 订阅数据点集合
Meteor.subscribe('dataPoints');

// 提供一个API端点来分析数据
Meteor.methods({
  'analyzeData': function (data) {
    // 验证用户调用此方法
    if (!this.isSimulation) {
      throw new Meteor.Error('not-authorized');
    }
    
    // 执行数据分析
    const result = analyzeData(data);
    
    // 将结果存储到集合中
    DataPoints.insert({ analysisResult: result, createdAt: new Date() });
    
    // 返回分析结果
    return result;
  },
  'insertDataPoint': function (dataPoint) {
    // 验证用户调用此方法
    if (!this.isSimulation) {
      throw new Meteor.Error('not-authorized');
    }
    
    // 插入数据点
    insertDataPoint(dataPoint);
  }
});

// 客户端调用示例
Meteor.startup(() => {
  // 插入一些数据点
  Meteor.call('insertDataPoint', 10);
  Meteor.call('insertDataPoint', 20);
  Meteor.call('insertDataPoint', 30);

  // 分析数据
  const data = DataPoints.find().map(doc => doc.dataPoint);
  Meteor.call('analyzeData', data);
});