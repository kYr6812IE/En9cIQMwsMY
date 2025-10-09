// 代码生成时间: 2025-10-10 01:42:35
const { Meteor } = require('meteor/meteor');
const { Random } = require('meteor/random');

// Helper functions
const sigmoid = (x) => {
  return 1 / (1 + Math.exp(-x));
};

const sigmoidDerivative = (x) => {
  return x * (1 - x);
};

const predict = (inputs, weights, bias) => {
  let sum = bias;
  for (let i = 0; i < inputs.length; i++) {
    sum += inputs[i] * weights[i];
  }
  return sigmoid(sum);
};

const train = (trainingInputs, trainingOutputs, weights, bias, learningRate) => {
  let newWeights = weights.slice();
  let newBias = bias;
  let error = 0;

  for (let i = 0; i < trainingInputs.length; i++) {
    let output = predict(trainingInputs[i], weights, bias);
    error += Math.pow(trainingOutputs[i] - output, 2);

    for (let j = 0; j < trainingInputs[i].length; j++) {
      newWeights[j] += learningRate * (2 * (trainingOutputs[i] - output) * sigmoidDerivative(output) * trainingInputs[i][j]);
    }
    newBias += learningRate * (2 * (trainingOutputs[i] - output) * sigmoidDerivative(output));
  }

  return { error, newWeights, newBias };
};

// Meteor method to train the neural network
Meteor.methods({
  'trainNeuralNetwork': function(trainingInputs, trainingOutputs, learningRate) {
    try {
      // Initialize weights and bias with random values
      const inputCount = trainingInputs[0].length;
      const weights = Array.from({ length: inputCount }, () => Random.fraction());
      const bias = Random.fraction();

      let { error, newWeights, newBias } = train(trainingInputs, trainingOutputs, weights, bias, learningRate);

      // Train the network until the error is minimized
      while (error > 0.005) {
        ({ error, newWeights, newBias } = train(trainingInputs, trainingOutputs, newWeights, newBias, learningRate));
      }

      // Return the trained weights and bias
      return {
        weights: newWeights,
        bias: newBias,
        error,
      };
    } catch (error) {
      // Handle any errors that occur during training
      throw new Meteor.Error('training-error', 'An error occurred during training: ' + error.message);
    }
  }
});
