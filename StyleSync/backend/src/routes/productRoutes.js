const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');
const {
  getProducts,
  getProductById,
  getProductsByCategory,
  addProduct,
  deleteProduct,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  searchProducts
} = require('../controllers/productController');

const router = express.Router();

router.route('/listProducts').get(getProducts);
router.route('/addProduct').post(protect, admin, addProduct);
router.route('/listProducts/:id').get(getProductById);
router.route('/deleteProduct/:id').delete(protect, admin, deleteProduct);
router.route('/category/:categoryName').get(getProductsByCategory);
router.post('/wishlist/:productId', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.get('/wishlist', protect, getWishlist);
router.get('/search', searchProducts)


module.exports = router;
