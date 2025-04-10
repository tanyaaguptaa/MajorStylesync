// src/Components/Home.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import Categories from './Categories';
import './Home.css';

const Home = () => {
  return (
    <>
      <Header />
      <div className="main-container">
        <div className="banner-container">
          <Banner />
        </div>
        <div className="content-container">
          <section className="categories-section">
            <div className="categories-container">
              <Categories />
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;
