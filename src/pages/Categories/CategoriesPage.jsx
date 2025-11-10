// import React, { useEffect, useState } from "react";
// import { getAllCategories } from "../../api/fetchCategories";
// import { fetchProducts } from "../../api/fetchProducts";
// import { Link } from "react-router-dom";
// import ProductCard from "../ProductListPage/ProductCard";
// import Carousel from "../../components/common/Carousel";
// import FilterComponent from "../../components/Filters/FilterComponent";
// import { FiFilter, FiX } from "react-icons/fi";
// import Spinner from "../../components/Spinner/Spinner";

// export default function CategoriesPage() {
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [allProducts, setAllProducts] = useState([]);
//   const [filters, setFilters] = useState({
//     minPrice: null,
//     maxPrice: null,
//     conditions: [],
//     colors: [],
//     newArrival: false,
//     brands: [],
//   });

//   // Fetch categories and all products on mount
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       setError(null);
//       try {
//         const [cats, productsData] = await Promise.all([
//           getAllCategories(),
//           fetchProducts({ size: 100 }), // Limit to 100 for performance
//         ]);

//         // Filter out products with 0 stock
//         const products = productsData?.products || productsData || [];
//         const availableProducts = products.filter((product) => {
//           if (product.variants && product.variants.length > 0) {
//             return product.variants.some(
//               (variant) => variant.stockQuantity > 0
//             );
//           }
//           return true; // If no variants, assume available
//         });

//         setAllProducts(availableProducts);
//         setCategories(cats);
//       } catch (err) {
//         console.error("Error loading data:", err);
//         setError("Failed to load content. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchData();
//   }, []);

//   // Filter products by category and apply filters
//   const getFilteredProductsByCategory = (categoryId) => {
//     const categoryProducts = allProducts.filter(
//       (product) => product.categoryId === categoryId
//     );

//     return categoryProducts.filter((product) => {
//       if (filters.minPrice !== null && product.price < filters.minPrice)
//         return false;
//       if (filters.maxPrice !== null && product.price > filters.maxPrice)
//         return false;

//       if (filters.conditions.length > 0) {
//         const conditionMatch = product.variants?.some((variant) =>
//           filters.conditions.includes(variant.conditionStatus)
//         );
//         if (!conditionMatch) return false;
//       }

//       if (filters.colors.length > 0) {
//         const colorMatch = product.variants?.some((variant) =>
//           filters.colors.includes(variant.color)
//         );
//         if (!colorMatch) return false;
//       }

//       if (filters.newArrival && !product.newArrival) return false;

//       if (filters.brands.length > 0 && !filters.brands.includes(product.brand))
//         return false;

//       return true;
//     });
//   };

//   const clearAllFilters = () => {
//     setFilters({
//       minPrice: null,
//       maxPrice: null,
//       conditions: [],
//       colors: [],
//       newArrival: false,
//       brands: [],
//     });
//   };

//   const hasActiveFilters = Object.values(filters).some((value) =>
//     Array.isArray(value) ? value.length > 0 : value !== null && value !== false
//   );

//   if (loading) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen text-center">
//         <Spinner />
//         <p className="mt-4 text-gray-500 dark:text-gray-400">
//           Loading categories and products...
//         </p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
//         <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
//         <button
//           onClick={() => window.location.reload()}
//           className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!categories.length) {
//     return (
//       <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
//         <p className="text-gray-500 dark:text-gray-400 text-lg">
//           No categories found.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <div className="container px-4 sm:px-6 lg:px-8 py-6">
//         <div className="flex flex-col lg:flex-row gap-6">
//           {/* Filters Sidebar - Desktop */}
//           <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-xl font-semibold">Filters</h2>
//                 {hasActiveFilters && (
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     Clear all
//                   </button>
//                 )}
//               </div>

//               <FilterComponent
//                 products={allProducts}
//                 filters={filters}
//                 onFilterChange={setFilters}
//               />
//             </div>
//           </aside>

//           {/* Main Content */}
//           <main className="flex-1 min-w-0">
//             {/* Mobile filter button */}
//             <div className="lg:hidden mb-6">
//               <button
//                 onClick={() => setIsFilterOpen(true)}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
//               >
//                 <FiFilter className="w-4 h-4" />
//                 <span>Show Filters</span>
//               </button>
//             </div>

