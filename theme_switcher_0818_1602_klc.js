// 代码生成时间: 2025-08-18 16:02:12
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import './main.html';

// 定义主题切换的变量
const currentTheme = new ReactiveVar('light');

// 切换主题函数
const switchTheme = (theme) => {
  try {
    // 检查是否传入了主题参数
    if (!theme) {
      throw new Error('Theme is required.');
    }

    // 应用新主题
    currentTheme.set(theme);

    // 将主题设置到body元素上
    document.body.className = theme;
  } catch (error) {
    // 错误处理
    console.error('Error switching theme:', error.message);
  }
};

// 创建主题切换模板
Template.themeSwitcher.helpers({
  // 获取当前主题
  currentTheme() {
    return currentTheme.get();
  },
});

// 创建主题切换模板事件
Template.themeSwitcher.events({
  // 点击事件切换主题
  'click #switchThemeButton'(event) {
    event.preventDefault();
    switchTheme('dark');
  },
  'click #switchThemeButtonLight'(event) {
    event.preventDefault();
    switchTheme('light');
  },
});

// 导出切换主题函数
export { switchTheme };
