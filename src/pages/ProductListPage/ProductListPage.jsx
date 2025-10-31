// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';

// import { fetchProducts } from '../../api/fetchProducts';
// import { setLoading } from '../../store/features/common';

// import FilterIcon from '../../components/common/FilterIcon';
// import Categories from '../../components/Filters/Categories';
// import PriceFilter from '../../components/Filters/PriceFilter';
// import ColorsFilter from '../../components/Filters/ColorsFilter';
// import SizeFilter from '../../components/Filters/SizeFilter';
// import ProductCard from './ProductCard';
// import Spinner from '../../components/Spinner/Spinner';

// const ProductListPage = () => {
//   const { id } = useParams();
//   const dispatch = useDispatch();
//   const categoryData = useSelector((state) => state?.categoryState?.categories);

//   const [products, setProducts] = useState([]);
//   const [localLoading, setLocalLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   const category = categoryData?.find((cat) => cat?.id === id);

//   useEffect(() => {
//     if (!id || !categoryData?.length || !category?.id) {
//       setLocalLoading(true);
//       setProducts([]);
//       setError(null);
//       return;
//     }

//     const fetchProductsForCategory = async () => {
//       dispatch(setLoading(true));
//       setLocalLoading(true);
//       setError(null);

//       try {
//         const data = await fetchProducts({ categoryId: category.id });
//         setProducts(data);
//       } catch (err) {
//         console.error('Failed to fetch products:', err);
//         setError("Failed to load products for this category. Please try again.");
//         setProducts([]);
//       } finally {
//         dispatch(setLoading(false));
//         setLocalLoading(false);
//       }
//     };

//     fetchProductsForCategory();
//   }, [id, categoryData, dispatch, category?.id]);

//   // Loading state
//   if (localLoading) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen text-center">
//         <Spinner />
//         <p className="mt-4 text-gray-500 dark:text-gray-400">Loading products...</p>
//       </div>
//     );
//   }

//   // Error state
//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen text-center text-red-500">
//         <p className="text-lg font-semibold">{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
//         >
//           Retry
//         </button>
//       </div>
//     );
//   }

//   // Empty state
//   if (products.length === 0) {
//     return (
//       <div className="flex flex-col justify-center items-center h-screen text-center text-gray-500 dark:text-gray-400">
//         <p className="text-lg font-semibold">No products found for "{category?.name}".</p>
//         <button
//           onClick={() => window.history.back()}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900">
//       {/* Filter Toggle Button for mobile */}
//       <button
//         onClick={() => setIsFilterOpen(!isFilterOpen)}
//         className="lg:hidden fixed bottom-6 right-6 z-50 p-4 rounded-full bg-blue-600 text-white shadow-lg focus:outline-none hover:bg-blue-700 transition"
//         aria-label="Toggle Filters"
//       >
//         <FilterIcon className="w-6 h-6" />
//       </button>

//       {/* Main Content */}
//       <div className="flex flex-col lg:flex-row p-4 lg:p-8">
//         {/* Filters Sidebar */}
//         <aside
//           className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 p-6 z-40 transform transition-transform duration-300 ease-in-out lg:static lg:w-1/4 lg:max-w-xs lg:translate-x-0 ${
//             isFilterOpen ? 'translate-x-0' : '-translate-x-full'
//           }`}
//         >
//           <div className="flex justify-between items-center mb-6 lg:hidden">
//             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Filters</h2>
//             <button
//               onClick={() => setIsFilterOpen(false)}
//               className="text-gray-600 dark:text-gray-400 text-2xl font-bold"
//               aria-label="Close Filters"
//             >
//               &times;
//             </button>
//           </div>

//           <div className="space-y-6">
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Categories</h3>
//               <Categories types={category?.categoryTypes ?? []} />
//             </div>
//             <hr className="border-gray-200 dark:border-gray-700" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Price</h3>
//               <PriceFilter />
//             </div>
//             <hr className="border-gray-200 dark:border-gray-700" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Colors</h3>
//               <ColorsFilter colors={category?.meta_data?.colors ?? []} />
//             </div>
//             <hr className="border-gray-200 dark:border-gray-700" />
//             <div>
//               <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Sizes</h3>
//               <SizeFilter sizes={category?.meta_data?.sizes ?? []} />
//             </div>
//           </div>
//         </aside>

