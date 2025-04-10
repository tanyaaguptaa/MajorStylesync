import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import './Address.css';
const config = require('../Config/Constant');

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: '',
    address: '',
    pincode: '',
    phoneNo: '',
    email: ''
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.BASE_URL}address`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAddresses(response.data);
      if (response.data.length > 0) {
        setSelectedAddress(response.data[0]);
      }
    } catch (err) {
      setError('Failed to fetch addresses. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setNewAddress({
      ...newAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (editingAddressId) {
        await axios.put(`${config.BASE_URL}address/${editingAddressId}`, newAddress, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEditingAddressId(null);
      } else {
        const response = await axios.post(`${config.BASE_URL}address`, newAddress, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setAddresses([...addresses, response.data]);
      }
      setNewAddress({
        name: '',
        address: '',
        pincode: '',
        phoneNo: '',
        email: '',
      });
      fetchAddresses();
    } catch (err) {
      console.error('Error adding/editing address:', err.response ? err.response.data : err.message);
      setError('Failed to add/edit address. Please check your input and try again.');
    }
  };

  const handleEdit = (address) => {
    setNewAddress(address);
    setEditingAddressId(address._id);
  };

  const handleDelete = async (addressId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.BASE_URL}address/${addressId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAddresses();
    } catch (err) {
      console.error('Error deleting address:', err.response ? err.response.data : err.message);
      setError('Failed to delete address. Please try again.');
    }
  };

  const handleShipToThisAddress = () => {
    if (selectedAddress) {
      navigate('/Checkout', { state: { address: selectedAddress } });
    } else {
      setError('Please select an address.');
    }
  };

  return (
    <div className="address-page">
      <Header />
      <div className="address-container">
        <h2>Your Addresses</h2>
        {addresses.map((address) => (
          <div key={address._id} className={`address-item ${selectedAddress === address ? 'selected' : ''}`}>
            <input
              type="radio"
              name="selectedAddress"
              value={address._id}
              checked={selectedAddress === address}
              onChange={() => handleAddressSelect(address)}
            />
            <div className="address-details">
              <p>{address.name}</p>
              <p>{address.address}</p>
              <p>{address.pincode}</p>
              <p>{address.phoneNo}</p>
              <p>{address.email}</p>
            </div>
            <div className="address-actions">
              <button onClick={() => handleEdit(address)} className="edit-btn">Edit</button>
              <button onClick={() => handleDelete(address._id)} className="delete-btn">×</button>
            </div>
          </div>
        ))}

        <h2>{editingAddressId ? 'Edit Address' : 'Add a New Address'}</h2>
        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={newAddress.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input
              type="text"
              name="address"
              value={newAddress.address}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Pincode</label>
            <input
              type="text"
              name="pincode"
              value={newAddress.pincode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={newAddress.phoneNo}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={newAddress.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="add-address-btn">
            {editingAddressId ? 'Update Address' : 'Add Address'}
          </button>
        </form>

        <button onClick={handleShipToThisAddress} className="ship-button">
          Ship to this Address
        </button>

        {error && <div className="error">{error}</div>}
      </div>
      <Footer />
    </div>
  );
};

export default Address;