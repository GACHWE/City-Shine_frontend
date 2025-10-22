import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Banner from "./components/Banner/Banner";
import ProductCard from "./pages/ProductListPage/ProductCard";
import { loadCategories } from "./store/features/category";
import { setLoading } from "./store/features/common";
import { getAllCategories } from "./api/fetchCategories";
import { fetchProducts } from "./api/fetchProducts";
import NewArrivals from "./components/NewArrivals/NewArrivals";
import Carousel from "./components/common/Carousel";
import Spinner from "./components/Spinner/Spinner";

const Shop = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.categoryState.categories);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShopData = async () => {
      dispatch(setLoading(true));
      setLoadingProducts(true);
      setError(null);

      try {
        let activeCategories = categories;

        if (activeCategories.length === 0) {
          const fetchedCategories = await getAllCategories();
          dispatch(loadCategories(fetchedCategories));
          activeCategories = fetchedCategories;
        }

        // Fetch limited products for each category (4 products per category for home page)
        const productFetches = activeCategories.map(async (category) => {
          try {
            const productsData = await fetchProducts({ 
              categoryId: category.id, 
              size: 6 // Limit to 6 products per category for home page
            });
            
            // Handle both response formats
            const products = productsData?.products || productsData || [];
            return { [category.id]: products.slice(0, 6) }; // Ensure max 6 products
          } catch (err) {
            console.error(`Error loading products for category ${category.name}:`, err);
            return { [category.id]: [] };
          }
        });

        const resolved = await Promise.all(productFetches);
        const productMap = Object.assign({}, ...resolved);
        setProductsByCategory(productMap);
      } catch (error) {
        console.error("Error loading shop data:", error);
        setError("Failed to load shop data. Please try again.");
      } finally {
        dispatch(setLoading(false));
        setLoadingProducts(false);
      }
    };

    fetchShopData();
  }, [dispatch, categories]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f6f0] dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f6f0] dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Banner */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <Banner />
      </div>

      {/* New Arrivals */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <NewArrivals />
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {loadingProducts ? (
          <div className="text-center p-12">
            <Spinner />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryProducts = productsByCategory[category.id] || [];
            
            if (categoryProducts.length === 0) {
              return null; // Skip categories with no products
            }

            return (
              <section 
                key={category.id} 
                aria-labelledby={`category-${category.id}`} 
                className="space-y-6"
              >
                <div className="flex justify-between items-center">
                  <h2
                    id={`category-${category.id}`}
                    className="text-2xl font-bold text-gray-800 dark:text-white"
                  >
                    {category.name}
                  </h2>
                  
                  <Link
                    to={`/products/:categoryId`}
                    className="text-blue-500 dark:text-blue-400 hover:underline font-semibold text-sm"
                    aria-label={`View more products in ${category.name}`}
                  >
                    View All ({categoryProducts.length})
                  </Link>
                </div>

                {categoryProducts.length > 0 ? (
                  <>
                    <Carousel
                      items={categoryProducts}
                      renderItem={(product) => (
                        <div key={product.id} className="flex-shrink-0  px-2 grid-cols-2 md:grid-cols-4 lg:grid-cols-6 lg:gap-10">
                          <ProductCard product={product} />
                        </div>
                      )}
                    />
                    
                    <div className="text-center lg:hidden">
                     
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No products available in this category.
                  </p>
                )}
              </section>
            );
          })
        )}

        {/* Show message if no categories have products */}
        {!loadingProducts && categories.length > 0 && 
         categories.every(cat => (productsByCategory[cat.id] || []).length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No products available in any category at the moment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;