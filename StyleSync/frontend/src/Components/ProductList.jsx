import React, { useState, useEffect } from 'react';
import './ProductList.css';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { useAlert } from '../Contexts/AlertContext';
import { useParams, useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const config = require('../Config/Constant');

const ProductList = ({ products: initialProducts = [] }) => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState(initialProducts);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (!initialProducts.length && categoryName) {
      const fetchProducts = async () => {
        try {
          const response = await axios.get(`${config.BASE_URL}products/category/${categoryName}`);
          setProducts(response.data);
          setLoading(false);
        } catch (error) {
          showAlert("Sorry, No Products found", "info");
          console.error('Error fetching products:', error);
          setLoading(false);
        }
      };
      fetchProducts();
    }
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${config.BASE_URL}products/wishlist`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWishlist(response.data.map(item => item._id));
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };
    fetchWishlist();
  }, [categoryName, initialProducts.length]);

  useEffect(() => {
    const initialQuantities = {};
    if (Array.isArray(products)) {
      products.forEach(product => {
        initialQuantities[product.name] = 1;
      });
      setQuantities(initialQuantities);
    }
  }, [products]);

  const handleIncrement = (item) => {
    setQuantities({ ...quantities, [item]: quantities[item] + 1 });
  };

  const handleDecrement = (item) => {
    if (quantities[item] > 1) {
      setQuantities({ ...quantities, [item]: quantities[item] - 1 });
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert("No token found. Please log in again!", "error")
        throw new Error('No token found. Please log in again.');
      }
  
      const response = await axios.post(
        `${config.BASE_URL}cart`,
        {
          productId: product._id,
          quantity: quantities[product.name]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );
  
      if (response.status === 201) {
        showAlert(`Added ${quantities[product.name]} ${product.name}(s) to cart.`, 'success');
      } else {
        showAlert('Error adding to cart!', 'error');
        console.error('Error adding to cart:', response.data.error);
      }
    } catch (error) {
      showAlert('Error adding to cart!', 'error');
      console.error('Error adding to cart:', error.message);
    }
  };

  const handleWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showAlert("No token found. Please log in again!", "error");
        throw new Error('No token found. Please log in again.');
      }

      if (wishlist.includes(productId)) {
        await axios.delete(`${config.BASE_URL}products/wishlist/${productId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWishlist(wishlist.filter(id => id !== productId));
        showAlert('Removed from wishlist', 'success');
      } else {
        await axios.post(`${config.BASE_URL}products/wishlist/${productId}`, {}, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setWishlist([...wishlist, productId]);
        showAlert('Added to wishlist', 'success');
      }
    } catch (error) {
      showAlert('Error updating wishlist', 'error');
      console.error('Error updating wishlist:', error);
    }
  };

  if(!products && products.length<=0){
    setLoading(false)
    showAlert("Sorry, No Products found", "info");
  }
  if (loading) {
    return <p>Loading...</p>;
  }

  

  return (
    <>
      <Header />
      <div className="category-container">
        <h2> {categoryName ? `Explore ${categoryName} Essentials : - Your Next Favorite Finds!`: `Found ${products?.length} products`} </h2>
        <div className="item-list">
          {products.map((product, index) => (
            <div key={index} className="item">
              <img 
                src={`data:image/jpeg;base64,${product.image}`} 
                alt={product.name} 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/images/placeholder.png';
                }} 
              />
              <h3>{product.name}</h3>
              <p>Price: ₹{product.price}</p>
              <div className="quantity-controls">
                <button onClick={() => handleDecrement(product.name)}>-</button>
                <span>{quantities[product.name]}</span>
                <button onClick={() => handleIncrement(product.name)}>+</button>
              </div>
              <div className="action-buttons">
                <button className="add-to-cart" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </button>
                <button 
                  className={`wishlist-button ${wishlist.includes(product._id) ? 'in-wishlist' : ''}`} 
                  onClick={() => handleWishlist(product._id)}
                >
                  {wishlist.includes(product._id) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
            </div>
          ))}
        </div>
        <button className="go-to-cart-button" onClick={() => navigate('/cart')}>Go to Cart</button>
      </div>
      <Footer />
    </>
  );
};

export default ProductList;
