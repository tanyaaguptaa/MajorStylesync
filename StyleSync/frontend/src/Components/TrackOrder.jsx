import React, { useState } from 'react';
import './TrackOrder.css';
import Header from './Header';
import Footer from './Footer';

const TrackOrder = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [trackingStatus, setTrackingStatus] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate order tracking - replace with actual API call
    setTrackingStatus({
      status: 'In Transit',
      lastUpdate: 'July 15, 2024',
      estimatedDelivery: 'July 18, 2024',
      steps: [
        { name: 'Order Placed', completed: true },
        { name: 'Processing', completed: true },
        { name: 'Shipped', completed: true },
        { name: 'In Transit', completed: false },
        { name: 'Delivered', completed: false }
      ]
    });
  };

  return (
    <div>
    <Header/>
    <div className="track-order-container">
      <h1 className="track-order-title">Track Your Order</h1>
      <form onSubmit={handleSubmit} className="track-order-form">
        <input
          type="text"
          value={orderNumber}
          onChange={(e) => setOrderNumber(e.target.value)}
          placeholder="Enter your order number"
          required
        />
        <button type="submit">Track</button>
      </form>

      {trackingStatus && (
        <div className="tracking-result">
          <h2>Order Status: {trackingStatus.status}</h2>
          <p>Last Updated: {trackingStatus.lastUpdate}</p>
          <p>Estimated Delivery: {trackingStatus.estimatedDelivery}</p>
          
          <div className="tracking-timeline">
            {trackingStatus.steps.map((step, index) => (
              <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''}`}>
                <div className="step-indicator"></div>
                <p>{step.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    <Footer/>
    </div>
  );
};

export default TrackOrder;