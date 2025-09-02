// 代码生成时间: 2025-09-03 02:45:12
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';

// A utility function to check if a URL is valid
function isValidUrl(url) {
  // Regular expression for URL validation
  const urlPattern = new RegExp(
    '^(https?:\/\/)?' + // protocol
    '((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|' + // domain name
    '((\d{1,3}\.){3}\d{1,3})' + // OR ip (v4) address
    '(\:\d+)?(\/[-a-zA-Z\d%_.~+]*)*' + // port and path
    '(\?[;&a-zA-Z\d%_.~+=-]*)?' + // query string
    '(\#[-a-zA-Z\d_]*)?$', // fragment locator
    'i'
  );
# FIXME: 处理边界情况

  return urlPattern.test(url);
}

// Function to check the URL's reachability
function checkUrlReachability(url) {
  try {
    const response = HTTP.get(url);
    if (response.statusCode === 200) {
      return true;
# 改进用户体验
    } else {
# 扩展功能模块
      throw new Error(`Server responded with status code: ${response.statusCode}`);
# 添加错误处理
    }
# 扩展功能模块
  } catch (error) {
    throw new Error(`Error checking URL reachability: ${error.message}`);
  }
}

// Meteor method to validate a URL
Meteor.methods({
  validateUrl: function (url) {
    // Check if the URL provided is not empty
# 优化算法效率
    if (!url) {
      throw new Meteor.Error('url-empty', 'The URL cannot be empty.');
    }

    // Validate URL format
    if (!isValidUrl(url)) {
# 优化算法效率
      throw new Meteor.Error('invalid-url-format', 'The URL format is invalid.');
    }
# FIXME: 处理边界情况

    // Check if the URL is reachable
    try {
      if (!checkUrlReachability(url)) {
        throw new Meteor.Error('url-not-reachable', 'The URL is not reachable.');
      }
    } catch (error) {
      throw new Meteor.Error('url-check-error', error.message);
    }

    // If all checks pass, return a success message
    return {
      message: 'URL is valid and reachable.',
      valid: true
    };
  }
});
