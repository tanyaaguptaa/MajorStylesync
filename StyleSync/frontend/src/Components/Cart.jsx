import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Cart.css";
import Footer from "./Footer";
import Header from "./Header";
import CouponCode from "./CouponCode";
const config = require("../Config/Constant");

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);

  // --- New State for Size Input Mode ---
  const [shirtSizeMode, setShirtSizeMode] = useState("pending"); // 'pending', 'choose', 'measure', 'select', 'done'
  const [waistSizeMode, setWaistSizeMode] = useState("pending");
  const [kurtiSizeMode, setKurtiSizeMode] = useState("pending");
  const [kurtaSetSizeMode, setKurtaSetSizeMode] = useState("pending");
  const [lehengaSizeMode, setLehengaSizeMode] = useState("pending");

  // --- State for Selected Standard Sizes ---
  const [selectedStandardShirtSize, setSelectedStandardShirtSize] = useState("");
  const [selectedStandardWaistSize, setSelectedStandardWaistSize] = useState("");
  const [selectedStandardKurtiSize, setSelectedStandardKurtiSize] = useState("");
  const [selectedStandardKurtaSetSize, setSelectedStandardKurtaSetSize] = useState("");
  const [selectedStandardLehengaSize, setSelectedStandardLehengaSize] = useState("");


  // Size measurement states (Keep these for measurement forms)
  const [shirtSizes, setShirtSizes] = useState({ chest: "", front_len: "", shoulder: "" });
  const [waistSizes, setWaistSizes] = useState({ waist: "", front_length: "" });
  const [kurtiSizes, setKurtiSizes] = useState({ bust: "", waist: "", hip: "", length: "" });
  const [kurtaSetSizes, setKurtaSetSizes] = useState({ bust: "", waist: "", hip: "", length: "", bottom_waist: "", bottom_length: "" });
  const [lehengaSizes, setLehengaSizes] = useState({ bust: "", waist: "", hip: "", blouse_length: "", lehenga_length: "" });

  // Recommended size states (Keep these for measurement results)
  const [recommendedShirtSize, setRecommendedShirtSize] = useState("");
  const [recommendedWaistSize, setRecommendedWaistSize] = useState("");
  const [recommendedKurtiSize, setRecommendedKurtiSize] = useState("");
  const [recommendedKurtaSetSize, setRecommendedKurtaSetSize] = useState("");
  const [recommendedLehengaSize, setRecommendedLehengaSize] = useState("");

  const navigate = useNavigate();
  const STANDARD_SIZES = ["XS", "S", "M", "L", "XL", "XXL"]; // Define standard sizes

  useEffect(() => {
    const fetchCart = async () => {
      // ... (existing fetchCart logic remains the same)
      try {
        setLoading(true); // Start loading
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login", { state: { from: "/cart" } });
          return;
        }

        const response = await axios.get(`${config.BASE_URL}cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart(response.data);

        // --- Reset size modes on fetch ---
        setShirtSizeMode("pending");
        setWaistSizeMode("pending");
        setKurtiSizeMode("pending");
        setKurtaSetSizeMode("pending");
        setLehengaSizeMode("pending");
        // Reset selected/recommended sizes
        setSelectedStandardShirtSize(""); setRecommendedShirtSize("");
        setSelectedStandardWaistSize(""); setRecommendedWaistSize("");
        setSelectedStandardKurtiSize(""); setRecommendedKurtiSize("");
        setSelectedStandardKurtaSetSize(""); setRecommendedKurtaSetSize("");
        setSelectedStandardLehengaSize(""); setRecommendedLehengaSize("");


        setLoading(false);
      } catch (err) {
         // ... (existing error handling)
        if (err.response && err.response.status === 401) {
          navigate("/login", { state: { from: "/cart" } });
        } else {
          setError("Failed to fetch cart. Please try again.");
          setLoading(false);
        }
      }
    };

    fetchCart();
  }, [navigate]); // Only depends on navigate

  // --- Determine if Size Input is Needed ---
  useEffect(() => {
    if (cart?.items) {
      const needsShirtSize = cart.items.some(item => isShirt(item.product.name)) && shirtSizeMode === 'pending';
      const needsWaistSize = cart.items.some(item => isPants(item.product.name)) && waistSizeMode === 'pending';
      const needsKurtiSize = cart.items.some(item => isKurti(item.product.name)) && kurtiSizeMode === 'pending';
      const needsKurtaSetSize = cart.items.some(item => isKurtaSet(item.product.name)) && kurtaSetSizeMode === 'pending';
      const needsLehengaSize = cart.items.some(item => isLehenga(item.product.name)) && lehengaSizeMode === 'pending';

      // If size needed and mode is still 'pending', switch to 'choose'
      if (needsShirtSize) setShirtSizeMode('choose'); else if (shirtSizeMode === 'pending') setShirtSizeMode('not_needed'); // Mark as not needed if no shirt
      if (needsWaistSize) setWaistSizeMode('choose'); else if (waistSizeMode === 'pending') setWaistSizeMode('not_needed');
      if (needsKurtiSize) setKurtiSizeMode('choose'); else if (kurtiSizeMode === 'pending') setKurtiSizeMode('not_needed');
      if (needsKurtaSetSize) setKurtaSetSizeMode('choose'); else if (kurtaSetSizeMode === 'pending') setKurtaSetSizeMode('not_needed');
      if (needsLehengaSize) setLehengaSizeMode('choose'); else if (lehengaSizeMode === 'pending') setLehengaSizeMode('not_needed');

    }
  }, [cart, shirtSizeMode, waistSizeMode, kurtiSizeMode, kurtaSetSizeMode, lehengaSizeMode]); // Depend on cart and modes


  // --- Existing Functions (removeItem, decrementItem, incrementItem, refreshCart, handleApplyCoupon) ---
  // ... Keep these functions as they are ...
  const removeItem = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${config.BASE_URL}cart/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      refreshCart();
    } catch (err) {
      setError("Failed to remove item. Please try again.");
    }
  };

  const decrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${config.BASE_URL}cart/decreaseItemQuantity/${productId}`,
        { quantity }, // Backend should handle decrement logic
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (err) {
      setError("Failed to decrement item quantity. Please try again.");
    }
  };

  const incrementItem = async (productId, quantity) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${config.BASE_URL}cart`,
        { productId, quantity: 1 }, // Always increment by 1
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCart();
    } catch (err) {
      setError("Failed to increment item quantity. Please try again.");
    }
  };

  const refreshCart = async () => {
    // ... (keep existing refreshCart)
    try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${config.BASE_URL}cart`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(response.data);
        // Don't reset modes here, let the useEffect handle it
      } catch (err) {
        setError("Failed to refresh cart.");
      }
  };

  const handleApplyCoupon = (discount) => {
    setCouponDiscount(discount);
  };

  // --- Handle Measurement Form Field Changes (Keep these) ---
  const handleShirtSizeChange = (e) => setShirtSizes({ ...shirtSizes, [e.target.name]: e.target.value });
  const handleWaistSizeChange = (e) => setWaistSizes({ ...waistSizes, [e.target.name]: e.target.value });
  const handleKurtiSizeChange = (e) => setKurtiSizes({ ...kurtiSizes, [e.target.name]: e.target.value });
  const handleKurtaSetSizeChange = (e) => setKurtaSetSizes({ ...kurtaSetSizes, [e.target.name]: e.target.value });
  const handleLehengaSizeChange = (e) => setLehengaSizes({ ...lehengaSizes, [e.target.name]: e.target.value });

  // --- Handle Measurement Form Submissions (Update to set mode to 'done') ---
  const handleShirtSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/shirt-size", shirtSizes);
      setRecommendedShirtSize(response.data.recommended_shirt_size);
      setSelectedStandardShirtSize(""); // Clear standard selection
      setShirtSizeMode('done'); // Mark as done
    } catch (error) {
      console.error("Failed to submit shirt size", error);
      alert("Error submitting measurements. Try again!");
    }
  };

  const handleWaistSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/waist-size", waistSizes);
      setRecommendedWaistSize(response.data.recommended_waist_size);
      setSelectedStandardWaistSize("");
      setWaistSizeMode('done');
    } catch (error) {
      console.error("Failed to submit waist size", error);
      alert("Error submitting measurements. Try again!");
    }
  };

    const handleKurtiSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/kurti-size", kurtiSizes);
      setRecommendedKurtiSize(response.data.recommended_kurti_size);
       setSelectedStandardKurtiSize("");
      setKurtiSizeMode('done');
    } catch (error) {
      console.error("Failed to submit kurti size", error);
      alert("Error submitting measurements. Try again!");
    }
  };

    const handleKurtaSetSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/kurta-set-size", kurtaSetSizes);
      setRecommendedKurtaSetSize(response.data.recommended_kurta_set_size);
      setSelectedStandardKurtaSetSize("");
      setKurtaSetSizeMode('done');
    } catch (error) {
      console.error("Failed to submit kurta set size", error);
      alert("Error submitting measurements. Try again!");
    }
  };

    const handleLehengaSizeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/lehenga-size", lehengaSizes);
      setRecommendedLehengaSize(response.data.recommended_lehenga_size);
      setSelectedStandardLehengaSize("");
      setLehengaSizeMode('done');
    } catch (error) {
      console.error("Failed to submit lehenga size", error);
      alert("Error submitting measurements. Try again!");
    }
  };


  // --- Handle Standard Size Selection ---
  const handleStandardSizeSelect = (type, size) => {
    if (type === 'shirt') {
      setSelectedStandardShirtSize(size);
      setRecommendedShirtSize(""); // Clear recommended
      setShirtSizeMode('done');
    } else if (type === 'waist') {
      setSelectedStandardWaistSize(size);
      setRecommendedWaistSize("");
      setWaistSizeMode('done');
    } else if (type === 'kurti') {
      setSelectedStandardKurtiSize(size);
      setRecommendedKurtiSize("");
      setKurtiSizeMode('done');
    } else if (type === 'kurtaSet') {
      setSelectedStandardKurtaSetSize(size);
      setRecommendedKurtaSetSize("");
      setKurtaSetSizeMode('done');
    } else if (type === 'lehenga') {
      setSelectedStandardLehengaSize(size);
      setRecommendedLehengaSize("");
      setLehengaSizeMode('done');
    }
  };


  // --- Product type checkers (Keep these) ---
  const isShirt = (productName) => productName.toLowerCase().includes("shirt");
  const isPants = (productName) => { /* ... existing logic ... */
    const name = productName.toLowerCase();
    return (
      name.includes("pant") ||
      name.includes("jean") ||
      name.includes("lower") ||
      name.includes("trouser")
    );
  };
  const isKurti = (productName) => { /* ... existing logic ... */
    const name = productName.toLowerCase();
    return name.includes("kurti") && !name.includes("set");
  };
  const isKurtaSet = (productName) => { /* ... existing logic ... */
    const name = productName.toLowerCase();
    return (
      (name.includes("kurta") || name.includes("kurti")) && name.includes("set")
    );
  };
  const isLehenga = (productName) => { /* ... existing logic ... */
     const name = productName.toLowerCase();
    return name.includes("lehenga");
  };

  // --- Get FINAL Display Size for a product ---
  const getDisplaySize = (productName) => {
    if (isShirt(productName)) {
      return shirtSizeMode === 'done' ? (selectedStandardShirtSize || recommendedShirtSize || "Size Required") : "Size Required";
    } else if (isPants(productName)) {
      return waistSizeMode === 'done' ? (selectedStandardWaistSize || recommendedWaistSize || "Size Required") : "Size Required";
    } else if (isKurti(productName)) {
      return kurtiSizeMode === 'done' ? (selectedStandardKurtiSize || recommendedKurtiSize || "Size Required") : "Size Required";
    } else if (isKurtaSet(productName)) {
       return kurtaSetSizeMode === 'done' ? (selectedStandardKurtaSetSize || recommendedKurtaSetSize || "Size Required") : "Size Required";
    } else if (isLehenga(productName)) {
       return lehengaSizeMode === 'done' ? (selectedStandardLehengaSize || recommendedLehengaSize || "Size Required") : "Size Required";
    }
    return null; // Return null if size is not applicable
  };

  // --- Check if any size input process is ongoing ---
  const isSizeInputOngoing = () => {
    return [shirtSizeMode, waistSizeMode, kurtiSizeMode, kurtaSetSizeMode, lehengaSizeMode]
           .some(mode => mode === 'choose' || mode === 'measure' || mode === 'select');
  };


  // --- Collect all selected/recommended sizes for checkout ---
  const getAllFinalSizes = () => {
      const sizes = {};
      if (shirtSizeMode === 'done') sizes.shirt = selectedStandardShirtSize || recommendedShirtSize;
      if (waistSizeMode === 'done') sizes.waist = selectedStandardWaistSize || recommendedWaistSize;
      if (kurtiSizeMode === 'done') sizes.kurti = selectedStandardKurtiSize || recommendedKurtiSize;
      if (kurtaSetSizeMode === 'done') sizes.kurtaSet = selectedStandardKurtaSetSize || recommendedKurtaSetSize;
      if (lehengaSizeMode === 'done') sizes.lehenga = selectedStandardLehengaSize || recommendedLehengaSize;
      return sizes;
  };


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  const subtotal = cart?.items?.reduce((acc, item) => acc + item.product.price * item.quantity, 0) || 0;
  const total = subtotal - subtotal * couponDiscount;

  // --- Helper Component for Size Selection/Measurement ---
  const SizeInputSection = ({ type, mode, setMode, handleStandardSelect, standardValue, children }) => {
      if (mode !== 'choose' && mode !== 'measure' && mode !== 'select') return null; // Don't render if done or not needed

      const typeName = type.charAt(0).toUpperCase() + type.slice(1); // e.g., "Shirt"

      return (
        <div className="size-input-section">
          <h3>{typeName} Size Needed</h3>
          {mode === 'choose' && (
            <div className="size-choice">
                <p>Please provide your size:</p>
              <button onClick={() => setMode('measure')} className="size-option-btn">
                Enter Measurements
              </button>
              <div className="standard-size-select">
                <label>Or Select Standard Size: </label>
                <select
                  value={standardValue}
                  onChange={(e) => handleStandardSelect(type, e.target.value)}
                >
                  <option value="" disabled>-- Select Size --</option>
                  {STANDARD_SIZES.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          {mode === 'measure' && (
            <>
              {children} {/* Render the measurement form passed as children */}
              <button onClick={() => setMode('choose')} className="back-to-choice-btn">
                Back to Size Options
              </button>
            </>
          )}
        </div>
      );
  };


  return (
    <div>
      <Header />
      <div className="cart-container">
        <h2 className="cart-header">Your Cart</h2>

        {/* --- Size Input Sections --- */}
        <SizeInputSection
          type="shirt"
          mode={shirtSizeMode}
          setMode={setShirtSizeMode}
          handleStandardSelect={handleStandardSizeSelect}
          standardValue={selectedStandardShirtSize}
        >
          {/* Shirt Measurement Form */}
          <div className="size-form shirt-size-form">
            <h4>Enter Shirt Measurements (inches):</h4>
            <form onSubmit={handleShirtSizeSubmit} className="form-grid">
              <label>Chest: <input type="number" name="chest" value={shirtSizes.chest} onChange={handleShirtSizeChange} required /></label>
              <label>Front Length: <input type="number" name="front_len" value={shirtSizes.front_len} onChange={handleShirtSizeChange} required /></label>
              <label>Shoulder: <input type="number" name="shoulder" value={shirtSizes.shoulder} onChange={handleShirtSizeChange} required /></label>
              <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
          </div>
        </SizeInputSection>

        <SizeInputSection
          type="waist"
          mode={waistSizeMode}
          setMode={setWaistSizeMode}
          handleStandardSelect={handleStandardSizeSelect}
          standardValue={selectedStandardWaistSize}
        >
          {/* Waist Measurement Form */}
           <div className="size-form waist-size-form">
             <h4>Enter Pant/Trouser Measurements (inches):</h4>
            <form onSubmit={handleWaistSizeSubmit} className="form-grid">
              <label>Waist: <input type="number" name="waist" value={waistSizes.waist} onChange={handleWaistSizeChange} required /></label>
              <label>Length: <input type="number" name="front_length" value={waistSizes.front_length} onChange={handleWaistSizeChange} required /></label>
               <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
            </form>
           </div>
        </SizeInputSection>

        <SizeInputSection
            type="kurti"
            mode={kurtiSizeMode}
            setMode={setKurtiSizeMode}
            handleStandardSelect={handleStandardSizeSelect}
            standardValue={selectedStandardKurtiSize}
        >
             {/* Kurti Measurement Form */}
            <div className="size-form kurti-size-form">
                <h4>Enter Kurti Measurements (inches):</h4>
                <form onSubmit={handleKurtiSizeSubmit} className="form-grid">
                     <label>Bust: <input type="number" name="bust" value={kurtiSizes.bust} onChange={handleKurtiSizeChange} required /></label>
                     <label>Waist: <input type="number" name="waist" value={kurtiSizes.waist} onChange={handleKurtiSizeChange} required /></label>
                     <label>Hip: <input type="number" name="hip" value={kurtiSizes.hip} onChange={handleKurtiSizeChange} required /></label>
                     <label>Length: <input type="number" name="length" value={kurtiSizes.length} onChange={handleKurtiSizeChange} required /></label>
                    <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
                </form>
            </div>
        </SizeInputSection>

         <SizeInputSection
            type="kurtaSet"
            mode={kurtaSetSizeMode}
            setMode={setKurtaSetSizeMode}
            handleStandardSelect={handleStandardSizeSelect}
            standardValue={selectedStandardKurtaSetSize}
        >
             {/* Kurta Set Measurement Form */}
             <div className="size-form kurta-set-size-form">
                 <h4>Enter Kurta Set Measurements (inches):</h4>
                <form onSubmit={handleKurtaSetSizeSubmit} className="form-grid">
                    {/* Kurta fields */}
                     <label>Bust: <input type="number" name="bust" value={kurtaSetSizes.bust} onChange={handleKurtaSetSizeChange} required /></label>
                     <label>Waist: <input type="number" name="waist" value={kurtaSetSizes.waist} onChange={handleKurtaSetSizeChange} required /></label>
                     <label>Hip: <input type="number" name="hip" value={kurtaSetSizes.hip} onChange={handleKurtaSetSizeChange} required /></label>
                     <label>Length: <input type="number" name="length" value={kurtaSetSizes.length} onChange={handleKurtaSetSizeChange} required /></label>
                     {/* Bottom fields */}
                     <label>Bottom Waist: <input type="number" name="bottom_waist" value={kurtaSetSizes.bottom_waist} onChange={handleKurtaSetSizeChange} required /></label>
                     <label>Bottom Length: <input type="number" name="bottom_length" value={kurtaSetSizes.bottom_length} onChange={handleKurtaSetSizeChange} required /></label>
                    <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
                </form>
             </div>
        </SizeInputSection>

        <SizeInputSection
            type="lehenga"
            mode={lehengaSizeMode}
            setMode={setLehengaSizeMode}
            handleStandardSelect={handleStandardSizeSelect}
            standardValue={selectedStandardLehengaSize}
        >
             {/* Lehenga Measurement Form */}
              <div className="size-form lehenga-size-form">
                  <h4>Enter Lehenga Measurements (inches):</h4>
                <form onSubmit={handleLehengaSizeSubmit} className="form-grid">
                     <label>Bust: <input type="number" name="bust" value={lehengaSizes.bust} onChange={handleLehengaSizeChange} required /></label>
                     <label>Waist: <input type="number" name="waist" value={lehengaSizes.waist} onChange={handleLehengaSizeChange} required /></label>
                     <label>Hip: <input type="number" name="hip" value={lehengaSizes.hip} onChange={handleLehengaSizeChange} required /></label>
                     <label>Blouse Length: <input type="number" name="blouse_length" value={lehengaSizes.blouse_length} onChange={handleLehengaSizeChange} required /></label>
                     <label>Lehenga Length: <input type="number" name="lehenga_length" value={lehengaSizes.lehenga_length} onChange={handleLehengaSizeChange} required /></label>
                    <button type="submit" className="submit-sizes-btn">Submit Measurements</button>
                </form>
              </div>
        </SizeInputSection>

        {/* --- Cart items or empty cart message --- */}
        {/* Show cart items only if size input is NOT ongoing */}
        {!isSizeInputOngoing() && (
          <>
            {!cart || cart.items.length === 0 ? (
              <div className="empty-cart">
                <p>Your cart is empty</p>
                <Link to="/" className="continue-shopping-button">
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <>
                {cart.items.map((item) => {
                  const displaySize = getDisplaySize(item.product.name); // Get final size
                  const needsSizeInput = displaySize === "Size Required";

                  return (
                    <div key={item.product._id} className={`cart-item ${needsSizeInput ? 'needs-size' : ''}`}>
                      <button
                        className="close-button"
                        onClick={() => removeItem(item.product._id)}
                      >
                        ×
                      </button>
                      <img
                        src={`data:image/jpeg;base64,${item.product.image}`} // Assuming image is base64 encoded
                        alt={item.product.name}
                        className="cart-item-image"
                        onError={(e) => { e.target.onerror = null; e.target.src = "/default-image.jpg"; }}
                      />
                      <div className="cart-item-details">
                        <h3>{item.product.name}</h3>
                        <p className="price">₹{item.product.price}</p>

                        {/* Display the final size */}
                        {displaySize && (
                           <p className={`item-size ${needsSizeInput ? 'size-missing' : ''}`}>
                             Size: <strong>{displaySize}</strong>
                           </p>
                        )}
                        {/* Optional: Add a message if size is still needed */}
                        {needsSizeInput && <p className="size-missing-message">Please select or enter size details above.</p>}


                        <div className="quantity-controls">
                          <button onClick={() => decrementItem(item.product._id, 1)} disabled={item.quantity <= 1}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => incrementItem(item.product._id, 1)}>+</button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* --- Cart Summary & Actions --- */}
                <div className="cart-summary">
                  <CouponCode onApplyCoupon={handleApplyCoupon} />
                  <div className="summary-row"><span>Subtotal:</span><span>₹{subtotal.toFixed(2)}</span></div>
                  {couponDiscount > 0 && ( <div className="summary-row discount"><span>Discount:</span><span>-₹{(subtotal * couponDiscount).toFixed(2)}</span></div> )}
                  <div className="summary-row total"><span>Total:</span><span>₹{total.toFixed(2)}</span></div>
                  <div className="cart-actions">
                    <Link to="/" className="continue-shopping-button">Continue Shopping</Link>
                    <Link
                      to="/checkout"
                      className={`checkout-button ${isSizeInputOngoing() ? 'disabled-link' : ''}`} // Disable checkout if sizes pending
                      state={{
                        total,
                        items: cart.items,
                        finalSizes: getAllFinalSizes(), // Pass all final sizes
                      }}
                      onClick={(e) => { if (isSizeInputOngoing()) e.preventDefault(); }} // Prevent navigation if disabled
                    >
                      Proceed to Checkout
                    </Link>
                     {isSizeInputOngoing() && <p className="size-required-warning">Please provide size information before checkout.</p>}
                  </div>
                </div>
              </>
            )}
          </>
        )}
         {isSizeInputOngoing() && <p className="info-message">Please provide size details above to see your cart items and proceed.</p>}
      </div>
      <Footer />
    </div>
  );
};

export default Cart;
// import React, { useState, useEffect } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import "./Cart.css";
// import Footer from "./Footer";
// import Header from "./Header";
// import CouponCode from "./CouponCode";
// const config = require("../Config/Constant");

// const Cart = () => {
//   const [cart, setCart] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [couponDiscount, setCouponDiscount] = useState(0);

//   // Form visibility states
//   const [showShirtSizeForm, setShowShirtSizeForm] = useState(false);
//   const [showWaistSizeForm, setShowWaistSizeForm] = useState(false);
//   const [showKurtiSizeForm, setShowKurtiSizeForm] = useState(false);
//   const [showKurtaSetSizeForm, setShowKurtaSetSizeForm] = useState(false);
//   const [showLehengaSizeForm, setShowLehengaSizeForm] = useState(false);

//   // Size measurement states
//   const [shirtSizes, setShirtSizes] = useState({
//     chest: "",
//     front_len: "",
//     shoulder: "",
//   });

//   const [waistSizes, setWaistSizes] = useState({
//     waist: "",
//     front_length: "",
//   });

//   const [kurtiSizes, setKurtiSizes] = useState({
//     bust: "",
//     waist: "",
//     hip: "",
//     length: "",
//   });

//   const [kurtaSetSizes, setKurtaSetSizes] = useState({
//     bust: "",
//     waist: "",
//     hip: "",
//     length: "",
//     bottom_waist: "",
//     bottom_length: "",
//   });

//   const [lehengaSizes, setLehengaSizes] = useState({
//     bust: "",
//     waist: "",
//     hip: "",
//     blouse_length: "",
//     lehenga_length: "",
//   });

//   // Form submission states
//   const [shirtSizeSubmitted, setShirtSizeSubmitted] = useState(false);
//   const [waistSizeSubmitted, setWaistSizeSubmitted] = useState(false);
//   const [kurtiSizeSubmitted, setKurtiSizeSubmitted] = useState(false);
//   const [kurtaSetSizeSubmitted, setKurtaSetSizeSubmitted] = useState(false);
//   const [lehengaSizeSubmitted, setLehengaSizeSubmitted] = useState(false);

//   // Recommended size states
//   const [recommendedShirtSize, setRecommendedShirtSize] = useState("");
//   const [recommendedWaistSize, setRecommendedWaistSize] = useState("");
//   const [recommendedKurtiSize, setRecommendedKurtiSize] = useState("");
//   const [recommendedKurtaSetSize, setRecommendedKurtaSetSize] = useState("");
//   const [recommendedLehengaSize, setRecommendedLehengaSize] = useState("");

//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           navigate("/login", { state: { from: "/cart" } });
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
//           navigate("/login", { state: { from: "/cart" } });
//         } else {
//           setError("Failed to fetch cart. Please try again.");
//           setLoading(false);
//         }
//       }
//     };

//     fetchCart();
//   }, [navigate]);

//   useEffect(() => {
//     if (cart?.items) {
//       // Check for various clothing types
//       const hasShirt = cart.items.some((item) =>
//         item.product.name.toLowerCase().includes("shirt")
//       );

//       const hasPants = cart.items.some((item) => {
//         const name = item.product.name.toLowerCase();
//         return (
//           name.includes("pant") ||
//           name.includes("jean") ||
//           name.includes("lower") ||
//           name.includes("trouser")
//         );
//       });

//       const hasKurti = cart.items.some((item) => {
//         const name = item.product.name.toLowerCase();
//         return name.includes("kurti") && !name.includes("set");
//       });

//       const hasKurtaSet = cart.items.some((item) => {
//         const name = item.product.name.toLowerCase();
//         return (
//           (name.includes("kurta") || name.includes("kurti")) &&
//           name.includes("set")
//         );
//       });

//       const hasLehenga = cart.items.some((item) => {
//         const name = item.product.name.toLowerCase();
//         return name.includes("lehenga");
//       });

//       setShowShirtSizeForm(hasShirt && !shirtSizeSubmitted);
//       setShowWaistSizeForm(hasPants && !waistSizeSubmitted);
//       setShowKurtiSizeForm(hasKurti && !kurtiSizeSubmitted);
//       setShowKurtaSetSizeForm(hasKurtaSet && !kurtaSetSizeSubmitted);
//       setShowLehengaSizeForm(hasLehenga && !lehengaSizeSubmitted);
//     }
//   }, [
//     cart,
//     shirtSizeSubmitted,
//     waistSizeSubmitted,
//     kurtiSizeSubmitted,
//     kurtaSetSizeSubmitted,
//     lehengaSizeSubmitted,
//   ]);

//   const removeItem = async (productId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.delete(`${config.BASE_URL}cart/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       refreshCart();
//     } catch (err) {
//       setError("Failed to remove item. Please try again.");
//     }
//   };

//   const decrementItem = async (productId, quantity) => {
//     try {
//       const token = localStorage.getItem("token");
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
//       setError("Failed to decrement item quantity. Please try again.");
//     }
//   };

//   const incrementItem = async (productId, quantity) => {
//     try {
//       const token = localStorage.getItem("token");
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
//       setError("Failed to increment item quantity. Please try again.");
//     }
//   };

//   const refreshCart = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const response = await axios.get(`${config.BASE_URL}cart`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       setCart(response.data);
//     } catch (err) {
//       setError("Failed to refresh cart.");
//     }
//   };

//   const handleApplyCoupon = (discount) => {
//     setCouponDiscount(discount);
//   };

//   // Handle form field changes
//   const handleShirtSizeChange = (e) => {
//     const { name, value } = e.target;
//     setShirtSizes({ ...shirtSizes, [name]: value });
//   };

//   const handleWaistSizeChange = (e) => {
//     const { name, value } = e.target;
//     setWaistSizes({ ...waistSizes, [name]: value });
//   };

//   const handleKurtiSizeChange = (e) => {
//     const { name, value } = e.target;
//     setKurtiSizes({ ...kurtiSizes, [name]: value });
//   };

//   const handleKurtaSetSizeChange = (e) => {
//     const { name, value } = e.target;
//     setKurtaSetSizes({ ...kurtaSetSizes, [name]: value });
//   };

//   const handleLehengaSizeChange = (e) => {
//     const { name, value } = e.target;
//     setLehengaSizes({ ...lehengaSizes, [name]: value });
//   };

//   // Handle form submissions
//   const handleShirtSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/shirt-size",
//         shirtSizes
//       );
//       const size = response.data.recommended_shirt_size;

//       setRecommendedShirtSize(size);
//       setShirtSizeSubmitted(true);
//       setShowShirtSizeForm(false);
//     } catch (error) {
//       console.error("Failed to submit shirt size", error);
//       alert("Error submitting size. Try again!");
//     }
//   };

//   const handleWaistSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/waist-size",
//         waistSizes
//       );
//       const size = response.data.recommended_waist_size;

//       setRecommendedWaistSize(size);
//       setWaistSizeSubmitted(true);
//       setShowWaistSizeForm(false);
//     } catch (error) {
//       console.error("Failed to submit waist size", error);
//       alert("Error submitting size. Try again!");
//     }
//   };

//   const handleKurtiSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/kurti-size",
//         kurtiSizes
//       );
//       const size = response.data.recommended_kurti_size;

//       setRecommendedKurtiSize(size);
//       setKurtiSizeSubmitted(true);
//       setShowKurtiSizeForm(false);
//     } catch (error) {
//       console.error("Failed to submit kurti size", error);
//       alert("Error submitting size. Try again!");
//     }
//   };

//   const handleKurtaSetSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/kurta-set-size",
//         kurtaSetSizes
//       );
//       const size = response.data.recommended_kurta_set_size;

//       setRecommendedKurtaSetSize(size);
//       setKurtaSetSizeSubmitted(true);
//       setShowKurtaSetSizeForm(false);
//     } catch (error) {
//       console.error("Failed to submit kurta set size", error);
//       alert("Error submitting size. Try again!");
//     }
//   };

//   const handleLehengaSizeSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post(
//         "http://localhost:8000/lehenga-size",
//         lehengaSizes
//       );
//       const size = response.data.recommended_lehenga_size;

//       setRecommendedLehengaSize(size);
//       setLehengaSizeSubmitted(true);
//       setShowLehengaSizeForm(false);
//     } catch (error) {
//       console.error("Failed to submit lehenga size", error);
//       alert("Error submitting size. Try again!");
//     }
//   };

//   // Product type checkers
//   const isShirt = (productName) => {
//     return productName.toLowerCase().includes("shirt");
//   };

//   const isPants = (productName) => {
//     const name = productName.toLowerCase();
//     return (
//       name.includes("pant") ||
//       name.includes("jean") ||
//       name.includes("lower") ||
//       name.includes("trouser")
//     );
//   };

//   const isKurti = (productName) => {
//     const name = productName.toLowerCase();
//     return name.includes("kurti") && !name.includes("set");
//   };

//   const isKurtaSet = (productName) => {
//     const name = productName.toLowerCase();
//     return (
//       (name.includes("kurta") || name.includes("kurti")) && name.includes("set")
//     );
//   };

//   const isLehenga = (productName) => {
//     const name = productName.toLowerCase();
//     return name.includes("lehenga");
//   };

//   // Get recommended size for a product
//   const getRecommendedSize = (productName) => {
//     if (isShirt(productName) && shirtSizeSubmitted) {
//       return recommendedShirtSize;
//     } else if (isPants(productName) && waistSizeSubmitted) {
//       return recommendedWaistSize;
//     } else if (isKurti(productName) && kurtiSizeSubmitted) {
//       return recommendedKurtiSize;
//     } else if (isKurtaSet(productName) && kurtaSetSizeSubmitted) {
//       return recommendedKurtaSetSize;
//     } else if (isLehenga(productName) && lehengaSizeSubmitted) {
//       return recommendedLehengaSize;
//     }
//     return null;
//   };

//   // Check if any form is showing
//   const isAnyFormShowing = () => {
//     return (
//       showShirtSizeForm ||
//       showWaistSizeForm ||
//       showKurtiSizeForm ||
//       showKurtaSetSizeForm ||
//       showLehengaSizeForm
//     );
//   };

//   if (loading) return <div className="loading">Loading...</div>;
//   if (error) return <div className="error">{error}</div>;

//   const subtotal = cart
//     ? cart.items?.reduce(
//         (acc, item) => acc + item.product.price * item.quantity,
//         0
//       )
//     : 0;
//   const total = subtotal - subtotal * couponDiscount;

//   return (
//     <div>
//       <Header />
//       <div className="cart-container">
//         <h2 className="cart-header">Your Cart</h2>

//         {/* Shirt Size Form */}
//         {showShirtSizeForm && (
//           <div className="size-form shirt-size-form">
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
//               <button type="submit" className="submit-sizes-btn">
//                 Submit Measurements
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Waist Size Form */}
//         {showWaistSizeForm && (
//           <div className="size-form waist-size-form">
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
//               <button type="submit" className="submit-sizes-btn">
//                 Submit Measurements
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Kurti Size Form */}
//         {showKurtiSizeForm && (
//           <div className="size-form kurti-size-form">
//             <h3>Please enter your measurements for kurti (in inches):</h3>
//             <form onSubmit={handleKurtiSizeSubmit} className="form-grid">
//               <label>
//                 Bust:
//                 <input
//                   type="number"
//                   name="bust"
//                   value={kurtiSizes.bust}
//                   onChange={handleKurtiSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Waist:
//                 <input
//                   type="number"
//                   name="waist"
//                   value={kurtiSizes.waist}
//                   onChange={handleKurtiSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Hip:
//                 <input
//                   type="number"
//                   name="hip"
//                   value={kurtiSizes.hip}
//                   onChange={handleKurtiSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Length:
//                 <input
//                   type="number"
//                   name="length"
//                   value={kurtiSizes.length}
//                   onChange={handleKurtiSizeChange}
//                   required
//                 />
//               </label>
//               <button type="submit" className="submit-sizes-btn">
//                 Submit Measurements
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Kurta Set Size Form */}
//         {showKurtaSetSizeForm && (
//           <div className="size-form kurta-set-size-form">
//             <h3>Please enter your measurements for kurta set (in inches):</h3>
//             <form onSubmit={handleKurtaSetSizeSubmit} className="form-grid">
//               <label>
//                 Bust:
//                 <input
//                   type="number"
//                   name="bust"
//                   value={kurtaSetSizes.bust}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Waist:
//                 <input
//                   type="number"
//                   name="waist"
//                   value={kurtaSetSizes.waist}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Hip:
//                 <input
//                   type="number"
//                   name="hip"
//                   value={kurtaSetSizes.hip}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Length:
//                 <input
//                   type="number"
//                   name="length"
//                   value={kurtaSetSizes.length}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Bottom Waist:
//                 <input
//                   type="number"
//                   name="bottom_waist"
//                   value={kurtaSetSizes.bottom_waist}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Bottom Length:
//                 <input
//                   type="number"
//                   name="bottom_length"
//                   value={kurtaSetSizes.bottom_length}
//                   onChange={handleKurtaSetSizeChange}
//                   required
//                 />
//               </label>
//               <button type="submit" className="submit-sizes-btn">
//                 Submit Measurements
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Lehenga Size Form */}
//         {showLehengaSizeForm && (
//           <div className="size-form lehenga-size-form">
//             <h3>Please enter your measurements for lehenga (in inches):</h3>
//             <form onSubmit={handleLehengaSizeSubmit} className="form-grid">
//               <label>
//                 Bust:
//                 <input
//                   type="number"
//                   name="bust"
//                   value={lehengaSizes.bust}
//                   onChange={handleLehengaSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Waist:
//                 <input
//                   type="number"
//                   name="waist"
//                   value={lehengaSizes.waist}
//                   onChange={handleLehengaSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Hip:
//                 <input
//                   type="number"
//                   name="hip"
//                   value={lehengaSizes.hip}
//                   onChange={handleLehengaSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Blouse Length:
//                 <input
//                   type="number"
//                   name="blouse_length"
//                   value={lehengaSizes.blouse_length}
//                   onChange={handleLehengaSizeChange}
//                   required
//                 />
//               </label>
//               <label>
//                 Lehenga Length:
//                 <input
//                   type="number"
//                   name="lehenga_length"
//                   value={lehengaSizes.lehenga_length}
//                   onChange={handleLehengaSizeChange}
//                   required
//                 />
//               </label>
//               <button type="submit" className="submit-sizes-btn">
//                 Submit Measurements
//               </button>
//             </form>
//           </div>
//         )}

