
// import React, { useState, useEffect } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import axios from 'axios';
// import './Cart.css';
// import Footer from './Footer';
// import Header from './Header';
// import CouponCode from './CouponCode';
// const config = require('../Config/Constant');

// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [couponDiscount, setCouponDiscount] = useState(0);
//   const [showShirtSizeForm, setShowShirtSizeForm] = useState(false);
//   const [showWaistSizeForm, setShowWaistSizeForm] = useState(false);
//   const [shirtSizes, setShirtSizes] = useState({
//     chest: '',
//     front_len: '',
//     shoulder: '',
//   });
//   const [waistSizes, setWaistSizes] = useState({
//     waist: '',
//     front_length: '',
//   });
//   const [shirtSizeSubmitted, setShirtSizeSubmitted] = useState(false);
//   const [waistSizeSubmitted, setWaistSizeSubmitted] = useState(false);
//   const [recommendedShirtSize, setRecommendedShirtSize] = useState('');
//   const [recommendedWaistSize, setRecommendedWaistSize] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login', { state: { from: '/cart' } });
//           return;
//         }

//         const response = await axios.get(`${config.BASE_URL}cart`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setCart(response.data);
//         setLoading(false);
//       } catch (err) {
//         if (err.response && err.response.status === 401) {
//           navigate('/login', { state: { from: '/cart' } });
//         } else {
//           setError('Failed to fetch cart. Please try again.');
//           setLoading(false);
//         }
//       }
//     };

//     fetchCart();
//   }, [navigate]);

//   useEffect(() => {
//     if (cart?.items) {
//       // Check for shirts
//       const hasShirt = cart.items.some(item => 
//         item.product.name.toLowerCase().includes('shirt')
//       );
      
//       // Check for pants, jeans, or lowers
//       const hasPants = cart.items.some(item => {
//         const name = item.product.name.toLowerCase();
//         return name.includes('pant') || name.includes('jean') || name.includes('lower') || name.includes('trouser');
//       });
      
//       setShowShirtSizeForm(hasShirt && !shirtSizeSubmitted);
//       setShowWaistSizeForm(hasPants && !waistSizeSubmitted);
//     }
//   }, [cart, shirtSizeSubmitted, waistSizeSubmitted]);

//   const removeItem = async (productId) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.delete(`${config.BASE_URL}cart/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       refreshCart();
//     } catch (err) {
//       setError('Failed to remove item. Please try again.');
//     }
//   };

//   const decrementItem = async (productId, quantity) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.put(
//         `${config.BASE_URL}cart/decreaseItemQuantity/${productId}`,
//         { quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       refreshCart();
//     } catch (err) {
//       setError('Failed to decrement item quantity. Please try again.');
//     }
//   };

//   const incrementItem = async (productId, quantity) => {
//     try {
//       const token = localStorage.getItem('token');
//       await axios.post(
//         `${config.BASE_URL}cart`,
//         { productId, quantity },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );
//       refreshCart();
//     } catch (err) {
//       setError('Failed to increment item quantity. Please try again.');
//     }
//   };

//   const refreshCart = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const response = await axios.get(`${config.BASE_URL}cart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCart(response.data);
//     } catch (err) {
//       setError('Failed to refresh cart.');
//     }
//   };

//   const handleApplyCoupon = (discount) => {
//     setCouponDiscount(discount);
//   };

//   const handleShirtSizeChange = (e) => {
//     const { name, value } = e.target;
//     setShirtSizes({ ...shirtSizes, [name]: value });
//   };

//   const handleWaistSizeChange = (e) => {
//     const { name, value } = e.target;
//     setWaistSizes({ ...waistSizes, [name]: value });
//   };

//   const handleShirtSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/shirt-size', shirtSizes);
//       const size = response.data.recommended_shirt_size;
      
//       setRecommendedShirtSize(size);
//       setShirtSizeSubmitted(true);
//       setShowShirtSizeForm(false);
//     } catch (error) {
//       console.error('Failed to submit shirt size', error);
//       alert('Error submitting size. Try again!');
//     }
//   };

//   const handleWaistSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8000/waist-size', waistSizes);
//       const size = response.data.recommended_waist_size;
      
