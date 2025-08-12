// 代码生成时间: 2025-08-13 06:45:54
// image_size_adjuster_meteor.js
// 一个使用METEOR框架的图片尺寸批量调整器程序

// 导入所需的Meteor包
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { GridFS } from 'meteor/ostrio:gridfs';
import { check } from 'meteor/check';
import { TAPi18n } from 'meteor/tap:i18n';

// 初始化GridFS存储，用于操作文件
const imagesStore = new FS.Collection(
  'images',
  {
    stores: [
      GridFS({
        collectionName: 'images',
        chunkSize: 1024 * 1024 * 5, // 5MB
      })
    ],
  }
);

// 检查用户输入的尺寸信息是否有效
function isValidSize(size) {
  const sizeRegex = /^\d+(px|%)$/;
  return sizeRegex.test(size);
}

// 调整图片尺寸的函数
function adjustImageSize(imageUrl, newSize, callback) {
  imagesStore.findOne({
    "metadata.url": imageUrl
  }, function(error, file) {
    if (error) {
      callback(error, null);
    } else if (file) {
      // 检查输入的尺寸是否有效
      if (!isValidSize(newSize)) {
        callback(new Error(TAPi18n.__('InvalidSize')), null);
      } else {
        // 此处省略图片处理逻辑，因为实际的图像处理需要依赖于图像处理库如sharp, gm等
        // 假设我们有一个函数processImage来处理图像
        // processImage(file, newSize, function(error, newFile) {
        //   if (error) {
        //     callback(error, null);
        //   } else {
        //     callback(null, newFile);
        //   }
        // });
      }
    } else {
      callback(new Error(TAPi18n.__('FileNotFound')), null);
    }
  });
}

// 批量调整图片尺寸的函数
function batchAdjustImageSizes(imageUrls, newSize, callback) {
  if (!Array.isArray(imageUrls)) {
    callback(new Error(TAPi18n.__('InvalidInput')), null);
  } else {
    const updatedFiles = [];
    const errors = [];
    imageUrls.forEach((imageUrl) => {
      adjustImageSize(imageUrl, newSize, (error, file) => {
        if (error) {
          errors.push(error);
        } else {
          updatedFiles.push(file);
        }
        // 当所有图片处理完毕后调用回调函数
        if (updatedFiles.length + errors.length === imageUrls.length) {
          callback({ errors, files: updatedFiles });
        }
      });
    });
  }
}

// 暴露一个Meteor方法供客户端调用
Meteor.methods({
  "adjustImageSize": function(imageUrl, newSize) {
    check(imageUrl, String);
    check(newSize, String);
    // 调用调整图片尺寸的函数并返回结果
    const result = adjustImageSize(imageUrl, newSize, (error, file) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return file;
      }
    });
    return result;
  },
  "batchAdjustImageSizes": function(imageUrls, newSize) {
    check(imageUrls, [String]);
    check(newSize, String);
    // 调用批量调整图片尺寸的函数并返回结果
    const result = batchAdjustImageSizes(imageUrls, newSize, (error, response) => {
      if (error) {
        throw new Meteor.Error(500, error.message);
      } else {
        return response;
      }
    });
    return result;
  }
});
