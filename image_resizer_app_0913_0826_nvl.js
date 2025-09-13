// 代码生成时间: 2025-09-13 08:26:26
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';
import { Npm } from 'meteor/npm-bcrypt';
import sharp from 'sharp';

// 定义集合存储上传的图片
FS.Store.setStore('images');

// 检查图片上传的格式
const imageSchema = new SimpleSchema({
  image: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  targetWidth: {
    type: Number
  },
  targetHeight: {
    type: Number
  }
});

const Images = FS.Images;
Images.attachSchema(imageSchema);

Meteor.publish('images', function () {
  return Images.find();
});

// 定义一个方法来调整图片尺寸
Meteor.methods({
  resizeImages({ targetWidth, targetHeight }) {
    check(targetWidth, Number);
    check(targetHeight, Number);

    // 获取所有图片文件
    const images = Images.find().fetch();

    // 循环处理每张图片
    images.forEach((image) => {
      try {
        // 读取图片文件
        const filePath = `cfs:images/${image._id}`;
        sharp(filePath)
          // 调整图片尺寸
          .resize({ width: targetWidth, height: targetHeight })
          // 保存调整后的图片
          .toFile(filePath);
      } catch (error) {
        // 错误处理
        console.error('Error resizing image:', error);
        throw new Meteor.Error('resize-error', 'Failed to resize image', error.message);
      }
    });
  }
});

// 定义路由和视图
Router.route('/images', {
  name: 'images',
  template: 'images'
});

// 定义上传图片的表单
Template.images.helpers({
  images() {
    return Images.find();
  }
});

Template.images.events({
  'submit form'(event, instance) {
    event.preventDefault();
    const targetWidth = event.target.width.value;
    const targetHeight = event.target.height.value;
    Meteor.call('resizeImages', { targetWidth, targetHeight }, function (error) {
      if (error) {
        alert(error.reason);
      } else {
        alert('Images resized successfully!');
      }
    });
  }
});

// 文档和注释
/**
 * 图片尺寸批量调整器
 *
 * 这个程序允许用户上传图片，并提供一个简单的界面来调整所有图片的尺寸。
 *
 * @author Your Name
 * @since 1.0.0
 */