//       setRecommendedWaistSize(size);
//       setWaistSizeSubmitted(true);
//       setShowWaistSizeForm(false);
//     } catch (error) {
//       console.error('Failed to submit waist size', error);
//       alert('Error submitting size. Try again!');
//     }
//   };

//   // Check if a product is a shirt
//   const isShirt = (productName) => {
//     return productName.toLowerCase().includes('shirt');
//   };

//   // Check if a product is pants/jeans/lower
//   const isPants = (productName) => {
//     const name = productName.toLowerCase();
//     return name.includes('pant') || name.includes('jean') || name.includes('lower') || name.includes('trouser');
//   };

//   // Get recommended size for a product
//   const getRecommendedSize = (productName) => {
//     if (isShirt(productName) && shirtSizeSubmitted) {
//       return recommendedShirtSize;
//     } else if (isPants(productName) && waistSizeSubmitted) {
//       return recommendedWaistSize;
//     }
//     return null;
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   const subtotal = cart ? cart.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : 0;
//   const total = subtotal - (subtotal * couponDiscount);

//   return (
//     <div>
//       <Header />
//       <div className="cart-container">
//         <h2 className="cart-header">Your Cart</h2>
        
//         {/* Shirt Size Form */}
//         {showShirtSizeForm && (
//           <div className="shirt-size-form">
//             <h3>Please enter your shirt measurements (in inches):</h3>
//             <form onSubmit={handleShirtSizeSubmit} className="form-grid">
//               <label>
//                 Chest:
//                 <input
//                   type="number"
//                   name="chest"
//                   value={shirtSizes.chest}
//                   onChange={handleShirtSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Front Length:
//                 <input
//                   type="number"
//                   name="front_len"
//                   value={shirtSizes.front_len}
//                   onChange={handleShirtSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Shoulder:
//                 <input
//                   type="number"
//                   name="shoulder"
//                   value={shirtSizes.shoulder}
//                   onChange={handleShirtSizeChange}
//                   required
//                 />
//               </label>
//               <button type="submit" className="submit-sizes-btn">Submit Shirt Sizes</button>
//             </form>
//           </div>
//         )}
        
//         {/* Waist Size Form */}
//         {showWaistSizeForm && (
//           <div className="waist-size-form">
//             <h3>Please enter your waist measurements (in inches):</h3>
//             <form onSubmit={handleWaistSizeSubmit} className="form-grid">
//               <label>
//                 Waist:
//                 <input
//                   type="number"
//                   name="waist"
//                   value={waistSizes.waist}
//                   onChange={handleWaistSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Front Length:
//                 <input
//                   type="number"
//                   name="front_length"
//                   value={waistSizes.front_length}
//                   onChange={handleWaistSizeChange}
//                   required
//                 />
//               </label>
//               <button type="submit" className="submit-sizes-btn">Submit Waist Sizes</button>
//             </form>
//           </div>
//         )}
  