//         {/* Cart items or empty cart message */}
//         {!isAnyFormShowing() && (
//           <>
//             {!cart || cart.items.length === 0 ? (
//               <div className="empty-cart">
//                 <p>Your cart is empty</p>
//                 <Link to="/" className="continue-shopping-button">
//                   Continue Shopping
//                 </Link>
//               </div>
//             ) : (
//               <>
//                 {cart.items.map((item) => {
//                   const recommendedSize = getRecommendedSize(item.product.name);
//                   return (
//                     <div key={item.product._id} className="cart-item">
//                       <button
//                         className="close-button"
//                         onClick={() => removeItem(item.product._id)}
//                       >
//                         &times;
//                       </button>
//                       <img
//                         src={`data:image/jpeg;base64,${item.product.image}`}
//                         alt={item.product.name}
//                         className="cart-item-image"
//                         onError={(e) => {
//                           e.target.onerror = null;
//                           e.target.src = "/default-image.jpg";
//                         }}
//                       />
//                       <div className="cart-item-details">
//                         <h3>{item.product.name}</h3>
//                         <p className="price">₹{item.product.price}</p>

//                         {recommendedSize && (
//                           <p className="recommended-size">
//                             Recommended Size: <strong>{recommendedSize}</strong>
//                           </p>
//                         )}

