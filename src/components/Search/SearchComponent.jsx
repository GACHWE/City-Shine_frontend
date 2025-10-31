// components/Search/SearchComponent.js
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdSearch, IoMdClose } from "react-icons/io";
import { fetchProducts, getProductCount } from "../../api/fetchProducts";

const SearchComponent = ({
  onProductSelect,
  placeholder = "Search products...",
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const searchRef = useRef(null);

  // Responsive placeholder text
  // const responsivePlaceholder = "Search"; // Simple text for all screens
  // OR for more control:
  const responsivePlaceholder =
    window.innerWidth < 640 ? "Search" : placeholder;

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false);
        setQuery("");
        setResults([]);
        setHasSearched(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Search products using your actual API
  const searchProducts = useCallback(async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    try {
      setIsLoading(true);
      setHasSearched(true);

      // Use your actual API search endpoint
      const searchResults = await fetchProducts({
        search: searchQuery,
        page: 0,
        size: 10, // Limit results for search dropdown
      });

      // Handle different response structures
      const products =
        searchResults?.products || searchResults?.search || searchResults || [];
      setResults(Array.isArray(products) ? products : []);
    } catch (error) {
      console.error("Error searching products:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchProducts(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, searchProducts]);

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setHasSearched(false);
    }
  };

  const handleResultClick = (product) => {
    // If custom onProductSelect callback is provided, use it
    if (onProductSelect) {
      onProductSelect(product);
    } else {
      // Otherwise, navigate to product details page using slug
      if (product.slug) {
        navigate(`/product/${product.slug}`);
      } else {
        console.warn("Product slug not available:", product);
        // Fallback: navigate using product ID if slug is not available
        navigate(`/product/${product.id}`);
      }
    }

    // Close search and reset state
    setIsOpen(false);
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setHasSearched(false);
  };

  return (
    <div className="relative" ref={searchRef}>
      {/* Search toggle button */}
      <div className="flex items-center w-full max-w-lg relative ">
        <button
          onClick={handleSearchToggle}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label="Search"
        >
          <input
            type="text"
            className="w-full md:w-96 px-4 py-2 rounded-full border text-center border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-800 focus:outline-none 
                           focus:border-blue-600 focus:ring-1 focus:ring-blue-600
                           text-gray-900 dark:text-gray-200
                           placeholder:text-sm sm:placeholder:text-base"
            placeholder={responsivePlaceholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />{" "}
          <div className="absolute inset-y-0 left-0 p-3 flex items-center pointer-events-none">
            <IoMdSearch className="h-4 w-4 text-gray-400" />
          </div>
        </button>
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md p-1"
          >
            <IoMdClose className="h-4 w-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" />
          </button>
        )}
      </div>

      {/* Search dropdown */}
      {isOpen && (
        <div className="absolute  right-0 mt-2 w-64 lg:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl z-50 border border-gray-200 dark:border-gray-700">
          {/* Search results */}
          <div className="max-h-80 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                  <p>Searching...</p>
                </div>
              </div>
            ) : results.length > 0 ? (
              <div>
                <div className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700">
                  Found {results.length} product
                  {results.length !== 1 ? "s" : ""}
                </div>
                {results.map((product) => (
                  <div
                    key={product.id}
                    className="p-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                    onClick={() => handleResultClick(product)}
                  >
                    <div className="flex items-center space-x-3">
                      {/* Product thumbnail */}
                      <div className="flex-shrink-0 h-12 w-12 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-600">
                        {product.thumbnail ? (
                          <img
                            src={product.thumbnail}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-300 dark:bg-gray-500">
                            <span className="text-xs text-gray-500">
                              No image
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {product.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Ksh{product.price}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {product.brand && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-600 px-2 py-1 rounded">
                              {product.brand}
                            </span>
                          )}
                          {product.categoryName && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              • {product.categoryName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : hasSearched && query.length >= 2 ? (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <IoMdSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No products found for "{query}"</p>
                <p className="text-xs mt-1">Try different keywords</p>
              </div>
            ) : query && query.length < 2 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">Type at least 2 characters to search</p>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                <IoMdSearch className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  Search for products by name, brand, or category
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchComponent;
