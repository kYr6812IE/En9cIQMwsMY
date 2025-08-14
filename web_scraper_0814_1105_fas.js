// 代码生成时间: 2025-08-14 11:05:07
// web_scraper.js
// 这是一个使用Meteor框架的网页内容抓取工具

// 引入Meteor框架和所需的包
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

// 定义抓取网页内容的功能
function scrapeWebsiteContent(url) {
  // 检查URL是否有效
  check(url, String);

  // 尝试抓取网页内容
  try {
    // 发起HTTP GET请求
    const response = HTTP.get(url);

    // 检查响应状态码
    if (response.statusCode === 200) {
      // 返回网页内容
      return response.content;
    } else {
      // 抛出错误，响应状态码不是200
      throw new Error(`Failed to fetch content from ${url}, status code: ${response.statusCode}`);
    }
  } catch (error) {
    // 处理错误
    console.error(`Error scraping website content: ${error.message}`);
    throw error;
  }
}

// 定义一个简单的路由，用于触发网页抓取
Meteor.startup(() => {
  // 定义一个简单的路由，用于触发网页抓取
  Meteor.publish('scrapeContent', function (url) {
    check(url, String);

    // 抓取网页内容
    const content = scrapeWebsiteContent(url);

    // 发布抓取的内容
    this.added('scrapeContent', url, { content });
    this.ready();
  });
});

// 定义客户端调用的函数
Meteor.methods({
  'scrapeWebsiteContent': function (url) {
    check(url, String);

    // 调用抓取网页内容的函数
    return scrapeWebsiteContent(url);
  },
});