//                         <div className="quantity-controls">
//                           <button
//                             onClick={() => decrementItem(item.product._id, 1)}
//                             disabled={item.quantity <= 1}
//                           >
//                             -
//                           </button>
//                           <span>{item.quantity}</span>
//                           <button
//                             onClick={() => incrementItem(item.product._id, 1)}
//                           >
//                             +
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 <div className="cart-summary">
//                   <CouponCode onApplyCoupon={handleApplyCoupon} />

//                   <div className="summary-row">
//                     <span>Subtotal:</span>
//                     <span>₹{subtotal.toFixed(2)}</span>
//                   </div>

//                   {couponDiscount > 0 && (
//                     <div className="summary-row discount">
//                       <span>Discount:</span>
//                       <span>-₹{(subtotal * couponDiscount).toFixed(2)}</span>
//                     </div>
//                   )}

//                   <div className="summary-row total">
//                     <span>Total:</span>
//                     <span>₹{total.toFixed(2)}</span>
//                   </div>

//                   <div className="cart-actions">
//                     <Link to="/" className="continue-shopping-button">
//                       Continue Shopping
//                     </Link>
//                     <Link
//                       to="/checkout"
//                       className="checkout-button"
//                       state={{
//                         total,
//                         items: cart.items,
//                         recommendedSizes: {
//                           shirt: recommendedShirtSize,
//                           waist: recommendedWaistSize,
//                           kurti: recommendedKurtiSize,
//                           kurtaSet: recommendedKurtaSetSize,
//                           lehenga: recommendedLehengaSize,
//                         },
//                       }}
//                     >
//                       Proceed to Checkout
//                     </Link>
//                   </div>
//                 </div>
//               </>
//             )}
//           </>
//         )}
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default Cart;
