// 代码生成时间: 2025-08-03 08:57:00
 * const cart = new ShoppingCart();
 * cart.addItem('apple', 2);
 * cart.removeItem('apple');
 * console.log(cart.items); // Access the cart's items
 */
class ShoppingCart {
  // Initialize the shopping cart with an empty items array
  constructor() {
    this.items = [];
  }

  /**
   * Adds an item to the shopping cart.
   *
   * @param {string} item - The name of the item to be added.
   * @param {number} quantity - The quantity of the item to be added.
   * @returns {void}
   */
  addItem(item, quantity) {
    // Check if the item already exists in the cart
    const existingItem = this.items.find((cartItem) => cartItem.name === item);

    // If the item exists, update the quantity
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      // Otherwise, add the new item to the cart
      this.items.push({ name: item, quantity: quantity });
    }
  }

  /**
   * Removes an item from the shopping cart.
   *
   * @param {string} item - The name of the item to be removed.
   * @param {number} [quantity=1] - The quantity of the item to be removed.
   * @returns {void}
   */
  removeItem(item, quantity = 1) {
    // Find the index of the item in the cart
    const index = this.items.findIndex((cartItem) => cartItem.name === item);

    // If the item exists in the cart
    if (index > -1) {
      // Decrement the quantity of the item
      this.items[index].quantity -= quantity;

      // If the quantity reaches 0, remove the item from the cart
      if (this.items[index].quantity <= 0) {
        this.items.splice(index, 1);
      }
    } else {
      // If the item does not exist, throw an error
      throw new Error(`Item '${item}' not found in the cart`);
    }
  }

  /**
   * Clears the shopping cart.
   *
   * @returns {void}
   */
  clear() {
    this.items = [];
  }

  /**
   * Displays the shopping cart's content.
   *
   * @returns {void}
   */
  displayCart() {
    console.log(this.items);
  }
}

// Export the ShoppingCart class for use in other parts of the application
export { ShoppingCart };
