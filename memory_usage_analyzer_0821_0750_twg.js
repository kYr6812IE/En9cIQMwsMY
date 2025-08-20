// 代码生成时间: 2025-08-21 07:50:04
// Import necessary Meteor packages
const { Meteor } = require('meteor/meteor');
const { TAPi18n } = require('meteor/tap:i18n');

// Define a namespace for the application
const MemoryAnalyzer = {};

// Function to get the current memory usage
MemoryAnalyzer.getCurrentMemoryUsage = async function() {
    // Check if process.memoryUsage is available
    if (typeof process.memoryUsage !== 'function') {
        throw new Error('Memory usage information is not available.');
    }

    // Get current memory usage
    const memoryUsage = process.memoryUsage();
    return memoryUsage;
};

// Function to analyze memory usage
MemoryAnalyzer.analyzeMemoryUsage = function(memoryUsage) {
    // Validate memory usage input
    if (!memoryUsage || typeof memoryUsage !== 'object') {
        throw new Error('Invalid memory usage input.');
    }

    // Analyze memory usage
    const analysis = {
        rss: memoryUsage.rss, // Resident Set Size
        heapTotal: memoryUsage.heapTotal, // Total heap size
        heapUsed: memoryUsage.heapUsed, // Used heap size
    };

    // Calculate percentage usage
    const heapPercentage = (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100;
    analysis.heapPercentage = heapPercentage;

    return analysis;
};

// Meteor method to expose memory analysis functionality
Meteor.methods({
    'memoryAnalyzer:analyze': async function() {
        // Check if Meteor method is invoked from the client
        if (!this.isSimulation) {
            throw new Meteor.Error('not-authorized', 'This method can only be called from a client.');
        }

        try {
            // Get current memory usage
            const memoryUsage = await MemoryAnalyzer.getCurrentMemoryUsage();

            // Analyze memory usage
            const analysis = MemoryAnalyzer.analyzeMemoryUsage(memoryUsage);

            // Return memory usage analysis
            return analysis;
        } catch (error) {
            // Handle errors
            throw new Meteor.Error('memory-analysis-error', error.message);
        }
    },
});
