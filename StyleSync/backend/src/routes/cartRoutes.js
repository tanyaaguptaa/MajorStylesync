const express = require('express');
const { getCart, addItemToCart, removeItemFromCart, decreaseItemQuantity } = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getCart)
  .post(protect, addItemToCart);

router.route('/:id')
  .delete(protect, removeItemFromCart);

router.route('/decreaseItemQuantity/:id')
  .put(protect, decreaseItemQuantity);

module.exports = router;
