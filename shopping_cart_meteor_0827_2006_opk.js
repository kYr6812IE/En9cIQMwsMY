// 代码生成时间: 2025-08-27 20:06:24
// Import necessary Meteor packages and create a collection for the cart items.
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Create a collection for storing cart items.
const CartItems = new Mongo.Collection('cartItems');

/**
 * Adds an item to the cart.
 *
 * @param {String} userId - The ID of the user who owns the cart.
 * @param {Object} item - The item to be added to the cart.
 *   The item must have an 'id' property and 'quantity' property.
 */
Meteor.methods({
  "addToCart": function(userId, item) {
    check(userId, String);
    check(item, {
      id: String,
      quantity: Number
    });

    // Check if the item already exists in the cart.
    const existingItem = CartItems.findOne({ userId, itemId: item.id });
    if (existingItem) {
      // If the item exists, update its quantity.
      CartItems.update({ _id: existingItem._id }, { $inc: { quantity: item.quantity } });
    } else {
      // If the item does not exist, insert it into the cart.
      CartItems.insert({
        userId,
        itemId: item.id,
        quantity: item.quantity,
        // Additional item properties can be added here.
      });
    }
  }
});

/**
 * Removes an item from the cart.
 *
 * @param {String} userId - The ID of the user who owns the cart.
 * @param {String} itemId - The ID of the item to be removed.
 */
Meteor.methods({
  "removeFromCart": function(userId, itemId) {
    check(userId, String);
    check(itemId, String);

    // Remove the item from the cart.
    CartItems.remove({ userId, itemId });
  }
});

/**
 * Clears the cart for a user.
 *
 * @param {String} userId - The ID of the user whose cart will be cleared.
 */
Meteor.methods({
  "clearCart": function(userId) {
    check(userId, String);

    // Clear all items from the cart.
    CartItems.remove({ userId });
  }
});

// Publish the cart items for a user.
Meteor.publish('cartItems', function(userId) {
  check(userId, String);
  return CartItems.find({ userId });
});

// Subscribe to the cart items publication.
Meteor.subscribe('cartItems');

// Client-side code for managing the cart.
export const ShoppingCart = {
  addToCart(userId, item) {
    Meteor.call('addToCart', userId, item);
  },
  removeFromCart(userId, itemId) {
    Meteor.call('removeFromCart', userId, itemId);
  },
  clearCart(userId) {
    Meteor.call('clearCart', userId);
  },
  // Additional cart management methods can be added here.
};

// Example usage of ShoppingCart.
// ShoppingCart.addToCart('userId123', { id: 'productId456', quantity: 2 });
// ShoppingCart.removeFromCart('userId123', 'productId456');
// ShoppingCart.clearCart('userId123');
