import React from 'react';
import './OurStory.css';
import Header from './Header';
import Footer from './Footer';

const OurStory = () => {
  return (
    <div>
      <Header />
      <div className="our-story-container">
        <h1 className="our-story-title">Our Story</h1>
        
        <div className="story-content">
          <img src="/images/logo.png" alt="Our journey" className="story-image" />
          <div className="story-text">
            <h2>A Journey of Passion and Innovation</h2>
            <p>
              Founded in 2010, Trend Treasure began as a small startup with a big dream: to revolutionize 
              the way people shop for fashion online. Our founders, Jane Doe and John Smith, combined their 
              passion for technology and fashion to create a unique platform that brings the latest trends 
              to your fingertips.
            </p>
            <p>
              Over the years, we've grown from a team of two to a family of hundreds, all united by our 
              commitment to quality, innovation, and customer satisfaction. Our journey has been filled 
              with challenges and triumphs, each shaping us into the company we are today.
            </p>
          </div>
        </div>

        <div className="timeline">
          <h2>Our Journey</h2>
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>2010</h3>
              <p>Trend Treasure is founded in a small garage office.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>2015</h3>
              <p>We hit our first million customers and expand to 10 countries.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>2020</h3>
              <p>Launch of our mobile app and AI-powered style recommendations.</p>
            </div>
          </div>
          <div className="timeline-item">
            <div className="timeline-content">
              <h3>2024</h3>
              <p>Celebrating our journey with 50 million happy customers worldwide.</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OurStory;