const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const asyncHandler = require('express-async-handler');

// @desc    Create a new payment intent
// @route   POST /api/payment
// @access  Private
const createPaymentIntent = asyncHandler(async (req, res) => {
  let { amount } = req.body;
  amount = Math.round(amount)
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = { createPaymentIntent };
