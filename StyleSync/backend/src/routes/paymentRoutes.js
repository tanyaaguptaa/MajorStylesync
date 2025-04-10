const express = require('express');
const { createPaymentIntent } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createPaymentIntent);

module.exports = router;
