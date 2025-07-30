// 代码生成时间: 2025-07-30 23:37:12
import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

// Define the Inventory collection
const Inventory = new Mongo.Collection('inventory');

// Define a schema for the inventory items
const InventorySchema = new SimpleSchema({
  name: {
    type: String,
    label: 'Name'
  },
  quantity: {
    type: Number,
    label: 'Quantity',
    decimal: true,
    optional: true
  },
  price: {
    type: Number,
    label: 'Price',
    decimal: true
  },
  category: {
    type: String,
    allowedValues: ['electronics', 'clothing', 'books', 'other'],
    label: 'Category'
  }
});

// Attach the schema to the collection
Inventory.attachSchema(InventorySchema);

// Method to add a new inventory item
Meteor.methods({
  'inventory.addItem': function (item) {
    check(item, InventorySchema);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be logged in to add an item.');
    }
    Inventory.insert(item);
  },

  'inventory.updateItem': function (itemId, item) {
    check(itemId, String);
    check(item, InventorySchema);
    const existingItem = Inventory.findOne(itemId);
    if (existingItem.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be the owner to update the item.');
    }
    Inventory.update(itemId, { $set: item });
  },

  'inventory.removeItem': function (itemId) {
    check(itemId, String);
    const existingItem = Inventory.findOne(itemId);
    if (existingItem.userId !== this.userId) {
      throw new Meteor.Error('not-authorized', 'User must be the owner to remove the item.');
    }
    Inventory.remove(itemId);
  }
});

// Publishing rules
Meteor.publish('inventoryItems', function () {
  return Inventory.find({});
});

// Subscription
Meteor.subscribe('inventoryItems');

// Client-side code to handle adding an item
Template.addItem.helpers({
  'inventorySchema': function () {
    return InventorySchema;
  }
});

Template.addItem.events({
  'submit form': function (event) {
    event.preventDefault();
    const item = {
      name: event.target.name.value,
      quantity: event.target.quantity.value,
      price: event.target.price.value,
      category: event.target.category.value,
      userId: Meteor.userId()
    };
    Meteor.call('inventory.addItem', item, (error, result) => {
      if (error) {
        alert(error.reason);
      } else {
        alert('Item added successfully!');
        // Clear the form and reset the button
        event.target.reset();
      }
    });
  },
});

// Client-side code to handle updating an item
Template.updateItem.helpers({
  'inventorySchema': function () {
    return InventorySchema;
  }
});

Template.updateItem.events({
  'submit form': function (event, template) {
    event.preventDefault();
    const itemId = template.data._id;
    const item = {
      name: event.target.name.value,
      quantity: event.target.quantity.value,
      price: event.target.price.value,
      category: event.target.category.value,
      userId: Meteor.userId()
    };
    Meteor.call('inventory.updateItem', itemId, item, (error, result) => {
      if (error) {
        alert(error.reason);
      } else {
        alert('Item updated successfully!');
      }
    });
  },
});

// Client-side code to handle removing an item
Template.removeItem.helpers({
  'inventorySchema': function () {
    return InventorySchema;
  }
});

Template.removeItem.events({
  'click .remove-item': function (event, template) {
    const itemId = template.data._id;
    if (confirm('Are you sure you want to remove this item?')) {
      Meteor.call('inventory.removeItem', itemId, (error, result) => {
        if (error) {
          alert(error.reason);
        } else {
          alert('Item removed successfully!');
        }
      });
    }
  },
});