//             <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
//               <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
//                 Browse Categories
//               </h1>
//               <p className="text-gray-600 dark:text-gray-400">
//                 Discover products across all categories
//               </p>

//               {hasActiveFilters && (
//                 <div className="mt-4 flex flex-wrap items-center gap-2">
//                   <span className="text-sm text-gray-500">
//                     Filters applied across all categories
//                   </span>
//                   <button
//                     onClick={clearAllFilters}
//                     className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     Clear all
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className="space-y-8">
//               {categories.map((cat) => {
//                 const filteredProds = getFilteredProductsByCategory(cat.id);
//                 if (filteredProds.length === 0) return null;

//                 return (
//                   <section
//                     key={cat.id}
//                     className="dark:bg-gray-800 rounded-lg shadow-sm p-4"
//                   >
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//                       <div className="flex-1">
//                         <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
//                           {cat.name}
//                         </h2>
//                         {cat.description && (
//                           <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
//                             {cat.description}
//                           </p>
//                         )}
//                       </div>
//                       <Link
//                         to={`/products/${cat.id}`}
//                         className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium whitespace-nowrap"
//                       >
//                         View all {filteredProds.length} products
//                         <svg
//                           className="w-4 h-4 ml-1"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M9 5l7 7-7 7"
//                           />
//                         </svg>
//                       </Link>
//                     </div>
//                     <div className="flex flex-col gap-1">
//                       {filteredProds.length > 0 ? (
//                         <Carousel
//                           items={filteredProds}
//                           renderItem={(product) => (
//                             <div
//                               key={product.id}
//                               className="grid grid-cols-2 justify-between w-80"
//                             >
//                               <ProductCard product={product} className="" />
//                             </div>
//                           )}
//                           className="mt-2"
//                         />
//                       ) : (
//                         <p className="text-gray-500 dark:text-gray-400 text-center py-8">
//                           No products match your filters in this category.
//                         </p>
//                       )}
//                     </div>
//                   </section>
//                 );
//               })}

//               {/* Show message if all categories are filtered out */}
//               {categories.every(
//                 (cat) => getFilteredProductsByCategory(cat.id).length === 0
//               ) && (
//                 <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
//                   <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
//                     No products match your filters across all categories.
//                   </p>
//                   <button
//                     onClick={clearAllFilters}
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Clear Filters
//                   </button>
//                 </div>
//               )}
//             </div>
//           </main>

//           {/* Mobile Filter Drawer */}
//           {isFilterOpen && (
//             <>
//               <div
//                 className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//                 onClick={() => setIsFilterOpen(false)}
//               />
//               <aside className="fixed top-0 left-0 h-full w-full sm:w-80 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto">
//                 <div className="p-4 sm:p-6">
//                   <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-semibold">Filters</h2>
//                     <div className="flex items-center gap-3">
//                       {hasActiveFilters && (
//                         <button
//                           onClick={clearAllFilters}
//                           className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                         >
//                           Clear all
//                         </button>
//                       )}
//                       <button
//                         onClick={() => setIsFilterOpen(false)}
//                         className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
//                       >
//                         <FiX className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </div>

//                   <FilterComponent
//                     products={allProducts}
//                     filters={filters}
//                     onFilterChange={setFilters}
//                   />

