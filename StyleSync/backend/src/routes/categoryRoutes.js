const express = require('express');
const router = express.Router();
const ProductCategory = require('../models/Category');

// GET all categories
router.get('/fetchCategories', async (req, res) => {
  try {
    const categories = await ProductCategory.find({});
    const categoryDetails = categories.map(category => ({
      categoryName: category.categoryName,
      image: category.image,
    }));
    res.json(categoryDetails);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
