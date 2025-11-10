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

        // Fetch limited products for each category (6 products per category for home page)
        const productFetches = activeCategories.map(async (category) => {
          try {
            const productsData = await fetchProducts({ 
              categoryId: category.id, 
              size: 12 // Fetch more to account for out-of-stock filtering
            });
            
            // Handle both response formats and filter out products with 0 stock
            const products = productsData?.products || productsData || [];
            
            // Filter out products where all variants have 0 stock
            const availableProducts = products.filter(product => {
              // If product has variants, check if any variant has stock > 0
              if (product.variants && product.variants.length > 0) {
                return product.variants.some(variant => variant.stockQuantity > 0);
              }
              // If no variants, check product-level stock or assume available
              // You might need to adjust this based on your actual data structure
              return true;
            }).slice(0, 6); // Limit to 6 available products per category

            return { [category.id]: availableProducts };
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
      <div className="min-h-screen bg-[#f7f6f0] dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center p-6">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 pt-2">
        <Banner />
      </div>

      {/* New Arrivals */}
      <div className="container dark:bg-slate-800 mx-auto">
        <NewArrivals />
      </div>

      {/* Categories */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 md:py-8 lg:mt-12 space-y-8 md:space-y-10 lg:space-y-12">
        {loadingProducts ? (
          <div className="text-center p-8 md:p-12">
            <Spinner />
            <p className="mt-4 text-gray-500 dark:text-gray-400">Loading products...</p>
          </div>
        ) : (
          categories.map((category) => {
            const categoryProducts = productsByCategory[category.id] || [];
            
            // Skip categories with no available products
            if (categoryProducts.length === 0) {
              return null;
            }

            return (
              <section 
                key={category.id} 
                aria-labelledby={`category-${category.id}`} 
                className="space-y-4 md:space-y-6 bg-white dark:bg-slate-800 p-4 md:p-5 lg:p-6 rounded-lg md:rounded-xl"
              >
                <div className="flex flex-col b xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-0">
                  <h2
                    id={`category-${category.id}`}
                    className="text-xl sm:text-2xl lg:text-2xl xl:text-3xl font-bold text-gray-800 dark:text-white break-words"
                  >
                    {category.name}
                  </h2>
                  
                  <Link
                    to={`/products/${category.id}`}
                    className="text-blue-500 dark:text-blue-400 hover:underline font-semibold text-sm sm:text-base mt-1 xs:mt-0 whitespace-nowrap"
                    aria-label={`View more products in ${category.name}`}
                  >
                    View All ({categoryProducts.length})
                  </Link>
                </div>

                <Carousel
                  items={categoryProducts}
                  renderItem={(product) => (
                    <div key={product.id} className="flex-shrink-0 px-1 sm:px-2">
                      <div className="w-full max-w-[180px] xs:max-w-[200px] sm:max-w-[200px] md:max-w-[240px] lg:max-w-[260px] xl:max-w-[280px] mx-auto">
                        <ProductCard product={product} />
                      </div>
                    </div>
                  )}
                  config={{
                    mobile: { slidesToShow: 2 },
                    tablet: { slidesToShow: 3 },
                    desktop: { slidesToShow: 4 },
                    largeDesktop: { slidesToShow: 6 }
                  }}
                />
              </section>
            );
          })
        )}

        {/* Show message if no categories have products */}
        {!loadingProducts && categories.length > 0 && 
         categories.every(cat => (productsByCategory[cat.id] || []).length === 0) && (
          <div className="text-center py-8 md:py-12">
            <p className="text-gray-500 dark:text-gray-400 text-base md:text-lg">
              No products available in any category at the moment.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Shop;