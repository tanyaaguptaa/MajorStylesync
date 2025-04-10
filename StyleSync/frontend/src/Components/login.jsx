import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAlert } from '../Contexts/AlertContext';
import './login.css';

const config = require('../Config/Constant');

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [forgotPassword, setForgotPassword] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const { showAlert } = useAlert();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => password.length >= 6;

  const validateForm = () => {
    const newErrors = {};

    if (!validateEmail(email)) {
      newErrors.email = 'Invalid email address';
    }

    if (!validatePassword(password)) {
      newErrors.password = 'Password must be at least 6 characters long';
    }

    if (!isLogin && password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!isLogin && name.trim() === '') {
      newErrors.name = 'Name is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleNameChange = (e) => setName(e.target.value);
  const handleToggle = () => setIsLogin(!isLogin);

  const handleLoginSuccess = (email, name, role, isAdmin) => {
    showAlert(`Logged in successfully as' ${email}`, 'success')
    console.log('Logged in successfully as', email, 'Role:', role, 'Is Admin:', isAdmin);
    setIsAuth(true);
    localStorage.setItem('user', JSON.stringify({ email, name, role, isAdmin }));
    
    const redirectUrl = location.state?.from || (isAdmin ? '/admin' : '/');
    navigate(redirectUrl);
  };

  const verifyToken = async (token) => {
    try {
      const response = await axios.post(`${config.BASE_URL}users/verify-token`, { token });
      setIsAuth(response.data.isAuth);
    } catch (error) {
      showAlert("Token verification failed", "error");
      console.error('Token verification failed:', error);
      setIsAuth(false);
    }
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      console.log('Logging in...');
      const response = await axios.post(`${config.BASE_URL}users/login`, { email, password });
      console.log(response.data);
      const { token, role, name, isAdmin } = response.data;
      localStorage.setItem('token', token);
      handleLoginSuccess(email, name, role, isAdmin);
    } catch (error) {
      showAlert(`Login failed: ${error.response?.data?.message || 'An unknown error occurred'}`, 'error');
      console.error('Login Error:', error);
      // setTimeout(() => {
      //   setErrors({});
      // }, 5000);
    }
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      console.log('Signing up...');
      await axios.post(`${config.BASE_URL}users/register`, { email, password, name });
      await handleLogin();
    } catch (error) {
      showAlert(`signup failed: ${error.response?.data?.message || 'An unknown error occurred' }`, 'error');
      console.error('Signup Error:', error);
      // setTimeout(() => {
      //   setErrors({});
      // }, 5000);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    try {
      console.log('Sending password reset request...');
      const response = await axios.post(`${config.BASE_URL}users/forget-password`, { email });
      console.log(response.data);
      setForgotPassword(false);
      setErrors({ success: 'Password reset email sent successfully' });
    } catch (error) {
      setErrors({ forgotPassword: error.response?.data?.message || 'An unknown error occurred' });
      console.error('Forgot Password Error:', error);
    }
  };

  if (isAuth) {
    return (
      <div>
        <h2>You are already logged in</h2>
      </div>
    );
  }

  return (
    <div className={`login-container ${isLogin ? 'login-active' : 'signup-active'}`}>
      <img src="/images/Banner1.png" alt="Banner" className="banner-image" />
      <div className="login-toggle">
        <button className={`toggle-button ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>Login</button>
        <button className={`toggle-button ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>Signup</button>
      </div>
      <div className="form-container">
        {isLogin ? (
          <>
            <h2>Login</h2>
            <div className="email-login">
              <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
              {errors.email && <p className="error">{errors.email}</p>}
              <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
              {errors.password && <p className="error">{errors.password}</p>}
              <button onClick={handleLogin}>Login</button>
              {errors.login && <p className="error">{errors.login}</p>}
              <p>
                <a href="#" onClick={() => setForgotPassword(true)}>Forgot Password?</a>
              </p>
              {forgotPassword && (
                <div>
                  <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
                  <button onClick={handleForgotPassword}>Send Reset Link</button>
                  {errors.forgotPassword && <p className="error">{errors.forgotPassword}</p>}
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h2>Signup</h2>
            <div className="email-login">
              <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
              {errors.email && <p className="error">{errors.email}</p>}
              <input type="text" placeholder="Name" value={name} onChange={handleNameChange} />
              {errors.name && <p className="error">{errors.name}</p>}
              <input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
              {errors.password && <p className="error">{errors.password}</p>}
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              <button onClick={handleSignup}>Signup</button>
              {errors.signup && <p className="error">{errors.signup}</p>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;