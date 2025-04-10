import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AlertProvider } from './Contexts/AlertContext';
import ProductList from './Components/ProductList';
import Cart from './Components/Cart';
import Home from './Components/Home';
import Login from './Components/login'; // Ensure you have a Login component
import Admin from './Components/Admin';
import './App.css';
import Checkout from './Components/Checkout';
import Address from './Components/Address';
import OrderSummary from './Components/OrderSummary';
import Profile from './Components/Profile';
import CreateOrder from './Components/CreateOrder';
import ContactUs from './Components/ContactUs';
import FAQs from './Components/FAQs';
import Returns from './Components/Returns';
import TrackOrder from './Components/TrackOrder';
import Wishlist from './Components/Wishlist';
import OurStory from './Components/OurStory';
import PrivacyPolicy from './Components/PrivacyPolicy';
import TermsOfUse from './Components/TermsOfUse';
import CouponCode from './Components/CouponCode';
import SearchResults from './Components/SearchResults';


const App = () => {
  return (
    <Router>
   
      <AlertProvider>
        <Routes>
        <Route path="/" element={<Home />} exact render={() => (
          <div className="app-container">
            <Home />
          </div>
        )} />
          <Route path="/login" element={<Login />} /> {/* Add this line */}
          <Route path="/category/:categoryName" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/admin" element={<Admin />}/>
          <Route path="/checkout" element={<Checkout/>}/>
          <Route path="/address" element={<Address/>}/>
          <Route path="/" element={<Profile/>} />       
          <Route path="/order/:id" element={<OrderSummary />} />
          <Route path="/create-order" element={<CreateOrder />}/>
          <Route path='/wishlist' element={<Wishlist/>}/>
          <Route path='/contact-us' element={<ContactUs/>}/>
          <Route path='/faqs' element={<FAQs/>}/>
          <Route path='/returns' element={<Returns/>}/>
          <Route path='/track-order' element={<TrackOrder/>}/>
          <Route path='/our-story' element={<OurStory/>}/>
          <Route path='/privacy-policy' element={<PrivacyPolicy/>}/>
          <Route path='/terms' element={<TermsOfUse/>}/>
          <Route path='/coupons' element={<CouponCode/>}/>
          <Route path="/search-results" element={<SearchResults />} />
        </Routes>
        </AlertProvider>
    </Router>
  );
};

export default App;