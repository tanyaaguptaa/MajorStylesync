import React from 'react';
import './PrivacyPolicy.css';
import Header from './Header';
import Footer from './Footer';

const PrivacyPolicy = () => {
  return (
    <div>
    <Header/>
    <div className="privacy-policy-container">
      <h1 className="policy-title">Privacy Policy</h1>
      <div className="policy-content">
        <section className="policy-section">
          <h2>Information We Collect</h2>
          <p>We collect personal information that you provide to us, such as your name, email address, shipping address, and payment information when you make a purchase on TrendTreasure.</p>
        </section>
        
        <section className="policy-section">
          <h2>How We Use Your Information</h2>
          <ul>
            <li>To process and fulfill your orders</li>
            <li>To communicate with you about your purchases</li>
            <li>To improve our website and customer service</li>
            <li>To send you marketing communications (with your consent)</li>
          </ul>
        </section>
        
        <section className="policy-section">
          <h2>Data Security</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information when you place an order or enter, submit, or access your personal information.</p>
        </section>
        
        <section className="policy-section">
          <h2>Your Rights</h2>
          <p>You have the right to access, correct, or delete your personal information. Please contact us if you wish to exercise these rights.</p>
        </section>
        
        <section className="policy-section">
          <h2>Changes to This Policy</h2>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
        </section>
      </div>
      <div className="policy-footer">
        <p>Last updated: July 2024</p>
        <p>If you have any questions about this Privacy Policy, please contact us.</p>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default PrivacyPolicy;