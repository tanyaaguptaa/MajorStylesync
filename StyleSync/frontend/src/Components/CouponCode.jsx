import React, { useState } from 'react';
import './CouponCode.css';

const CouponCode = ({ onApplyCoupon, totalAmount }) => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');
  const [isApplied, setIsApplied] = useState(false);

  const coupons = {
    'NEW24': { discount: 0.20, description: '20% off for new users', minAmount: 0 },
    'SAVE15': { discount: 0.15, description: '15% off for orders above ₹1000', minAmount: 1000 },
    'MEGA25': { discount: 0.25, description: '25% off for orders above ₹10000', minAmount: 10000 }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedCode = couponCode.trim().toUpperCase();
    
    if (trimmedCode in coupons) {
      const coupon = coupons[trimmedCode];
      
      if (totalAmount >= coupon.minAmount) {
        onApplyCoupon(coupon.discount);
        setMessage(`Coupon applied successfully! ${coupon.description}`);
        setIsApplied(true);
      } else {
        setMessage(`This coupon is not applicable to your order. Minimum order amount: ₹${coupon.minAmount}`);
        setIsApplied(false);
      }
    } else {
      setMessage('Invalid coupon code. Please try again.');
      setIsApplied(false);
    }
    
    setCouponCode('');
  };

  return (
    <div className="coupon-container">
      <h3 className="coupon-title">Have a Coupon?</h3>
      <form onSubmit={handleSubmit} className="coupon-form">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          placeholder="Enter your coupon code"
          className="coupon-input"
        />
        <button type="submit" className="coupon-button">Apply Coupon</button>
      </form>
      {message && <p className={`coupon-message ${isApplied ? 'success' : 'error'}`}>{message}</p>}
      <div className="coupon-info">
        <p>Available coupons:</p>
        <ul>
          {Object.entries(coupons).map(([code, coupon]) => (
            <li key={code}>
              <span className="coupon-code">{code}</span>: {coupon.description} 
              {coupon.minAmount > 0 && ` (Min. order: ₹${coupon.minAmount})`}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CouponCode;