const asyncHandler = require('express-async-handler');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
  cart.items = cart.items.filter(item => item.product !== null);
  if (cart) {
    res.json(cart);
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Private
const addItemToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const user = req.user._id;

  const cart = await Cart.findOne({ user });

  if (cart) {
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);

    if (itemIndex > -1) {
      // Item exists in cart, update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Item does not exist in cart, add new item
      cart.items.push({ product: productId, quantity:quantity });
    }

    await cart.save();
  } else {
    // No cart for user, create new cart
    const newCart = await Cart.create({
      user,
      items: [{ product: productId, quantity:quantity }],
    });

    await newCart.save();
  }

  res.status(201).json({ message: 'Item added to cart' });
});

// @desc    Remove item from cart
// @route   DELETE /api/cart/:id
// @access  Private
const removeItemFromCart = asyncHandler(async (req, res) => {
  const user = req.user._id;
  const productId = req.params.id;

  const cart = await Cart.findOne({ user });

  if (cart) {
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);

    await cart.save();
    res.json({ message: 'Item removed from cart' });
  } else {
    res.status(404).json({ message: 'Cart not found' });
  }
});

// @desc    decrease item quantity from cart
// @route   put /api/cart/:id
// @access  Private

const decreaseItemQuantity = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    res.status(404);
    throw new Error('Cart not found');
  }
  const itemIndex = cart.items.findIndex(item => item.product.toString() === id);
  //console.log(cart.items, "--------", itemIndex)

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity -= quantity;

    if (cart.items[itemIndex].quantity <= 0) {
      cart.items.splice(itemIndex, 1); // Remove item if quantity goes to 0 or below
    }

    await cart.save();
    res.json(cart);
  } else {
    res.status(404);
    throw new Error('Item not found in cart');
  }
});

module.exports = {
  getCart,
  addItemToCart,
  removeItemFromCart,
  decreaseItemQuantity
};