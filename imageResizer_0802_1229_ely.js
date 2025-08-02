// 代码生成时间: 2025-08-02 12:29:05
// Meteor package imports
import { Meteor } from 'meteor/meteor';
import { FilesCollection } from 'meteor/ostrio:files';
import { check, Match } from 'meteor/check';
import { HTTP } from 'meteor/http';

// Define a new FilesCollection for handling file uploads
const Images = new FilesCollection({
  debug: true,
  collectionName: 'images',
  storagePath: 'private',
  allowClientCode: false,
  onAfterUpload: function (file) {
    // Resize the image after upload
    resizeImage(file);
  },
  interceptDownload: function (http, file, request, response) {
    // You can intercept image downloads to perform additional actions
  }
});

// Function to resize an image
function resizeImage(file) {
  // Check if the file is an image
  if (!isImageFile(file)) {
    console.error('The file is not an image:', file.name);
    return;
  }

  try {
    // Access the image file
    const image = HTTP.get(Images.baseUrl + file._id + '?download=true', {
      headers: { 'Accept': 'image/*' },
      responseType: 'blob'
    });

    // Load the image and resize it
    const img = new Image();
    img.onload = function () {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const targetWidth = 800; // Target width for resizing
      const targetHeight = (img.height / img.width) * targetWidth;
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      const resizedImageData = canvas.toDataURL('image/jpeg', 0.8); // 80% quality

      // Save the resized image back to the server
      saveResizedImage(file._id, resizedImageData);
    };
    img.onerror = function () {
      console.error('Failed to load image:', file.name);
    };
    img.src = URL.createObjectURL(new Blob([image.content], { type: 'image/jpeg' }));
  } catch (error) {
    console.error('An error occurred while resizing the image:', error);
  }
}

// Helper function to check if the file is an image
function isImageFile(file) {
  return /image\/jpeg|image\/png|image\/gif/.test(file.type);
}

// Function to save the resized image data back to the server
function saveResizedImage(fileId, resizedImageData) {
  try {
    // Create a new file object with the resized image data
    const resizedFile = new File([resizedImageData.split(',')[1]], file.name, { type: 'image/jpeg' });

    // Update the file with the resized image data
    Images.update({ _id: fileId }, { $set: { content: resizedFile } });
  } catch (error) {
    console.error('An error occurred while saving the resized image:', error);
  }
}

// Meteor method to handle file uploads
Meteor.methods({
  'uploadImage': function (file) {
    check(file, Match.Any); // Validate the input file

    // Use the FilesCollection's `insert` method to upload the file
    const fileData = Images.insert(file, {
      streams: 'dynamic',
      chunkSize: 'dynamic',
      metadata: true,
    });

    // Return the file object to the client
    return fileData;
  },
});
