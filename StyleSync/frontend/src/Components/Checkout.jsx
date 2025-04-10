import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useAlert } from '../Contexts/AlertContext';
import './Checkout.css';

const config = require('../Config/Constant');

const Checkout = () => {
  const [totalPrice, setTotalPrice] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cardDetails, setCardDetails] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: ''
  });
  const [orderSummary, setOrderSummary] = useState({
    itemsPrice: 0,
    shippingPrice: 0,
    taxPrice: 0,
    totalPrice: 0,
  });
  const [upiId, setUpiId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [address, setAddress] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isFetchingPrice, setIsFetchingPrice] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  const handleApplyCoupon = (code) => {
    console.log(`Applying coupon: ${code}`);
  };

  useEffect(() => {
    if (location.state && location.state.address) {
      setAddress(location.state.address);
    } else {
      navigate('/address');
    }
    fetchTotalPrice();
  }, [location, navigate]);

  const fetchTotalPrice = async () => {
    setIsFetchingPrice(true);
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
      
      const itemsPrice = response.data.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
      const shippingPrice = itemsPrice > 500 ? 0 : 50; // Free shipping for orders over 500
      const taxPrice = itemsPrice * 0.18; // 18% tax
      const totalPrice = itemsPrice + shippingPrice + taxPrice;
  
      setOrderSummary({
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      });
      
      setTotalPrice(totalPrice);
    } catch (err) {
      console.log("Error while getting prices:", err);
      showAlert("Error fetching cart details. Please try again.", 'error');
    } finally {
      setIsFetchingPrice(false);
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    //showAlert('');
  };

  const handleCardInputChange = (e) => {
    setCardDetails({
      ...cardDetails,
      [e.target.name]: e.target.value
    });
  };

  const validateInputs = () => {
    if (paymentMethod === 'card') {
      if (cardDetails.number.length !== 16 || !/^\d+$/.test(cardDetails.number)) {
        showAlert('Invalid card number', 'error');
        return false;
      }
      if (cardDetails.name.trim() === '') {
        showAlert('Please enter the name on the card', 'error');
        return false;
      }
      if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
        showAlert('Invalid expiry date (Use MM/YY format)', 'error');
        return false;
      }
      if (cardDetails.cvv.length !== 3 || !/^\d+$/.test(cardDetails.cvv)) {
        showAlert('Invalid CVV', 'error');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!/^[\w.-]+@[\w.-]+$/.test(upiId)) {
        showAlert('Invalid UPI ID', 'error');
        return false;
      }
    }
    return true;
  };

  const handleCheckout = async () => {
    if (!validateInputs()) return;

    if (paymentMethod === 'cod') {
      setIsConfirming(true);
      return;
    }
  
    setIsLoading(true);
    //showAlert('');
  
    try {
      const token = localStorage.getItem('token');
      
      const cartResponse = await axios.get(`${config.BASE_URL}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsConfirming(true);
    } catch (error) {
      showAlert(`Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsLoading(true);
    //showAlert('');
  
    try {
      const token = localStorage.getItem('token');
      
      const cartResponse = await axios.get(`${config.BASE_URL}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const orderItems = cartResponse.data.items.map(item => ({
        name: item.product.name,
        qty: item.quantity,
        image: item.product.image,
        price: item.product.price,
        product: item.product._id,
      }));
  
      const order = {
        orderItems,
        shippingAddress: {
          address: address.address,
          city: address.city,
          postalCode: address.pincode,
          country: 'India',
          email: address.email,
        },
        paymentMethod,
        itemsPrice: orderSummary.itemsPrice,
        shippingPrice: orderSummary.shippingPrice,
        taxPrice: orderSummary.taxPrice,
        totalPrice: orderSummary.totalPrice,
      };

      let response;
      if(paymentMethod === 'cod' ){
        response = await axios.post(`${config.BASE_URL}orders`, order, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      } else{
        const paymentResponse = await axios.post(`${config.BASE_URL}payment`, {"amount": orderSummary?.totalPrice }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        paymentResponse?.status === 200 ? response = await axios.post(`${config.BASE_URL}orders`, order, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }) : console.log("payment failed", response.data.message)
      }
      
      if (response.status === 201) {
        showAlert('Order placed successfully!', 'success');
        navigate(`/order/${response.data._id}`);
      } else {
        showAlert(`Error: ${response.data.message}`, 'error');
      }
    } catch (error) {
      showAlert(`Error: ${error.response?.data?.message || error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetchingPrice) {
    return <div>Loading order details...</div>;
  }

  if (!address) {
    return <div>Loading address information...</div>;
  }

  return (
    <div className="checkout-page">
      <Header />
      <div className="checkout-container">
        <h2>Checkout</h2>
        <div className="checkout-address">
          <h3>Shipping Address</h3>
          <p>{address.name}</p>
          <p>{address.address}</p>
          <p>{address.pincode}</p>
          <p>{address.phoneNo}</p>
          <p>{address.email}</p>
        </div>
        <div className="checkout-summary">
          <h3>Order Summary</h3>
          <p>Items: ₹{orderSummary.itemsPrice.toFixed(2)}</p>
          <p>Shipping: ₹{orderSummary.shippingPrice.toFixed(2)}</p>
          <p>Tax: ₹{orderSummary.taxPrice.toFixed(2)}</p>
          <p className="checkout-total">Total: ₹{orderSummary.totalPrice.toFixed(2)}</p>
        </div>
        <div className="checkout-payment">
          <h3>Payment Method</h3>
          <div className="payment-options">
            <label>
              <input type="radio" name="paymentMethod" value="card" onChange={() => handlePaymentMethodChange('card')} />
              Credit/Debit Card
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="upi" onChange={() => handlePaymentMethodChange('upi')} />
              UPI
            </label>
            <label>
              <input type="radio" name="paymentMethod" value="cod" onChange={() => handlePaymentMethodChange('cod')} />
              Cash on Delivery
            </label>
          </div>
        </div>
        {paymentMethod === 'card' && (
          <div className="checkout-card-details">
            <input type="text" name="number" placeholder="Card Number" onChange={handleCardInputChange} maxLength="16" />
            <input type="text" name="name" placeholder="Name on Card" onChange={handleCardInputChange} />
            <input type="text" name="expiry" placeholder="MM/YY" onChange={handleCardInputChange} maxLength="5" />
            <input type="text" name="cvv" placeholder="CVV" onChange={handleCardInputChange} maxLength="3" />
          </div>
        )}
        {paymentMethod === 'upi' && (
          <div className="checkout-upi-details">
            <input type="text" placeholder="UPI ID" onChange={(e) => setUpiId(e.target.value)} />
          </div>
        )}
        {isConfirming ? (
          <div className="order-confirmation">
            <h3>Confirm Your Order</h3>
            <p>Please review your order details before placing the order.</p>
            <button onClick={handlePlaceOrder} disabled={isLoading} className="place-order-button" aria-label="Confirm and Place Order">
              {isLoading ? 'Processing...' : 'Confirm and Place Order'}
            </button>
            <button onClick={() => setIsConfirming(false)}>Edit Order</button>
          </div>
        ) : (
          <button className="checkout-button" onClick={handleCheckout} disabled={isLoading || !paymentMethod} aria-label={`${paymentMethod === 'cod' ? 'Continue to Place Order' : `Pay ₹${orderSummary.totalPrice.toFixed(2)}`}`}>
            {isLoading ? 'Processing...' : paymentMethod === 'cod' ? 'Continue to Place Order' : `Pay ₹${orderSummary.totalPrice.toFixed(2)}`}
          </button>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;