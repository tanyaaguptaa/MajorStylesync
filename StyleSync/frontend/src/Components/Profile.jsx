import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../Contexts/AlertContext';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState({ name: '', email: '' });
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userDataString = localStorage.getItem('user');
      if (userDataString) {
        try {
          const userData = JSON.parse(userDataString);
          setUser({ name: userData.name, email: userData.email });
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleOrdersClick = () => {
    navigate('/order/:id'); // Navigate to the OrderList component
  };

  const handleWishlistClick = () => {
    navigate('/wishlist'); // Navigate to the Wishlist component
  };

  const handleContactUsClick = () => {
    navigate('/contact-us'); // Navigate to the Contact Us component
  };

  const handleCouponsClick = () => {
    navigate('/coupons'); // Navigate to the Coupons component
  };

  const handleAddressClick = () => {
    navigate('/address'); // Navigate to the Address component
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser({ name: '', email: '' });
      showAlert('Logged out successfully', 'success');
      navigate('/login');
    } catch (error) {
      showAlert('Logout failed', 'error');
      console.error('Logout Error:', error);
    }
  };

  return (
    <div className="profile-container">
      <h1>Hello, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <ul>
        <li><button onClick={handleOrdersClick}>Orders</button></li>
        <li><button onClick={handleWishlistClick}>Wishlist</button></li>
        <li><button onClick={handleContactUsClick}>Contact Us</button></li>
        <li><button onClick={handleCouponsClick}>Coupons</button></li>
        <li><button onClick={handleAddressClick}>Address</button></li>
        <li>
          <button onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Profile;
