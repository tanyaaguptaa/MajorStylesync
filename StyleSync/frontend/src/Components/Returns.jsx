import React, { useState } from 'react';
import './Returns.css';
import Header from './Header';
import Footer from './Footer';

const Returns = () => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { title: 'Initiate Return', description: 'Start your return process here' },
    { title: 'Package Item', description: 'Carefully pack your item' },
    { title: 'Print Label', description: 'Print your prepaid return label' },
    { title: 'Ship', description: 'Drop off your package at any carrier location' },
    { title: 'Refund', description: 'Receive your refund within 5-7 business days' }
  ];

  return (
    <div>
    <Header/>
    <div className="returns-container">
      <h1 className="returns-title">Easy Returns</h1>
      <p className="returns-subtitle">We want you to love your purchase, but if you don't, returns are always free</p>
      
      <div className="returns-process">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`return-step ${index === activeStep ? 'active' : ''}`}
            onMouseEnter={() => setActiveStep(index)}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <button className="start-return-btn">Start Your Return</button>
    </div>
    <Footer/>
    </div>
  );
};

export default Returns;