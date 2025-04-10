const asyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const sendEmail = require('../utils/sendEmail');
const orderConfirmationTemplate = require('../templates/orderConfirmationTemplate')

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
    return;
  } else {
    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // send email to the provided email id with order details
    await sendEmail({
      to: shippingAddress?.email,
      subject: 'Order Confirmation!',
      text: `Hi ${req.user.name}, your order with ID ${createdOrder._id} has been successfully placed.`,
      html: orderConfirmationTemplate(req.user.name, createdOrder._id, orderItems),
    });

    // set cart to blank if order successfull
    await Cart.updateOne({user: req.user._id}, {$set: {items: []}})

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

module.exports = {
  addOrderItems,
  getOrderById,
};
