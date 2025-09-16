// 代码生成时间: 2025-09-16 09:17:04
 * Features:
 * - Error handling
 * - Clear structure and documentation
 * - Adherence to best practices
 * - Maintainability and extensibility
 */

// Import necessary Meteor packages
import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { FS } from 'meteor/cfs:http-methods';
import { check, Match } from 'meteor/check';
import gm from 'gm'; // GraphicsMagick

// Define the settings for image resizing
const RESIZE_SETTINGS = {
  width: 800, // default width
  height: 600, // default height
  maintainAspectRatio: true // maintain the aspect ratio
};

// Define a function to resize an image
const resizeImage = (imagePath, targetPath) => {
  try {
    gm(imagePath)
      .resize(RESIZE_SETTINGS.width, RESIZE_SETTINGS.height, '^') // '^' crop to fit without distorting
      .gravity('center') // center the image after cropping
      .write(targetPath, (err) => {
        if (err) {
          throw new Error(`Failed to resize image: ${err.message}`);
        }
        console.log(`Image resized and saved to ${targetPath}`);
      });
  } catch (error) {
    console.error(`Error resizing image: ${error.message}`);
  }
};

// Define a function to handle batch resizing
const batchResizeImages = (imageFiles) => {
  try {
    check(imageFiles, [Object]); // ensure the correct type is passed

    imageFiles.forEach((file) => {
      const { name, path } = file;
      const targetPath = `/path/to/output/directory/${name}`;
      console.log(`Resizing image: ${name}`);
      resizeImage(path, targetPath);
    });
  } catch (error) {
    console.error(`Error processing batch resize: ${error.message}`);
  }
};

// Example usage of the batchResizeImages function
Meteor.startup(() => {
  // Simulate an array of image files to be resized
  const imagesToResize = [
    { name: 'image1.jpg', path: '/path/to/image1.jpg' },
    { name: 'image2.jpg', path: '/path/to/image2.jpg' }
  ];

  batchResizeImages(imagesToResize);
});