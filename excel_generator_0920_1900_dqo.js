// 代码生成时间: 2025-09-20 19:00:23
// Import necessary packages
import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import XLSX from 'xlsx'; // ExcelJS library for working with Excel files
import fs from 'fs';
import path from 'path';

// Reactive variable to store the generated Excel file
const excelFile = new ReactiveVar(null);

// Function to generate Excel file from data
function generateExcel(data) {
  try {
    // Create a new Excel workbook
    const workbook = XLSX.utils.book_new();

    // Add a new worksheet to the workbook
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Generate the Excel file
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Save the buffer to a file
    const excelFileName = 'generated_excel.xlsx';
    const excelFilePath = path.join('private', excelFileName);
    fs.writeFileSync(excelFilePath, excelBuffer);

    // Set the reactive variable to the generated file path
    excelFile.set(excelFilePath);
  } catch (error) {
    console.error('Error generating Excel file:', error);
  }
}

// Meteor method to call the generateExcel function
Meteor.methods({
  'generateExcel': function(data) {
    // Check if the user is logged in
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to generate an Excel file.');
    }

    // Call the generateExcel function with the provided data
    generateExcel(data);
  }
});

// Template for the Excel generator
Template.excelGenerator.onCreated(function() {
  // Initialize the template with the reactive variable
  this.excelFile = excelFile;
});

Template.excelGenerator.helpers({
  // Helper to get the generated Excel file path
  excelFile() {
    return this.excelFile.get();
  }
});

Template.excelGenerator.events({
  // Event handler for the 'Generate Excel' button click
  'click #generateExcelButton'(event, instance) {
    event.preventDefault();

    // Get the data from the form
    const data = {
      header: [
        // Add your column headers here
        'Column 1',
        'Column 2',
        'Column 3'
      ],
      rows: [
        // Add your data rows here
        [
          'Row 1, Column 1',
          'Row 1, Column 2',
          'Row 1, Column 3'
        ],
        [
          'Row 2, Column 1',
          'Row 2, Column 2',
          'Row 2, Column 3'
        ]
      ]
    };

    // Call the Meteor method to generate the Excel file
    Meteor.call('generateExcel', data, (error, result) => {
      if (error) {
        console.error('Error generating Excel file:', error);
      } else {
        console.log('Excel file generated successfully.');
      }
    });
  }
});