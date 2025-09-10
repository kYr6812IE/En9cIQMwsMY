// 代码生成时间: 2025-09-11 00:56:19
// decompress_tool.js
// 一个使用JavaScript和Meteor框架实现的压缩文件解压工具

import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs'; // 引入Meteor文件系统
import { HTTP } from 'meteor/http'; // 引入HTTP模块用于文件传输
import { Meteor } from 'meteor/meteor'; // 引入Meteor核心模块
import { check } from 'meteor/check'; // 引入check模块用于数据校验
import { Npm } from 'meteor/npm'; // 引入NPM模块，用于调用系统命令
import archiver from 'archiver'; // 引入archiver模块用于文件压缩

// 定义一个函数用于解压文件
const decompressFile = (filePath, destPath) => {
  // 检查文件路径和目标路径是否合法
  if (!filePath || !destPath) {
    throw new Error('文件路径和目标路径不能为空');
  }
  
  try {
    // 使用NPM模块的exec方法执行解压缩命令
    Npm.require('child_process').execSync(`tar -xzvf ${filePath} -C ${destPath}`, {
      stdio: 'inherit',
    });
  } catch (error) {
    // 错误处理
    throw new Error(`解压文件失败: ${error.message}`);
  }
};

// 定义一个函数用于压缩文件
const compressFile = (sourcePath, destPath) => {
  // 检查源路径和目标路径是否合法
  if (!sourcePath || !destPath) {
    throw new Error('源路径和目标路径不能为空');
  }
  
  try {
    // 使用archiver模块创建压缩文件
    const archive = archiver('tar', { gzip: true });
    const stream = fs.createWriteStream(destPath);
    archive.pipe(stream);
    
    // 添加文件到压缩包
    archive.file(sourcePath, { name: 'archived_file' });
    archive.finalize();
  } catch (error) {
    // 错误处理
    throw new Error(`压缩文件失败: ${error.message}`);
  }
};

// 定义一个Meteor方法用于调用解压文件函数
Meteor.methods({
  'decompressFile': function(filePath, destPath) {
    check(filePath, String);
    check(destPath, String);
    try {
      decompressFile(filePath, destPath);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
  'compressFile': function(sourcePath, destPath) {
    check(sourcePath, String);
    check(destPath, String);
    try {
      compressFile(sourcePath, destPath);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },
});
