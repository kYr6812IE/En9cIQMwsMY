// 代码生成时间: 2025-08-11 11:47:31
// 引入Meteor框架的核心模块
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { check } from 'meteor/check';
import { TAPi18n } from 'meteor/tap:i18n';

/*
 * 整理文件夹结构
 * @param {Object} options - 配置项
 * @param {string} options.dir - 需要整理的目录
 * @param {string} options.targetDir - 目标目录
 * @param {string} options.pattern - 文件夹整理规则
 */
function organizeFolders(options) {
  check(options, {
    dir: String,
    targetDir: String,
    pattern: String
  });

  try {
    // 获取目录中所有文件和文件夹
    const files = FS.Collection.files.find({ parent: options.dir }).fetch();
    const dirs = FS.Collection.files.find({ parent: options.dir, type: 'directory' }).fetch();

    // 按规则整理文件夹结构
    dirs.forEach(dir => {
      const newDirPath = options.targetDir + '/' + options.pattern.replace('{name}', dir.name);
      FS.Collection.files.update({ _id: dir._id }, { $set: { parent: newDirPath } });
    });

    // 整理文件
    files.forEach(file => {
      const newFilePath = options.targetDir + '/' + file.name;
      FS.Collection.files.update({ _id: file._id }, { $set: { parent: newFilePath } });
    });

    console.log(TAPi18n.__('Folder structure organized successfully'));
  } catch (error) {
    console.error(TAPi18n.__('Error organizing folder structure'), error);
  }
}

/*
 * Meteor方法，调用整理文件夹结构函数
 * @param {Object} options - 配置项
 */
Meteor.methods({
  'organizeFolders': function (options) {
    check(options, {
      dir: String,
      targetDir: String,
      pattern: String
    });

    organizeFolders(options);
  }
});
