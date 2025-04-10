const express = require('express');
const { addAddress, getAddresses, deleteAddress, updateAddress } = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, addAddress)
  .get(protect, getAddresses);

router.route('/:id')
  .delete(protect, deleteAddress)
  .put(protect, updateAddress);

module.exports = router;
