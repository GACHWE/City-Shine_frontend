// components/Search/SearchComponent.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { IoMdSearch, IoMdClose } from 'react-icons/io';
import { fetchProducts } from '../../api/fetchProducts'; // Import your existing API function

const SearchComponent = ({ onProductSelect, placeholder = "Search products..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);

  // Load all products when component mounts
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        // Fetch all products without filters
        const productsData = await fetchProducts({});
        setAllProducts(productsData || []);
      } catch (error) {
        console.error('Error loading products:', error);
        setAllProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadProducts();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery('');
        setResults([]);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Filter products based on search query
  const filterProducts = useCallback((searchQuery) => {
    if (!searchQuery.trim() || allProducts.length === 0) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return allProducts.filter(product =>
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.name?.toLowerCase().includes(query) ||
      product.slug?.toLowerCase().includes(query)
    );
  }, [allProducts]);

  // Update results when query changes
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    // Debounce the filtering
    const timeoutId = setTimeout(() => {
      const filtered = filterProducts(query);
      setResults(filtered);
    }, 150);
    
    return () => clearTimeout(timeoutId);
  }, [query, filterProducts]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    setQuery('');
    setResults([]);
  };

  const handleResultClick = (product) => {
    if (onProductSelect) {
      onProductSelect(product);
    }
    setIsOpen(false);
    setQuery('');
    setResults([]);
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search toggle button */}
      <button
        onClick={handleSearchToggle}
        className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Search"
      >
        <IoMdSearch className="h-5 w-5" />
      </button>

      {/* Search dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
          <div className="p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoMdSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <IoMdClose className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
                </button>
              )}
            </div>
          </div>

          {/* Search results */}
          <div className="max-h-72 overflow-y-auto">
            {isLoading && allProducts.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>Loading products...</p>
              </div>
            ) : results.length > 0 ? (
              results.map((product) => (
                <div
                  key={product.id}
                  className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleResultClick(product)}
                >
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600 mr-3">
                      {product.images && product.images.length > 0 && (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        ${product.price}
                        {product.category && (
                          <span className="ml-2">• {product.category.name}</span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : query && query.length >= 2 && !isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>No products found for "{query}"</p>
              </div>
            ) : query && query.length < 2 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p>Type at least 2 characters to search</p>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;