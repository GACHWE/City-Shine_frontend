// src/pages/ProductListing/ProductListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { fetchProducts, getProductCount } from "../../api/fetchProducts";
import ProductCard from "./ProductCard";
import FilterComponent from "../../components/Filters/FilterComponent/";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import Spinner from "../../components/Spinner/Spinner";

const ProductListing = ({ 
  showFilters = true,
  pageSize = 12,
  enablePagination = true
}) => {
  const { id } = useParams(); // Get category ID from URL
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    page: parseInt(searchParams.get('page')) || 0,
    size: parseInt(searchParams.get('size')) || pageSize,
    totalItems: 0,
    totalPages: 0
  });

  // Filters state
  const [filters, setFilters] = useState({
    minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')) : null,
    maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')) : null,
    conditions: searchParams.get('conditions') ? searchParams.get('conditions').split(',') : [],
    colors: searchParams.get('colors') ? searchParams.get('colors').split(',') : [],
    newArrival: searchParams.get('newArrival') === 'true',
    brands: searchParams.get('brands') ? searchParams.get('brands').split(',') : [],
    search: searchParams.get('search') || ''
  });

  // Fetch products with pagination and filters
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log("🔄 Fetching products for category:", id);
        const response = await fetchProducts({ 
          categoryId: id || undefined,
          page: pagination.page,
          size: pagination.size,
          search: filters.search || undefined
        });

        console.log("📦 API Response:", response);

        // Get total count for pagination
        const count = await getProductCount({ 
          categoryId: id || undefined,
          search: filters.search || undefined
        });

        // Handle response format
        const productsData = response?.products || response || [];
        const totalItems = response?.totalItems || count || productsData.length;
        const totalPages = response?.totalPages || Math.ceil(totalItems / pagination.size);

        setProducts(productsData);
        setPagination(prev => ({
          ...prev,
          totalItems,
          totalPages
        }));

        // Update URL params
        updateURLParams();

      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [id, pagination.page, pagination.size, filters.search]);

  // Update URL parameters
  const updateURLParams = () => {
    const newParams = new URLSearchParams();
    
    if (id) newParams.set('category', id);
    if (filters.search) newParams.set('search', filters.search);
    if (pagination.page > 0) newParams.set('page', pagination.page.toString());
    if (pagination.size !== pageSize) newParams.set('size', pagination.size.toString());
    if (filters.minPrice !== null) newParams.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice !== null) newParams.set('maxPrice', filters.maxPrice.toString());
    if (filters.conditions.length > 0) newParams.set('conditions', filters.conditions.join(','));
    if (filters.colors.length > 0) newParams.set('colors', filters.colors.join(','));
    if (filters.brands.length > 0) newParams.set('brands', filters.brands.join(','));
    if (filters.newArrival) newParams.set('newArrival', 'true');
    
    setSearchParams(newParams);
  };

  // Apply client-side filtering for other filters
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    
    return products.filter((product) => {
      // Price filter
      if (filters.minPrice !== null && product.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

      // Condition filter
      if (filters.conditions.length > 0) {
        const conditionMatch = product.productVariants?.some((variant) =>
          filters.conditions.includes(variant.conditionStatus)
        );
        if (!conditionMatch) return false;
      }

      // Color filter
      if (filters.colors.length > 0) {
        const colorMatch = product.productVariants?.some((variant) =>
          filters.colors.includes(variant.color)
        );
        if (!colorMatch) return false;
      }

      // New arrival filter
      if (filters.newArrival && !product.newArrival) return false;

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

      return true;
    });
  }, [products, filters]);

  // Filter change handler
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setPagination(prev => ({ ...prev, page: newPage }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (query) => {
    setFilters(prev => ({ ...prev, search: query }));
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      conditions: [],
      colors: [],
      newArrival: false,
      brands: [],
      search: ''
    });
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const refreshProducts = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 text-center">
        <Spinner />
        <p className="mt-4 text-gray-500 dark:text-gray-400">Loading products...</p>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 text-center p-4">
        <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
        <button
          onClick={refreshProducts}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== null && value !== '' && value !== false
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-7xl mx-auto">
        {/* Filters Sidebar - Desktop */}
        {showFilters && (
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>
              
              <FilterComponent
                products={products}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
              
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredProducts.length} of {products.length} products match your filters
                </p>
              </div>
            </div>
          </aside>
        )}

        {/* Main Content */}
        <main className={`flex-1 ${showFilters ? 'lg:ml-0' : ''}`}>
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <button 
                  onClick={handleBack}
                  className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-4"
                >
                  <FiChevronLeft className="w-4 h-4 mr-1" />
                  Back
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {products.categoryName }
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {pagination.totalItems} products found
                    {id && ` in this category`}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Mobile filter button */}
                {showFilters && (
                  <button
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiFilter className="w-4 h-4" />
                    <span>Filters</span>
                  </button>
                )}

                {/* Refresh button */}
                <button
                  onClick={refreshProducts}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                  title="Refresh products"
                >
                  <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            {/* Active filters */}
            {hasActiveFilters && (
              <div className="mt-4 flex flex-wrap gap-2">
                {filters.search && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Search: {filters.search}
                    <button 
                      onClick={() => handleSearch('')} 
                      className="ml-2 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.minPrice !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Min: Ksh {filters.minPrice}
                    <button 
                      onClick={() => handleFilterChange({...filters, minPrice: null})} 
                      className="ml-2 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.maxPrice !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Max: Ksh {filters.maxPrice}
                    <button 
                      onClick={() => handleFilterChange({...filters, maxPrice: null})} 
                      className="ml-2 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.conditions.map(condition => (
                  <span key={condition} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {condition}
                    <button 
                      onClick={() => handleFilterChange({
                        ...filters, 
                        conditions: filters.conditions.filter(c => c !== condition)
                      })} 
                      className="ml-2 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.colors.map(color => (
                  <span key={color} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                    {color}
                    <button 
                      onClick={() => handleFilterChange({
                        ...filters, 
                        colors: filters.colors.filter(c => c !== color)
                      })} 
                      className="ml-2 hover:text-orange-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {filters.newArrival && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200">
                    New Arrivals
                    <button 
                      onClick={() => handleFilterChange({...filters, newArrival: false})} 
                      className="ml-2 hover:text-pink-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
                  >
                    Clear all
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Products Grid */}
          {!filteredProducts || filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {!products || products.length === 0 ? 'No products found.' : 'No products match your filters.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="mb-6 flex justify-between items-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Showing {filteredProducts.length} of {products.length} products
                </p>
                
                {/* Page size selector */}
                {enablePagination && (
                  <select 
                    value={pagination.size}
                    onChange={(e) => setPagination(prev => ({ ...prev, size: parseInt(e.target.value), page: 0 }))}
                    className="border border-gray-300 dark:border-gray-600 rounded px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                    <option value={96}>96 per page</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {enablePagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <FiChevronLeft className="mr-2" />
                    Previous
                  </button>
                  
                  <span className="text-gray-600 dark:text-gray-400">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Next
                    <FiChevronRight className="ml-2" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        {/* Mobile Filter Drawer */}
        {showFilters && isFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsFilterOpen(false)}
            />
            <aside className="fixed top-0 left-0 h-full w-80 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2>
                  <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                      <button
                        onClick={clearAllFilters}
                        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Clear all
                      </button>
                    )}
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                    >
                      <FiX className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                <FilterComponent
                  products={products}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
                
                <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View {filteredProducts.length} Products
                  </button>
                </div>
              </div>
            </aside>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductListing;