// 代码生成时间: 2025-08-10 05:13:13
// Meteor.publish and Meteor.subscribe are used for publications and subscriptions
// The ShoppingCartCollection is a Meteor collection to store cart items

// Import necessary Meteor packages
import { Meteor, Mongo, check } from 'meteor/meteor';
import { MongoCollection } from 'meteor/mongo';
import { Tracker } from 'meteor/tracker';

// Define the ShoppingCart collection
export const ShoppingCartCollection = new MongoCollection('shoppingCart');

// Define a schema for the ShoppingCart collection to ensure data integrity
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { RegEx } from 'meteor/aldeed:simple-schema';

const schema = new SimpleSchema({
  item: {
    type: String,
    label: 'Item Name',
    max: 250
  },
  price: {
    type: Number,
    label: 'Price',
    min: 0.00
  },
  quantity: {
    type: Number,
    label: 'Quantity',
    min: 0
  },
  total: {
    type: Number,
    label: 'Total',
    min: 0.00
  }
});

ShoppingCartCollection.attachSchema(schema);

// Publication for the ShoppingCart collection
Meteor.publish('shoppingCart', function() {
  return ShoppingCartCollection.find();
});

// Method to add an item to the shopping cart
Meteor.methods({
  'cart.addItem': function(cartItem) {
    // Check if the item is valid using the schema
    check(cartItem, schema);
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to add items to the cart.');
    }
    // Find the cart item by item name and user ID
    const existingItem = ShoppingCartCollection.findOne({
      item: cartItem.item,
      userId: Meteor.userId()
    });
    // If the item exists, update the quantity
    if (existingItem) {
      const newQuantity = existingItem.quantity + cartItem.quantity;
      ShoppingCartCollection.update({
        _id: existingItem._id
      }, {
        $set: {
          quantity: newQuantity,
          total: newQuantity * existingItem.price
        }
      });
    } else {
      // If the item does not exist, insert a new item with the user's ID
      ShoppingCartCollection.insert({
        item: cartItem.item,
        price: cartItem.price,
        quantity: cartItem.quantity,
        total: cartItem.quantity * cartItem.price,
        userId: Meteor.userId()
      });
    }
  },

  // Method to remove an item from the shopping cart
  'cart.removeItem': function(cartItemId) {
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to remove items from the cart.');
    }
    // Find and remove the cart item by ID and user ID
    ShoppingCartCollection.remove({
      _id: cartItemId,
      userId: Meteor.userId()
    });
  },

  // Method to update the quantity of an item in the shopping cart
  'cart.updateQuantity': function(cartItemId, newQuantity) {
    // Check if the user is logged in
    if (!Meteor.userId()) {
      throw new Meteor.Error('not-authorized', 'You must be logged in to update item quantities.');
    }
    // Update the quantity and total of the cart item
    ShoppingCartCollection.update({
      _id: cartItemId,
      userId: Meteor.userId()
    }, {
      $set: {
        quantity: newQuantity,
        total: newQuantity * ShoppingCartCollection.findOne(cartItemId).price
      }
    });
  }
});

// Subscribe to the ShoppingCart collection
Meteor.startup(() => {
  Meteor.subscribe('shoppingCart');
});
