import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Categories.css';

const config = require('../Config/Constant');

const Categories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${config.BASE_URL}category/fetchCategories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                } else {
                    console.error('Failed to fetch categories');
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <>
            <h1>Shop By Categories</h1>
            <section className="categories">
                {categories.map((category, index) => (
                    <div className="category" key={index}>
                        <Link to={`/category/${category.categoryName}`}>
                            <img 
                                src={`data:image/jpeg;base64,${category.image}`} 
                                alt={category.categoryName} 
                                onError={(e) => {
                                    e.target.onerror = null; 
                                    e.target.src = '/images/placeholder.png'; // Fallback image
                                }} 
                            />
                            <h3>{category.categoryName}</h3>
                        </Link>
                    </div>
                ))}
            </section>
        </>
    );
};

export default Categories;