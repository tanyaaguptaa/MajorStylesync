const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    required: true,
  },
});

const ProductCategory = mongoose.model('ProductCategory', categorySchema);

module.exports = ProductCategory;
