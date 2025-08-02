

// import React, { useEffect, useMemo, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux';
// import axios from 'axios'; 
// import { API_BASE_URL, API_URLS } from '../../api/constant'; 

// import FilterIcon from '../../components/common/FilterIcon';
// import Categories from '../../components/Filters/Categories';
// import PriceFilter from '../../components/Filters/PriceFilter';
// import ColorsFilter from '../../components/Filters/ColorsFilter';
// import SizeFilter from '../../components/Filters/SizeFilter';
// import ProductCard from './ProductCard'; 
// import Spinner from '../../components/Spinner/Spinner'; 
// import { setLoading } from '../../store/features/common'; 

// const ProductListPage = () => {
//   const { categoryType } = useParams(); 
//   const categoryData = useSelector((state) => state?.categoryState?.categories);
//   const commonStateLoading = useSelector((state) => state?.common?.loading); // Get global loading state
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState([]);
//   const [localLoading, setLocalLoading] = useState(true); // Local loading for this component
//   const [error, setError] = useState(null); // State for handling fetch errors

//   const category = useMemo(() => {
//     // Find category based on 'code' from URL params
//     return categoryData?.find((cat) => cat?.code === categoryType);
//   }, [categoryData, categoryType]);

  
//   const fetchProductsByCategory = async (categoryId) => {
//     dispatch(setLoading(true)); 
//     setLocalLoading(true); 
//     setError(null); 
//     try {
     
//       const config = { headers: {} }; 
//       const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}?categoryId=${categoryId}`, config);
//       setProducts(response.data); 

//     } catch (err) {
//       console.error('Failed to fetch products:', err);
//       setError("Failed to load products for this category. Please try again.");
//       setProducts([]); 
//     } finally {
//       dispatch(setLoading(false)); 
//       setLocalLoading(false); 
//     }
//   };

//   useEffect(() => {
//     if (category?.id) {
//       fetchProductsByCategory(category.id);
//     } else if (categoryType && !categoryData?.length) {
     
//     }
//   }, [category?.id, categoryType, categoryData?.length]); // Dependencies for useEffect

//   if (!category && localLoading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <Spinner />
//         <p className="ml-2 text-gray-500">Loading category data...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center h-screen text-red-500">
//         <p>{error}</p>
//       </div>
//     );
//   }

//   if (!localLoading && products.length === 0 && category) {
//     return (
//       <div className="flex justify-center items-center h-screen text-gray-500">
//         <p>No products found for "{category?.name || categoryType}".</p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex pt-4"> {/* Added pt-4 to provide some top padding */}
//       {/* Filters */}
//       <div className="w-[20%] p-[10px] border rounded-lg m-[20px] dark:bg-gray-800 dark:border-gray-700">
//         <div className="flex justify-between items-center mb-4">
//           <p className="text-[16px] text-gray-600 dark:text-gray-300">Filter</p>
//           <FilterIcon />
//         </div>
//         <p className="text-[16px] text-black mt-5 dark:text-gray-100">Categories</p>
//         <Categories types={category?.categoryTypes ?? []} /> {/* Use categoryTypes if that's the prop name */}
//         <hr className="my-4 border-gray-200 dark:border-gray-700" />
//         <PriceFilter />
//         <hr className="my-4 border-gray-200 dark:border-gray-700" />
//         <ColorsFilter colors={category?.meta_data?.colors ?? []} />
//         <hr className="my-4 border-gray-200 dark:border-gray-700" />
//         <SizeFilter sizes={category?.meta_data?.sizes ?? []} />
//       </div>

//       {/* Products */}
//       <div className="flex-1 p-[15px]"> {/* Use flex-1 to make it take remaining space */}
//         <p className="text-black text-lg mb-4 dark:text-gray-100">{category?.description}</p>
        
//         {localLoading ? ( // Show spinner while products are loading
//             <div className="flex justify-center items-center h-full">
//                 <Spinner />
//             </div>
//         ) : (
//             <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2"> {/* Improved responsive grid */}
//                 {products.map((item) => (
//                     <ProductCard
//                         key={item?.id} // Use item.id directly as key, assuming it's unique
//                         product={item} // Pass the entire item (product object) as the 'product' prop
//                     />
//                 ))}
//             </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProductListPage;

