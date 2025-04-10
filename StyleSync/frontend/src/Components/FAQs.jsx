// FAQs.js
import React, { useState } from 'react';
import './FAQs.css';
import Header from './Header';
import Footer from './Footer';

const FAQs = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What products does TrendTreasure offer?",
      answer: "TrendTreasure offers a wide range of fashion items including clothes, jewelry, footwear, and beauty products."
    },
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn and unused items. Please refer to our Returns page for more details."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary depending on your location. Typically, domestic orders arrive within 3-5 business days, while international orders may take 7-14 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes, we ship to most countries worldwide. Shipping costs and delivery times may vary based on the destination."
    },
    {
      question: "How can I track my order?",
      answer: "Once your order is shipped, you'll receive a tracking number via email. You can use this number on our Track Order page to check the status of your delivery."
    },
    {
      question: "Are your beauty products cruelty-free?",
      answer: "Yes, all our beauty products are cruelty-free. We are committed to ethical practices in all our product lines."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
   <div>
   <Header/>
    <div className="faqs-container">
      <h1 className="faqs-title">Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faq-question">
              <h3>{faq.question}</h3>
              <span className="faq-toggle">{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div className="faq-answer">
              <p>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    <Footer/>
    </div>
  );
};

export default FAQs;