//         {/* Products Grid */}
//         <main className="flex-1 lg:ml-8">
//           <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-gray-100">{category?.name}</h1>
//           <p className="text-gray-500 dark:text-gray-400 mb-6">{category?.description}</p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
//             {products.map((item) => (
//               <ProductCard key={item?.slug} product={item} />
//             ))}
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default ProductListPage;

// src/pages/ProductListing.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchProducts, getProductCount } from "../../api/fetchProducts";
import ProductCard from "../../pages/ProductListPage/ProductCard";
import FilterComponent from "../../components/Filters/FilterComponent/";
import { FiFilter, FiX, FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import Spinner from "../../components/Spinner/Spinner";

const ProductListing = ({ 
  categoryId, 
  categoryName, 
  showFilters = true,
  pageSize = 12,
  enablePagination = true,
  onBack 
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
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
        const data = await fetchProducts({ 
          categoryId: categoryId || undefined,
          page: pagination.page,
          size: pagination.size,
          search: filters.search || undefined
        });

        // Get total count for pagination
        const count = await getProductCount({ 
          categoryId: categoryId || undefined,
          search: filters.search || undefined
        });

        // Handle response format
        const productsData = data?.products || data || [];
        const totalItems = data?.totalItems || count || productsData.length;
        const totalPages = data?.totalPages || Math.ceil(totalItems / pagination.size);

        setProducts(productsData);
        setPagination(prev => ({
          ...prev,
          totalItems,
          totalPages
        }));

        // Update URL params
        updateURLParams();

      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again.");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [categoryId, pagination.page, pagination.size, filters.search]);

  // Update URL parameters
  const updateURLParams = () => {
    const newParams = new URLSearchParams();
    
    if (categoryId) newParams.set('category', categoryId);
    if (filters.search) newParams.set('search', filters.search);
    if (pagination.page > 0) newParams.set('page', pagination.page);
    if (pagination.size !== pageSize) newParams.set('size', pagination.size);
    if (filters.minPrice !== null) newParams.set('minPrice', filters.minPrice);
    if (filters.maxPrice !== null) newParams.set('maxPrice', filters.maxPrice);
    if (filters.conditions.length > 0) newParams.set('conditions', filters.conditions.join(','));
    if (filters.colors.length > 0) newParams.set('colors', filters.colors.join(','));
    if (filters.brands.length > 0) newParams.set('brands', filters.brands.join(','));
    if (filters.newArrival) newParams.set('newArrival', 'true');
    
    setSearchParams(newParams);
  };

  // Apply client-side filtering for other filters
  const filteredProducts = useMemo(() => {
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
    setPagination(prev => ({ ...prev, page: 0 })); // Reset to first page on filter change
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
      <div className="flex flex-col lg:flex-row gap-6 p-4  ">
        {/* Filters Sidebar - Desktop */}
        {showFilters && (
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                {/* <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Filters</h2> */}
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
                {onBack && (
                  <button 
                    onClick={onBack}
                    className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 mr-4"
                  >
                    <FiChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </button>
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {products.categoryName || "All Products"}
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {pagination.totalItems} products found
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                    Search: {filters.search}
                    <button onClick={() => handleSearch('')} className="ml-2">×</button>
                  </span>
                )}
                {filters.minPrice !== null && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                    Min: Ksh {filters.minPrice}
                    <button onClick={() => handleFilterChange({...filters, minPrice: null})} className="ml-2">×</button>
                  </span>
                )}
                {filters.conditions.map(condition => (
                  <span key={condition} className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                    {condition}
                    <button onClick={() => handleFilterChange({...filters, conditions: filters.conditions.filter(c => c !== condition)})} className="ml-2">×</button>
                  </span>
                ))}
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
              <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                {products.length === 0 ? 'No products found.' : 'No products match your filters.'}
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                    className="border border-gray-300 rounded px-3 py-1 dark:bg-gray-700 dark:border-gray-600"
                  >
                    <option value={12}>12 per page</option>
                    <option value={24}>24 per page</option>
                    <option value={48}>48 per page</option>
                    <option value={96}>96 per page</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
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
                    className="flex items-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="mr-2" />
                    Previous
                  </button>
                  
                  <span className="text-gray-600">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="flex items-center px-4 py-2 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <h2 className="text-xl font-semibold">Filters</h2>
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
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
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