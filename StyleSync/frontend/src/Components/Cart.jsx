// Cart.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';
import Footer from './Footer';
import Header from './Header';
import CouponCode from './CouponCode';
const config = require('../Config/Constant');

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: '/cart' } });
        return;
      }

      const response = await axios.get(`${config.BASE_URL}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
      setLoading(false);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/login', { state: { from: '/cart' } });
      } else {
        setError('Failed to fetch cart. Please try again.');
        setLoading(false);
      }
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.BASE_URL}cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchCart();
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
  };

  const decrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${config.BASE_URL}cart/decreaseItemQuantity/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError('Failed to decrement item quantity. Please try again.');
    }
  };

  const incrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.BASE_URL}cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchCart();
    } catch (err) {
      setError('Failed to increment item quantity. Please try again.');
    }
  };

  const handleApplyCoupon = (discount) => {
    setCouponDiscount(discount);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const subtotal = cart ? cart.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : 0;
  const total = subtotal - (subtotal * couponDiscount);

  return (
    <div>
      <Header />
      <div className="cart-container">
        <h2 className="cart-header">Your Cart</h2>
        {!cart || cart.items.length === 0 ? (
          <div className="empty-cart">
            <p>Your cart is empty</p>
            <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
          </div>
        ) : (
          <>
            {cart.items.map((item) => (
              <div key={item.product._id} className="cart-item">
                <button className="close-button" onClick={() => removeItem(item.product._id)}>
                  &times;
                </button>
                <img
                  src={`data:image/jpeg;base64,${item.product.image}`}
                  alt={item.product.name}
                  className="cart-item-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/images/placeholder.png';
                  }}
                />
                <div className="cart-item-details">
                  <h3 className="cart-item-name">{item.product.name}</h3>
                  <p className="cart-item-price">Price: ₹{item.product.price}</p>
                  <div className="quantity-controls">
                    <button className="cart-item-button decrement" onClick={() => decrementItem(item.product._id, 1)}>
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button className="cart-item-button increment" onClick={() => incrementItem(item.product._id, 1)}>
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <CouponCode onApplyCoupon={handleApplyCoupon} totalAmount={subtotal} />
            <div className="cart-total">
              <h3>MRP: ₹{subtotal.toFixed(2)}</h3>
              {couponDiscount > 0 && <h3>Coupon Discount: -₹{(subtotal * couponDiscount).toFixed(2)}</h3>}
              <h3 id= "total-amount">Total Amount: ₹{total.toFixed(2)}</h3>
            </div>
            <Link to="/Address" className="proceed-button">
              Proceed to Checkout
            </Link>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
