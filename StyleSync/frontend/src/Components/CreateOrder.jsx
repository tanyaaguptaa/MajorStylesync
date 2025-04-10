import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../Config/Constant';

const CreateOrder = ({ cart, shippingAddress, paymentMethod }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const calculatePrices = () => {
    const itemsPrice = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example shipping calculation
    const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
    const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);

    return { itemsPrice, shippingPrice, taxPrice, totalPrice };
  };

  const placeOrder = async () => {
    try {
      setLoading(true);
      const { itemsPrice, shippingPrice, taxPrice, totalPrice } = calculatePrices();

      const token = localStorage.getItem('userToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `${config.BASE_URL}orders`,
        {
          orderItems: cart.map(item => ({
            name: item.name,
            qty: item.qty,
            image: item.image,
            price: item.price,
            product: item._id,
          })),
          shippingAddress,
          paymentMethod,
          itemsPrice,
          taxPrice,
          shippingPrice,
          totalPrice,
        },
        config
      );

      setLoading(false);
      navigate(`/order/${data._id}`);
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred while placing the order.');
    }
  };

  if (loading) return <div className="create-order loading">Processing your order...</div>;
  if (error) return <div className="create-order error">{error}</div>;

  return (
    <div className="create-order">
      <h1>Order Summary</h1>
      <div className="order-details">
        <h2>Shipping</h2>
        <p>{shippingAddress.address}, {shippingAddress.postalCode}, {shippingAddress.country}</p>
        <p>Email: {shippingAddress.email}</p>
      </div>
      <div className="payment-method">
        <h2>Payment Method</h2>
        <p>{paymentMethod}</p>
      </div>
      <div className="order-items">
        <h2>Order Items</h2>
        {cart.map((item) => (
          <div key={item._id} className="order-item">
            <img src={item.image} alt={item.name} />
            <div className="item-details">
              <h3>{item.name}</h3>
              <p>{item.qty} x ${item.price} = ${item.qty * item.price}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="order-summary-totals">
        <div className="summary-row">
          <span>Items:</span>
          <span>${calculatePrices().itemsPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping:</span>
          <span>${calculatePrices().shippingPrice.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>${calculatePrices().taxPrice}</span>
        </div>
        <div className="summary-row total">
          <span>Total:</span>
          <span>${calculatePrices().totalPrice}</span>
        </div>
      </div>
      <button onClick={placeOrder} className="place-order-btn">Place Order</button>
    </div>
  );
};

export default CreateOrder;