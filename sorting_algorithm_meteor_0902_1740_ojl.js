// 代码生成时间: 2025-09-02 17:40:41
const { Meteor } = require("meteor/meteor");

// 定义排序算法的模块
const SortingAlgorithm = {
  // 冒泡排序算法
  bubbleSort(array) {
    if (!Array.isArray(array)) {
      throw new Error("Input must be an array.");
    }
    
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array.length - i - 1; j++) {
        if (array[j] > array[j + 1]) {
          // 交换元素
          let temp = array[j];
          array[j] = array[j + 1];
          array[j + 1] = temp;
        }
      }
    }
    return array;
  },

  // 快速排序算法
  quickSort(array) {
    if (!Array.isArray(array) || array.length < 2) {
      return array;
    }
    
    const pivot = array[0];
    const left = [];
    const right = [];
    
    for (let i = 1; i < array.length; i++) {
      if (array[i] < pivot) {
        left.push(array[i]);
      } else {
        right.push(array[i]);
      }
    }
    
    return [...this.quickSort(left), pivot, ...this.quickSort(right)];
  },

  // 插入排序算法
  insertionSort(array) {
    if (!Array.isArray(array)) {
      throw new Error("Input must be an array.");
    }
    
    for (let i = 1; i < array.length; i++) {
      let currentvalue = array[i];
      let position = i;
      
      while (position > 0 && array[position - 1] > currentvalue) {
        array[position] = array[position - 1];
        position = position - 1;
      }
      array[position] = currentvalue;
    }
    return array;
  }
};

// 导出模块
module.exports = SortingAlgorithm;
