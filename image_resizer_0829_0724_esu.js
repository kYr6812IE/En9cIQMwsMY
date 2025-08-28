// 代码生成时间: 2025-08-29 07:24:53
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { FSCollection } from 'meteor/ostrio:files';

// Create a new FS.Collection for images
const Images = new FSCollection('imageFiles', {
  stores: [
    new FS.Store.GridFS('images'),
  ],
  filter: {
    allow: {
      contentTypes: ['image/jpeg', 'image/png'],
    },
  },
});

// Function to resize images
const resizeImage = async (fileId, maxWidth, maxHeight) => {
  const file = Images.findOne(fileId);
  if (!file) {
    throw new Meteor.Error('file-not-found', 'File not found');
  }

  // Check if the file is an image
  if (!file.contentType.startsWith('image/')) {
    throw new Meteor.Error('invalid-file-type', 'Invalid file type');
  }

  // Get the original image data
  const imageData = await Images.find({ _id: fileId }).raw();

  // Use a third-party library to resize the image
  // For example, using Jimp library (install it via NPM: npm install jimp)
  const Jimp = require('jimp');
  
  try {
    const image = await Jimp.read(imageData);
    const resize = Jimp.AUTO;
    image.resize(maxWidth || resize, maxHeight || resize).write(imageData); // Resize the image
    // Update the file in the database with the resized image
    Images.update({ _id: fileId }, { $set: { buffer: await image.getBufferAsync(Jimp.MIME_JPEG) } });
    console.log('Image resized successfully');
  } catch (error) {
    throw new Meteor.Error('resize-error', 'Error resizing image', error);
  }
};

// API endpoint to trigger image resizing
Meteor.methods({
  'resizeImage': function(fileId, maxWidth, maxHeight) {
    check(fileId, String);
    check(maxWidth, Match.Optional(Number));
    check(maxHeight, Match.Optional(Number));
    
    try {
      resizeImage(fileId, maxWidth, maxHeight);
    } catch (error) {
      throw new Meteor.Error(error.error, error.reason);
    }
  },
});

// Export the FS.Collection for use in other parts of the app
export { Images };

/*
 * Notes:
 * - This code assumes that the Jimp library is installed and configured for image processing.
 * - The resizeImage function can be extended to support more image manipulation features.
 * - Error handling ensures that the function does not proceed if the file is not found or is not an image.
 * - The method 'resizeImage' is a Meteor method, which allows it to be called from both server and client side.
 * - The Images FS.Collection is exported for further usage in other parts of the application.
 */