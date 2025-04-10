const express = require('express');
const { createReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router({ mergeParams: true });

router.route('/').post(protect, createReview);

module.exports = router;
