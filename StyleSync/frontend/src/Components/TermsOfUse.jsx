import React from 'react';
import './TermsOfUse.css';
import Header from './Header';
import Footer from './Footer';

const TermsOfUse = () => {
  return (
    <div>
      <Header />
      <div className="terms-of-use-container">
        <h1 className="terms-title">Terms of Use</h1>
        <div className="terms-content">
          <section className="terms-section">
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using TrendTreasure, you accept and agree to be bound by the terms and provision of this agreement.</p>
          </section>

          <section className="terms-section">
            <h2>Use of the Website</h2>
            <p>You agree to use our website for lawful purposes only and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the website.</p>
          </section>

          <section className="terms-section">
            <h2>Intellectual Property</h2>
            <p>The content, organization, graphics, design, compilation, magnetic translation, digital conversion and other matters related to the Site are protected under applicable copyrights, trademarks and other proprietary rights.</p>
          </section>

          <section className="terms-section">
            <h2>Product Information</h2>
            <p>We strive to provide accurate product information, but we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.</p>
          </section>

          <section className="terms-section">
            <h2>Limitation of Liability</h2>
            <p>TrendTreasure shall not be liable for any special or consequential damages that result from the use of, or the inability to use, the services and products offered on this site.</p>
          </section>
        </div>
        <div className="terms-footer">
          <p>Last updated: July 2024</p>
          <p>If you have any questions about these Terms of Use, please contact us.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfUse;