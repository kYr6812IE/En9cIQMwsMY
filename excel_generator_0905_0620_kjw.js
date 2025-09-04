// 代码生成时间: 2025-09-05 06:20:54
 * Usage:
 * 1. Include this file in your Meteor project.
 * 2. Call the `generateExcelFile` function with your data to create an Excel file.
 * 3. The generated file will be saved in the specified path.
 */

// Import necessary Meteor packages.
import { Meteor } from 'meteor/meteor';
import { FS } from 'meteor/cfs:standard-packages';
import { ExcelJS } from 'meteor/farissi:excel';

// Ensure that the FS collection is properly configured.
FS.debug = true;
FS.HTTP = {
  use: false, // Disable the default HTTP method.
  put: true, // Enable the PUT HTTP method.
};

// Helper function to generate Excel files.
function generateExcelFile(data, fileName) {
  // Check if the data is valid and the file name is provided.
  if (!data || !fileName) {
    throw new Meteor.Error('invalid-data', 'Invalid data or file name.');
  }

  // Create a new Excel workbook.
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('My Sheet');

  // Add data to the worksheet.
  worksheet.addRow(Object.keys(data[0])); // Add headers.
  data.forEach((row) => worksheet.addRow(Object.values(row)));

  // Save the Excel file to a specified path.
  try {
    const filePath = `/path/to/excel/files/${fileName}.xlsx`;
    workbook.xlsx.writeFile(filePath).then(() => {
      console.log(`Excel file generated successfully at ${filePath}`);
    }).catch((error) => {
      console.error('Error generating Excel file:', error);
      throw new Meteor.Error('file-generation-error', 'Failed to generate Excel file.');
    });
  } catch (error) {
    console.error('Error saving Excel file:', error);
    throw new Meteor.Error('file-save-error', 'Failed to save Excel file.');
  }
}

// Example usage of the generateExcelFile function.
// This should be replaced with actual data and file name.
if (Meteor.isServer) {
  Meteor.startup(() => {
    try {
      const exampleData = [
        { name: 'John Doe', age: 30, job: 'Developer' },
        { name: 'Jane Smith', age: 25, job: 'Designer' },
      ];
      generateExcelFile(exampleData, 'example_file');
    } catch (error) {
      console.error('Error in Meteor startup:', error);
    }
  });
}
