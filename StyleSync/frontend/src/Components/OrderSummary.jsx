import React, { useState, useEffect } from 'react';
import axios from 'axios';
import config from '../Config/Constant';
import './OrderSummary.css';
import Header from './Header';
import Footer from './Footer';

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.BASE_URL}orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error.response?.data?.message || 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const displayPriceInRupees = (price) => {
    if (typeof price !== 'undefined') {
      return `₹${price.toFixed(2)}`;
    }
    return '';
  };

  return (
    <div className="order-summary-page">
      <Header />
      <div className="order-summary-container">
        <h2 className="order-summary-header">Order Summary</h2>
        <form onSubmit={(e) => e.preventDefault()} className="order-id-form">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Enter Order ID"
            required
          />
        </form>
        {isLoading && <div className="loading">Loading order details...</div>}
        {order && (
          <div className="order-details">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress?.address}, {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
            <p><strong>Email:</strong> {order.shippingAddress?.email}</p>
            <h4>Order Items:</h4>
            <div className="order-items">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item">
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt={item.name}
                    className="order-item-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/placeholder.png';
                    }}
                  />
                  <div className="order-item-details">
                    <p className="item-name">{item.name}</p>
                    <p>Quantity: {item.qty}</p>
                    <p>Item Price: {displayPriceInRupees(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="order-summary">
              <p><strong>Shipping Price:</strong> {displayPriceInRupees(order.shippingPrice)}</p>
              <p><strong>Tax Price:</strong> {displayPriceInRupees(order.taxPrice)}</p>
              <p><strong>Total Price:</strong> {displayPriceInRupees(order.totalPrice)}</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default OrderSummary;