//         {/* Cart items or empty cart message */}
//         {(!showShirtSizeForm && !showWaistSizeForm) || (showShirtSizeForm && showWaistSizeForm) ? (
//           <>
//             {!cart || cart.items.length === 0 ? (
//               <div className="empty-cart">
//                 <p>Your cart is empty</p>
//                 <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
//               </div>
//             ) : (
//               <>
//                 {cart.items.map((item) => {
//                   const recommendedSize = getRecommendedSize(item.product.name);
//                   return (
//                     <div key={item.product._id} className="cart-item">
//                       <button className="close-button" onClick={() => removeItem(item.product._id)}>
//                         &times;
//                       </button>
//                       <img
//                         src={`data:image/jpeg;base64,${item.product.image}`}
//                         alt={item.product.name}
//                         className="cart-item-image"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = '/images/placeholder.png';
//                         }}
//                       />
//                       <div className="cart-item-details">
//                         <h3 className="cart-item-name">{item.product.name}</h3>
//                         <div className="cart-item-price-section">
//                           <p className="cart-item-price">Price: ₹{item.product.price}</p>
//                           {recommendedSize && (
//                             <p className="cart-item-size">
//                               Recommended Size: <span className="size-badge">{recommendedSize}</span>
//                             </p>
//                           )}
//                         </div>
//                         <div className="quantity-controls">
//                           <button className="cart-item-button decrement" onClick={() => decrementItem(item.product._id, 1)}>
//                             -
//                           </button>
//                           <span>{item.quantity}</span>
//                           <button className="cart-item-button increment" onClick={() => incrementItem(item.product._id, 1)}>
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//                 <CouponCode onApplyCoupon={handleApplyCoupon} totalAmount={subtotal} />
//                 <div className="cart-total">
//                   <h3>MRP: ₹{subtotal.toFixed(2)}</h3>
//                   {couponDiscount > 0 && <h3>Coupon Discount: -₹{(subtotal * couponDiscount).toFixed(2)}</h3>}
//                   <h3 id="total-amount">Total Amount: ₹{total.toFixed(2)}</h3>
//                 </div>
//                 <Link to="/Address" className="proceed-button">
//                   Proceed to Checkout
//                 </Link>
//               </>
//             )}
//           </>
//         ) : null}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Cart.css';
import Footer from './Footer';
import Header from './Header';
import CouponCode from './CouponCode';
const config = require('../Config/Constant');

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  
  // Form visibility states
  const [showShirtSizeForm, setShowShirtSizeForm] = useState(false);
  const [showWaistSizeForm, setShowWaistSizeForm] = useState(false);
  const [showKurtiSizeForm, setShowKurtiSizeForm] = useState(false);
  const [showKurtaSetSizeForm, setShowKurtaSetSizeForm] = useState(false);
  const [showLehengaSizeForm, setShowLehengaSizeForm] = useState(false);
  
  // Size measurement states
  const [shirtSizes, setShirtSizes] = useState({
    chest: '',
    front_len: '',
    shoulder: '',
  });
  
  const [waistSizes, setWaistSizes] = useState({
    waist: '',
    front_length: '',
  });
  
  const [kurtiSizes, setKurtiSizes] = useState({
    bust: '',
    waist: '',
    hip: '',
    length: '',
  });
  
  const [kurtaSetSizes, setKurtaSetSizes] = useState({
    bust: '',
    waist: '',
    hip: '',
    length: '',
    bottom_waist: '',
    bottom_length: '',
  });
  
  const [lehengaSizes, setLehengaSizes] = useState({
    bust: '',
    waist: '',
    hip: '',
    blouse_length: '',
    lehenga_length: '',
  });
  
  // Form submission states
  const [shirtSizeSubmitted, setShirtSizeSubmitted] = useState(false);
  const [waistSizeSubmitted, setWaistSizeSubmitted] = useState(false);
  const [kurtiSizeSubmitted, setKurtiSizeSubmitted] = useState(false);
  const [kurtaSetSizeSubmitted, setKurtaSetSizeSubmitted] = useState(false);
  const [lehengaSizeSubmitted, setLehengaSizeSubmitted] = useState(false);
  
  // Recommended size states
  const [recommendedShirtSize, setRecommendedShirtSize] = useState('');
  const [recommendedWaistSize, setRecommendedWaistSize] = useState('');
  const [recommendedKurtiSize, setRecommendedKurtiSize] = useState('');
  const [recommendedKurtaSetSize, setRecommendedKurtaSetSize] = useState('');
  const [recommendedLehengaSize, setRecommendedLehengaSize] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login', { state: { from: '/cart' } });
          return;
        }

        const response = await axios.get(`${config.BASE_URL}cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          navigate('/login', { state: { from: '/cart' } });
        } else {
          setError('Failed to fetch cart. Please try again.');
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [navigate]);

  useEffect(() => {
    if (cart?.items) {
      // Check for various clothing types
      const hasShirt = cart.items.some(item => 
        item.product.name.toLowerCase().includes('shirt')
      );
      
      const hasPants = cart.items.some(item => {
        const name = item.product.name.toLowerCase();
        return name.includes('pant') || name.includes('jean') || 
               name.includes('lower') || name.includes('trouser');
      });
      
      const hasKurti = cart.items.some(item => {
        const name = item.product.name.toLowerCase();
        return name.includes('kurti') && !name.includes('set');
      });
      
      const hasKurtaSet = cart.items.some(item => {
        const name = item.product.name.toLowerCase();
        return (name.includes('kurta') || name.includes('kurti')) && 
                name.includes('set');
      });
      
      const hasLehenga = cart.items.some(item => {
        const name = item.product.name.toLowerCase();
        return name.includes('lehenga');
      });
      
      setShowShirtSizeForm(hasShirt && !shirtSizeSubmitted);
      setShowWaistSizeForm(hasPants && !waistSizeSubmitted);
      setShowKurtiSizeForm(hasKurti && !kurtiSizeSubmitted);
      setShowKurtaSetSizeForm(hasKurtaSet && !kurtaSetSizeSubmitted);
      setShowLehengaSizeForm(hasLehenga && !lehengaSizeSubmitted);
    }
  }, [cart, shirtSizeSubmitted, waistSizeSubmitted, kurtiSizeSubmitted, 
      kurtaSetSizeSubmitted, lehengaSizeSubmitted]);

  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${config.BASE_URL}cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshCart();
    } catch (err) {
      setError('Failed to remove item. Please try again.');
    }
  };

  const decrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${config.BASE_URL}cart/decreaseItemQuantity/${productId}`,
        { quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (err) {
      setError('Failed to decrement item quantity. Please try again.');
    }
  };

  const incrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${config.BASE_URL}cart`,
        { productId, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (err) {
      setError('Failed to increment item quantity. Please try again.');
    }
  };

  const refreshCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${config.BASE_URL}cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCart(response.data);
    } catch (err) {
      setError('Failed to refresh cart.');
    }
  };

  const handleApplyCoupon = (discount) => {
    setCouponDiscount(discount);
  };

  // Handle form field changes
  const handleShirtSizeChange = (e) => {
    const { name, value } = e.target;
    setShirtSizes({ ...shirtSizes, [name]: value });
  };

  const handleWaistSizeChange = (e) => {
    const { name, value } = e.target;
    setWaistSizes({ ...waistSizes, [name]: value });
  };
  
  const handleKurtiSizeChange = (e) => {
    const { name, value } = e.target;
    setKurtiSizes({ ...kurtiSizes, [name]: value });
  };
  
  const handleKurtaSetSizeChange = (e) => {
    const { name, value } = e.target;
    setKurtaSetSizes({ ...kurtaSetSizes, [name]: value });
  };
  
  const handleLehengaSizeChange = (e) => {
    const { name, value } = e.target;
    setLehengaSizes({ ...lehengaSizes, [name]: value });
  };

  // Handle form submissions
  const handleShirtSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/shirt-size', shirtSizes);
      const size = response.data.recommended_shirt_size;
      
      setRecommendedShirtSize(size);
      setShirtSizeSubmitted(true);
      setShowShirtSizeForm(false);
    } catch (error) {
      console.error('Failed to submit shirt size', error);
      alert('Error submitting size. Try again!');
    }
  };

  const handleWaistSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/waist-size', waistSizes);
      const size = response.data.recommended_waist_size;
      
      setRecommendedWaistSize(size);
      setWaistSizeSubmitted(true);
      setShowWaistSizeForm(false);
    } catch (error) {
      console.error('Failed to submit waist size', error);
      alert('Error submitting size. Try again!');
    }
  };
  
  const handleKurtiSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/kurti-size', kurtiSizes);
      const size = response.data.recommended_kurti_size;
      
      setRecommendedKurtiSize(size);
      setKurtiSizeSubmitted(true);
      setShowKurtiSizeForm(false);
    } catch (error) {
      console.error('Failed to submit kurti size', error);
      alert('Error submitting size. Try again!');
    }
  };
  
  const handleKurtaSetSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/kurta-set-size', kurtaSetSizes);
      const size = response.data.recommended_kurta_set_size;
      
      setRecommendedKurtaSetSize(size);
      setKurtaSetSizeSubmitted(true);
      setShowKurtaSetSizeForm(false);
    } catch (error) {
      console.error('Failed to submit kurta set size', error);
      alert('Error submitting size. Try again!');
    }
  };
  
  const handleLehengaSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/lehenga-size', lehengaSizes);
      const size = response.data.recommended_lehenga_size;
      
      setRecommendedLehengaSize(size);
      setLehengaSizeSubmitted(true);
      setShowLehengaSizeForm(false);
    } catch (error) {
      console.error('Failed to submit lehenga size', error);
      alert('Error submitting size. Try again!');
    }
  };

  // Product type checkers
  const isShirt = (productName) => {
    return productName.toLowerCase().includes('shirt');
  };

  const isPants = (productName) => {
    const name = productName.toLowerCase();
    return name.includes('pant') || name.includes('jean') || 
           name.includes('lower') || name.includes('trouser');
  };
  
  const isKurti = (productName) => {
    const name = productName.toLowerCase();
    return name.includes('kurti') && !name.includes('set');
  };
  
  const isKurtaSet = (productName) => {
    const name = productName.toLowerCase();
    return (name.includes('kurta') || name.includes('kurti')) && 
            name.includes('set');
  };
  
  const isLehenga = (productName) => {
    const name = productName.toLowerCase();
    return name.includes('lehenga');
  };

  // Get recommended size for a product
  const getRecommendedSize = (productName) => {
    if (isShirt(productName) && shirtSizeSubmitted) {
      return recommendedShirtSize;
    } else if (isPants(productName) && waistSizeSubmitted) {
      return recommendedWaistSize;
    } else if (isKurti(productName) && kurtiSizeSubmitted) {
      return recommendedKurtiSize;
    } else if (isKurtaSet(productName) && kurtaSetSizeSubmitted) {
      return recommendedKurtaSetSize;
    } else if (isLehenga(productName) && lehengaSizeSubmitted) {
      return recommendedLehengaSize;
    }
    return null;
  };

  // Check if any form is showing
  const isAnyFormShowing = () => {
    return showShirtSizeForm || showWaistSizeForm || 
           showKurtiSizeForm || showKurtaSetSizeForm || 
           showLehengaSizeForm;
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const subtotal = cart ? cart.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) : 0;
  const total = subtotal - (subtotal * couponDiscount);

  return (
    <div>
      <Header />
      <div className="cart-container">
        <h2 className="cart-header">Your Cart</h2>
        
        {/* Shirt Size Form */}
        {showShirtSizeForm && (
          <div className="size-form shirt-size-form">
            <h3>Please enter your shirt measurements (in inches):</h3>
            <form onSubmit={handleShirtSizeSubmit} className="form-grid">
              <label>
                Chest:
                <input
                  type="number"
                  name="chest"
                  value={shirtSizes.chest}
                  onChange={handleShirtSizeChange}
                  required
                />
              </label>
              <label>
                Front Length:
                <input
                  type="number"
                  name="front_len"
                  value={shirtSizes.front_len}
                  onChange={handleShirtSizeChange}
                  required
                />
              </label>
              <label>
                Shoulder:
                <input
                  type="number"
                  name="shoulder"
                  value={shirtSizes.shoulder}
                  onChange={handleShirtSizeChange}
                  required
                />
              </label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        )}
        
        {/* Waist Size Form */}
        {showWaistSizeForm && (
          <div className="size-form waist-size-form">
            <h3>Please enter your waist measurements (in inches):</h3>
            <form onSubmit={handleWaistSizeSubmit} className="form-grid">
              <label>
                Waist:
                <input
                  type="number"
                  name="waist"
                  value={waistSizes.waist}
                  onChange={handleWaistSizeChange}
                  required
                />
              </label>
              <label>
                Front Length:
                <input
                  type="number"
                  name="front_length"
                  value={waistSizes.front_length}
                  onChange={handleWaistSizeChange}
                  required
                />
              </label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        )}
        
        {/* Kurti Size Form */}
        {showKurtiSizeForm && (
          <div className="size-form kurti-size-form">
            <h3>Please enter your measurements for kurti (in inches):</h3>
            <form onSubmit={handleKurtiSizeSubmit} className="form-grid">
              <label>
                Bust:
                <input
                  type="number"
                  name="bust"
                  value={kurtiSizes.bust}
                  onChange={handleKurtiSizeChange}
                  required
                />
              </label>
              <label>
                Waist:
                <input
                  type="number"
                  name="waist"
                  value={kurtiSizes.waist}
                  onChange={handleKurtiSizeChange}
                  required
                />
              </label>
              <label>
                Hip:
                <input
                  type="number"
                  name="hip"
                  value={kurtiSizes.hip}
                  onChange={handleKurtiSizeChange}
                  required
                />
              </label>
              <label>
                Length:
                <input
                  type="number"
                  name="length"
                  value={kurtiSizes.length}
                  onChange={handleKurtiSizeChange}
                  required
                />
              </label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        )}
        
        {/* Kurta Set Size Form */}
        {showKurtaSetSizeForm && (
          <div className="size-form kurta-set-size-form">
            <h3>Please enter your measurements for kurta set (in inches):</h3>
            <form onSubmit={handleKurtaSetSizeSubmit} className="form-grid">
              <label>
                Bust:
                <input
                  type="number"
                  name="bust"
                  value={kurtaSetSizes.bust}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <label>
                Waist:
                <input
                  type="number"
                  name="waist"
                  value={kurtaSetSizes.waist}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <label>
                Hip:
                <input
                  type="number"
                  name="hip"
                  value={kurtaSetSizes.hip}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <label>
                Length:
                <input
                  type="number"
                  name="length"
                  value={kurtaSetSizes.length}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <label>
                Bottom Waist:
                <input
                  type="number"
                  name="bottom_waist"
                  value={kurtaSetSizes.bottom_waist}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <label>
                Bottom Length:
                <input
                  type="number"
                  name="bottom_length"
                  value={kurtaSetSizes.bottom_length}
                  onChange={handleKurtaSetSizeChange}
                  required
                />
              </label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        )}
        
        {/* Lehenga Size Form */}
        {showLehengaSizeForm && (
          <div className="size-form lehenga-size-form">
            <h3>Please enter your measurements for lehenga (in inches):</h3>
            <form onSubmit={handleLehengaSizeSubmit} className="form-grid">
              <label>
                Bust:
                <input
                  type="number"
                  name="bust"
                  value={lehengaSizes.bust}
                  onChange={handleLehengaSizeChange}
                  required
                />
              </label>
              <label>
                Waist:
                <input
                  type="number"
                  name="waist"
                  value={lehengaSizes.waist}
                  onChange={handleLehengaSizeChange}
                  required
                />
              </label>
              <label>
                Hip:
                <input
                  type="number"
                  name="hip"
                  value={lehengaSizes.hip}
                  onChange={handleLehengaSizeChange}
                  required
                />
              </label>
              <label>
                Blouse Length:
                <input
                  type="number"
                  name="blouse_length"
                  value={lehengaSizes.blouse_length}
                  onChange={handleLehengaSizeChange}
                  required
                />
              </label>
              <label>
                Lehenga Length:
                <input
                  type="number"
                  name="lehenga_length"
                  value={lehengaSizes.lehenga_length}
                  onChange={handleLehengaSizeChange}
                  required
                />
              </label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        )}
  
        {/* Cart items or empty cart message */}
        {!isAnyFormShowing() && (
          <>
            {!cart || cart.items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
              </div>
            ) : (
              <>
                {cart.items.map((item) => {
                  const recommendedSize = getRecommendedSize(item.product.name);
                  return (
                    <div key={item.product._id} className="cart-item">
                      <button className="close-button" onClick={() => removeItem(item.product._id)}>
                        &times;
                      </button>
                      <img
                        src={`data:image/jpeg;base64,${item.product.image}`}
                        alt={item.product.name}
                        className="cart-item-image"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/default-image.jpg';
                        }}
                      />
                      <div className="cart-item-details">
                        <h3>{item.product.name}</h3>
                        <p className="price">₹{item.product.price}</p>
                        
                        {recommendedSize && (
                          <p className="recommended-size">
                            Recommended Size: <strong>{recommendedSize}</strong>
                          </p>
                        )}
                        
                        <div className="quantity-controls">
                          <button
                            onClick={() => decrementItem(item.product._id, 1)}
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            onClick={() => incrementItem(item.product._id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="cart-summary">
                  <CouponCode onApplyCoupon={handleApplyCoupon} />
                  
                  <div className="summary-row">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  
                  {couponDiscount > 0 && (
                    <div className="summary-row discount">
                      <span>Discount:</span>
                      <span>-₹{(subtotal * couponDiscount).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="summary-row total">
                    <span>Total:</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>

                  <div className="cart-actions">
                    <Link to="/" className="continue-shopping-button">
                      Continue Shopping
                    </Link>
                    <Link 
                      to="/checkout" 
                      className="checkout-button"
                      state={{ total, items: cart.items, recommendedSizes: {
                        shirt: recommendedShirtSize,
                        waist: recommendedWaistSize,
                        kurti: recommendedKurtiSize,
                        kurtaSet: recommendedKurtaSetSize,
                        lehenga: recommendedLehengaSize
                      }}}
                    >
                      Proceed to Checkout
                    </Link>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;