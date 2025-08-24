// 代码生成时间: 2025-08-25 06:49:51
import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';

// ShoppingCart is a collection to store cart items
const ShoppingCart = new Mongo.Collection('shoppingCart');

// Define a schema for better structure and validation
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

export const ShoppingCartSchema = new SimpleSchema({
    itemId: {
        type: String,
    },
    itemCount: {
        type: Number,
    },
    userId: {
        type: String,
    },
    createdAt: {
        type: Date,
        autoValue: function() {
            if (this.isInsert) {
                return new Date();
            }
        },
    },
    updatedAt: {
        type: Date,
        autoValue: function() {
            if (this.isUpdate) {
                return new Date();
            }
        },
    },
});

ShoppingCart.attachSchema(ShoppingCartSchema);

// A method to add an item to the cart
const addToCart = new ValidatedMethod({
    name: 'addToCart',
    validate: new SimpleSchema({
        itemId: { type: String },
        itemCount: { type: Number },
        userId: { type: String },
    }).validator(),
    run({ itemId, itemCount, userId }) {
        // Check if the user is logged in
        if (!this.isSimulation && !Meteor.userId()) {
            throw new Meteor.Error('not-authorized', 'User must be logged in to add to cart');
        }
        // Check if the item exists
        const existingItem = ShoppingCart.findOne({ itemId, userId });
        if (existingItem) {
            // If the item already exists, increment the count
            ShoppingCart.update({ _id: existingItem._id }, { $inc: { itemCount: itemCount } });
        } else {
            // If the item does not exist, add it to the cart
            ShoppingCart.insert({ itemId, itemCount, userId });
        }
    },
});

// A method to remove an item from the cart
const removeFromCart = new ValidatedMethod({
    name: 'removeFromCart',
    validate: new SimpleSchema({
        cartItemId: { type: String },
    }).validator(),
    run({ cartItemId }) {
        // Check if the user is logged in
        if (!this.isSimulation && !Meteor.userId()) {
            throw new Meteor.Error('not-authorized', 'User must be logged in to remove from cart');
        }
        // Remove the item from the cart
        ShoppingCart.remove({ _id: cartItemId });
    },
});

// Export methods for use on the client
export const ShoppingCartMethods = {
    addToCart,
    removeFromCart,
};

// Client-side code to call methods and handle events
Meteor.startup(() => {
    // ...
    // Client-side code to subscribe to ShoppingCart collection and handle UI updates
    // ...
});

// Server-side publication to restrict access to cart items based on user
Meteor.publish('cartItems', function() {
    if (this.userId) {
        return ShoppingCart.find({ userId: this.userId });
    } else {
        return this.ready();
    }
});