//                   <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
//                     <button
//                       onClick={() => setIsFilterOpen(false)}
//                       className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                     >
//                       Apply Filters
//                     </button>
//                   </div>
//                 </div>
//               </aside>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../api/fetchCategories";
import { fetchProducts } from "../../api/fetchProducts";
import { Link } from "react-router-dom";
import ProductCard from "../ProductListPage/ProductCard";
import Carousel from "../../components/common/Carousel";
import FilterComponent from "../../components/Filters/FilterComponent";
import { FiFilter, FiX } from "react-icons/fi";
import Spinner from "../../components/Spinner/Spinner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [filters, setFilters] = useState({
    minPrice: null,
    maxPrice: null,
    conditions: [],
    colors: [],
    newArrival: false,
    brands: [],
  });

  // Fetch categories and all products on mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cats, productsData] = await Promise.all([
          getAllCategories(),
          fetchProducts({ size: 100 }) // Limit to 100 for performance
        ]);
        
        // Filter out products with 0 stock
        const products = productsData?.products || productsData || [];
        const availableProducts = products.filter(product => {
          if (product.variants && product.variants.length > 0) {
            return product.variants.some(variant => variant.stockQuantity > 0);
          }
          return true; // If no variants, assume available
        });
        
        setAllProducts(availableProducts);
        setCategories(cats);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load content. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter products by category and apply filters
  const getFilteredProductsByCategory = (categoryId) => {
    const categoryProducts = allProducts.filter(product => product.categoryId === categoryId);
    
    return categoryProducts.filter((product) => {
      if (filters.minPrice !== null && product.price < filters.minPrice) return false;
      if (filters.maxPrice !== null && product.price > filters.maxPrice) return false;

      if (filters.conditions.length > 0) {
        const conditionMatch = product.variants?.some((variant) =>
          filters.conditions.includes(variant.conditionStatus)
        );
        if (!conditionMatch) return false;
      }

      if (filters.colors.length > 0) {
        const colorMatch = product.variants?.some((variant) =>
          filters.colors.includes(variant.color)
        );
        if (!colorMatch) return false;
      }

      if (filters.newArrival && !product.newArrival) return false;

      if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) return false;

      return true;
    });
  };

  const clearAllFilters = () => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      conditions: [],
      colors: [],
      newArrival: false,
      brands: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(value => 
    Array.isArray(value) ? value.length > 0 : value !== null && value !== false
  );

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <Spinner />
        <p className="mt-4 text-gray-500 dark:text-gray-400">
          Loading categories and products...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!categories.length) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center p-4">
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No categories found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block w-72 shrink-0 sticky top-20 h-[calc(100vh-5rem)] overflow-y-auto">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Filters</h2>
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
                products={allProducts}
                filters={filters}
                onFilterChange={setFilters}
                showHeader={false}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Mobile filter button */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto justify-center"
              >
                <FiFilter className="w-4 h-4" />
                <span>Show Filters</span>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Browse Categories
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Discover products across all categories
              </p>
              
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Filters applied across all categories
                  </span>
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear all
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {categories.map((cat) => {
                const filteredProds = getFilteredProductsByCategory(cat.id);
                if (filteredProds.length === 0) return null;

                return (
                  <section
                    key={cat.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                          {cat.name}
                        </h2>
                        {cat.description && (
                          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">
                            {cat.description}
                          </p>
                        )}
                      </div>
                      <Link
                        to={`/products/${cat.id}`}
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium whitespace-nowrap"
                      >
                        View all {filteredProds.length} products
                        <svg
                          className="w-4 h-4 ml-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>

                    {filteredProds.length > 0 ? (
                      // Use Carousel with consistent product card sizing
                      <Carousel
                        items={filteredProds}
                        renderItem={(product) => (
                          <div key={product.id} className="px-2">
                            {/* Same ProductCard wrapper as ProductListing for consistent sizing */}
                      <div className="w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] mx-auto">
                              <ProductCard product={product} />
                            </div>
                          </div>
                        )}
                        config={{
                          mobile: { slidesToShow: 2 },
                          tablet: { slidesToShow: 3 },
                          desktop: { slidesToShow: 4 },
                          largeDesktop: { slidesToShow: 5 }
                        }}
                        className="mt-2"
                      />
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        No products match your filters in this category.
                      </p>
                    )}
                  </section>
                );
              })}

              {/* Show message if all categories are filtered out */}
              {categories.every(cat => getFilteredProductsByCategory(cat.id).length === 0) && (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
                    No products match your filters across all categories.
                  </p>
                  <button
                    onClick={clearAllFilters}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </main>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsFilterOpen(false)}
              />
              <aside className="fixed top-0 left-0 h-full w-full sm:w-80 bg-white dark:bg-gray-800 shadow-xl z-50 lg:hidden overflow-y-auto">
                <div className="p-4 sm:p-6 h-full">
                  <FilterComponent
                    products={allProducts}
                    filters={filters}
                    onFilterChange={setFilters}
                    isMobile={true}
                    onClose={() => setIsFilterOpen(false)}
                    showHeader={true}
                  />
                </div>
              </aside>
            </>
          )}
        </div>
      </div>
    </div>
  );
}