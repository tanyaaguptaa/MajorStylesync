import React, { useState, useEffect } from 'react';
import './Admin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import Header from './Header.jsx';
import Footer from './Footer';
import { useAlert } from '../Contexts/AlertContext';

const config = require('../Config/Constant');

const Admin = () => {
    const [productName, setProductName] = useState('');
    const [productDescription, setProductDescription] = useState('');
    const [productPrice, setProductPrice] = useState('');
    const [productCategory, setProductCategory] = useState('');
    const [productImage, setProductImage] = useState('');
    const [productInStock, setProductInStock] = useState(false);
    const [productStockCount, setProductStockCount] = useState(0);
    const [categories, setCategories] = useState([]);
    const { showAlert } = useAlert();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}category/fetchCategories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories');
                    showAlert("Failed to fetch categories", "error");
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                showAlert("Failed to fetch categories", "error");
            }
        };

        fetchCategories();
    }, []);

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result.split(',')[1];
                setProductImage(base64String);
            };
            reader.readAsDataURL(file);
        }
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };

    const handleAddProduct = async () => {
        try {
            const response = await fetch(`${config.BASE_URL}products/addProduct`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    name: productName,
                    description: productDescription,
                    price: productPrice,
                    category: productCategory,
                    image: productImage,
                    inStock: productInStock,
                    stockCount: productStockCount
                })
            });
            if (response.ok) {
                showAlert("Product added successfully", "success");
                // Reset form fields
                setProductName('');
                setProductDescription('');
                setProductPrice('');
                setProductCategory('');
                setProductImage('');
                setProductInStock(false);
                setProductStockCount(0);
            } else {
                const data = await response.json();
                showAlert(data.message || "Failed to add product", "error");
            }
        } catch (error) {
            console.error('Error adding product:', error);
            showAlert("An error occurred while adding the product", "error");
        }
    };

    return (
        <>
            <Header />
            <div className="admin-container">
                <div className="crud-column">
                    <label>Product Name</label>
                    <input type="text" placeholder="Product Name" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    
                    <label>Product Description</label>
                    <input type="text" placeholder="Product Description" value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
                    
                    <label>Product Price</label>
                    <input type="number" placeholder="Product Price" value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                    
                    <label>Product Category</label>
                    <select value={productCategory} onChange={(e) => setProductCategory(e.target.value)}>
                        <option value="" disabled>Select Category</option>
                        {categories.map((category, index) => (
                            <option key={index} value={category.categoryName}>{category.categoryName}</option>
                        ))}
                    </select>
                    
                    <label>Product Image</label>
                    <input type="file" onChange={handleImageUpload} />
                    
                    <div className="stock-checkbox">
                        <label htmlFor="instock">In Stock:</label>
                        <input type="checkbox" id="instock" checked={productInStock} onChange={(e) => setProductInStock(e.target.checked)} />
                    </div>
                    
                    <label>Stock Count</label>
                    <input type="number" placeholder="Stock Count" value={productStockCount} onChange={(e) => setProductStockCount(e.target.value)} />
                    
                    <button onClick={handleAddProduct}><FontAwesomeIcon icon={faPlus} /> Add Product</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Admin;