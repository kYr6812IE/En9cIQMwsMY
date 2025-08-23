// 代码生成时间: 2025-08-24 00:29:45
// 引入Meteor相关模块
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

// 登录验证函数
Accounts.validateLoginAttempt((attempt) => {
  // 检查尝试是否成功
  if (attempt.error) {
    // 尝试失败，返回错误信息
    return false;
  } else {
    // 尝试成功，允许登录
    return true;
  }
});

// 用户注册时的验证函数
Accounts.validateNewUser((user) => {
  // 在此处添加用户验证逻辑
  // 例如，检查用户名是否符合要求
  if (user.username && user.username.length > 5) {
    // 用户名符合要求，允许注册
    return true;
  } else {
    // 用户名不符合要求，返回错误信息
    throw new Meteor.Error(403, '用户名必须大于5个字符');
  }
});

// 登录和注册的路由
import { Router } from 'meteor/iron:router';
Router.route('/login', {
  name: 'login',
  action() {
    this.render('Login');
  }
});

Router.route('/register', {
  name: 'register',
  action() {
    this.render('Register');
  }
});

/*
 * 登录页面模板
 */
import { Template } from 'meteor/templating';
Template.Login.onRendered(function () {
  // 登录页面渲染后的钩子函数
  this.$('.login-form').on('submit', (event) => {
    event.preventDefault();
    const username = this.$('input[name="username"]').val();
    const password = this.$('input[name="password"]').val();
    Meteor.loginWithPassword(username, password, (error) => {
      if (error) {
        // 登录失败，显示错误信息
        console.error('登录失败:', error.reason);
      } else {
        // 登录成功，跳转到主页
        this.data.redirect('/');
      }
    });
  });
});

/*
 * 注册页面模板
 */
Template.Register.onRendered(function () {
  // 注册页面渲染后的钩子函数
  this.$('.register-form').on('submit', (event) => {
    event.preventDefault();
    const username = this.$('input[name="username"]').val();
    const password = this.$('input[name="password"]').val();
    Accounts.createUser({
      username: username,
      password: password,
      profile: { name: username }
    }, (error) => {
      if (error) {
        // 注册失败，显示错误信息
        console.error('注册失败:', error.reason);
      } else {
        // 注册成功，跳转到登录页
        this.data.redirect('/login');
      }
    });
  });
});