// src/pages/ProductListPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import { API_BASE_URL, API_URLS } from '../../api/constant';

import FilterIcon from '../../components/common/FilterIcon';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ColorsFilter from '../../components/Filters/ColorsFilter';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductCard from './ProductCard';
import Spinner from '../../components/Spinner/Spinner';

import { setLoading } from '../../store/features/common';

const ProductListPage = () => {
  const { categoryType } = useParams();
  const dispatch = useDispatch();
  const categoryData = useSelector((state) => state?.categoryState?.categories);

  const [products, setProducts] = useState([]);
  const [localLoading, setLocalLoading] = useState(true);
  const [error, setError] = useState(null);

  const category = categoryData?.find((cat) => cat?.code === categoryType);

  // Fetch products when the category type or category data changes
  useEffect(() => {
    // We assume categoryData is loaded by a parent component.
    // We only proceed if a category exists and its ID is available.
    if (!categoryType || !categoryData?.length || !category?.id) {
        // If a valid category doesn't exist yet, we can show a loading state
        // or a "not found" message, which is handled by our conditional rendering.
        // We will reset states to prepare for new data.
        setLocalLoading(true);
        setProducts([]);
        setError(null);
        return;
    }

    // Create an AbortController to cancel the request if the component unmounts
    // or if a new request is made before the previous one finishes.
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchProductsByCategory = async (categoryId) => {
      console.log("Fetching products for category ID:", categoryId);
      dispatch(setLoading(true)); // Global loading state
      setLocalLoading(true); // Local loading state for this component
      setError(null);

      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_URLS.GET_PRODUCTS}?categoryId=${categoryId}`,
          { signal } // Pass the signal to the axios request
        );
        // Only update state if the request was successful and not aborted
        setProducts(response.data);
      } catch (err) {
        // Check if the error is due to the request being aborted
        if (axios.isCancel(err) || err.name === 'AbortError') {
            console.log('Fetch request aborted:', err.message);
        } else {
            console.error('Failed to fetch products:', err);
            setError("Failed to load products for this category. Please try again.");
            setProducts([]);
        }
      } finally {
        dispatch(setLoading(false));
        setLocalLoading(false);
      }
    };

    fetchProductsByCategory(category.id);

    // Cleanup function: abort the request when the component unmounts
    // or when the dependencies of this useEffect change.
    return () => {
      controller.abort();
    };

  }, [categoryType, categoryData, dispatch, category?.id]);

  // Show message if categoryType doesn't match any actual category
  if (!localLoading && categoryData?.length > 0 && !category) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Category "{categoryType}" not found.</p>
      </div>
    );
  }

  // Show spinner if categories are still loading or local loading is true
  if (localLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
        <p className="ml-2 text-gray-500">Loading products...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  // No products found
  if (products.length === 0 && category) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>No products found for "{category?.name || categoryType}".</p>
      </div>
    );
  }

  return (
    <div className="flex pt-4">
      {/* Filters */}
      <div className="w-[20%] p-[10px] border rounded-lg m-[20px] dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[16px] text-gray-600 dark:text-gray-300">Filter</p>
          <FilterIcon />
        </div>
        <p className="text-[16px] text-black mt-5 dark:text-gray-100">Categories</p>
        <Categories types={category?.categoryTypes ?? []} />
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <PriceFilter />
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <ColorsFilter colors={category?.meta_data?.colors ?? []} />
        <hr className="my-4 border-gray-200 dark:border-gray-700" />
        <SizeFilter sizes={category?.meta_data?.sizes ?? []} />
      </div>

      {/* Products */}
      <div className="flex-1 p-[15px]">
        <p className="text-black text-lg mb-4 dark:text-gray-100">{category?.description}</p>
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 px-2">
          {products.map((item) => (
            <ProductCard key={item?.slug} product={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
