import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Wishlist.css';
import Header from './Header';
import Footer from './Footer';

const config = require('../Config/Constant');

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.BASE_URL}products/wishlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWishlistItems(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch wishlist');
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.BASE_URL}products/wishlist/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchWishlist();
    } catch (err) {
      setError('Failed to remove item from wishlist');
    }
  };

  const addToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${config.BASE_URL}cart/add`, 
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert('Product added to cart successfully!');
    } catch (err) {
      setError('Failed to add item to cart');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div>
      <Header />
      <div className="wishlist-container">
        <h2 className="wishlist-header">Your Wishlist</h2>
        {wishlistItems.length === 0 ? (
          <div className="empty-wishlist">
            <p>Your wishlist is empty</p>
            <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
          </div>
        ) : (
          wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <button className="close-button" onClick={() => removeFromWishlist(item._id)}>
                &times;
              </button>
              <img
                src={`data:image/jpeg;base64,${item.image}`}
                alt={item.name}
                className="wishlist-item-image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/placeholder.png';
                }}
              />
              <div className="wishlist-item-details">
                <h3 className="wishlist-item-name">{item.name}</h3>
                <p className="wishlist-item-price">Price: ₹{item.price}</p>
                <button className="add-to-cart-button" onClick={() => addToCart(item._id)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Wishlist;