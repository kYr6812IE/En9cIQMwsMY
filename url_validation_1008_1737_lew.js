// 代码生成时间: 2025-10-08 17:37:01
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';

/**
 * Validates a given URL to check if it is accessible and valid.
 * @param {string} url - The URL to validate.
# 优化算法效率
 * @returns {boolean} - True if the URL is valid, false otherwise.
 */
function validateUrl(url) {
  // Check if the URL is a string and is not empty
  check(url, String);
# 添加错误处理
  if (!url) return false;

  try {
    // Make a HEAD request to check if the URL is accessible
    const response = HTTP.call('HEAD', url, { timeout: 5000 });
    // Check if the response status code is 2xx (success)
    return response.statusCode >= 200 && response.statusCode < 300;
  } catch (error) {
# TODO: 优化性能
    console.error('Error validating URL:', error);
    return false;
  }
}

// Example usage:
// const isValid = validateUrl('https://www.example.com');
// console.log('Is URL valid?', isValid);

export { validateUrl };