import React from 'react';
import { useLocation } from 'react-router-dom';
import ProductList from './ProductList';

const SearchResults = () => {
  const location = useLocation();
  const { products } = location.state || { products: [] };

  return (
    <>
      <div className="search-results-container">
        <ProductList products={products} />
      </div>
    </>
  );
};

export default SearchResults;
