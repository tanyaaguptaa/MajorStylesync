// ContactUs.js
import React, { useState } from 'react';
import './ContactUs.css';
import Header from './Header';
import Footer from './Footer';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to an API)
    console.log('Form submitted:', formData);
    // Reset form after submission
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div>
    <Header/>
    <div className="contact-us-container">
      <h1 className="contact-us-title">Contact StyleSync</h1>
      <div className="contact-content">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you. Here's how you can reach us...</p>
          <div className="contact-method">
            <i className="fas fa-envelope"></i>
            <span>guptastuti1920@gmail.com</span>
          </div>
          <div className="contact-method">
            <i className="fas fa-phone"></i>
            <span>+91 9149003706</span>
          </div>
          <div className="contact-method">
            <i className="fas fa-user"></i>
            <span>Stuti Gupta (Owner)</span>
          </div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
          />
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Subject"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default ContactUs;