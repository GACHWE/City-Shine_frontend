import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import NewArrivals from './components/Sections/NewArrivals';
import Category from './components/Sections/Categories/Category';
import Footer from './components/Footer/Footer'; 

import { getAllCategories } from './api/fetchCategories';

import { useDispatch, useSelector } from 'react-redux';
import { loadCategories } from './store/features/category';
import { setLoading } from './store/features/common';

const Shop = () => {
  const dispatch = useDispatch();

  // Get categories from the Redux store
const categoriesFromRedux = useSelector(state => state.categoryState.categories);
  
  useEffect(() => {
    dispatch(setLoading(true)); // Set loading before API call

    // Fetch Categories
    getAllCategories()
      .then(res => {
        dispatch(loadCategories(res)); // Load fetched categories into Redux
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
        // TODO: Implement user-facing error message here
      })
      .finally(() => {
        dispatch(setLoading(false)); // Hide loading indicator
      });

   
  }, [dispatch]); // Effect runs once on component mount

  // Debugging: Log the categories from Redux store to confirm backend data
  console.log("Categories from Redux store (backend data):", categoriesFromRedux);

  return (
    <>
      <HeroSection />
      <NewArrivals />

      {/* Render categories fetched from the backend (from Redux store) */}
      {categoriesFromRedux?.map((categoryItem) => {
        // Log individual category item to verify structure from backend
        console.log("Rendering backend category item:", categoryItem);

        return (
          <Category
            // Use the actual 'id' from your backend category for the key
            key={categoryItem.id}
            id={categoryItem.id}
            name={categoryItem.name}
            code={categoryItem.code}
            description={categoryItem.description}
            thumbnail={categoryItem.thumbnail}
            banner={categoryItem.banner}
            // Pass 'categoryTypes' (plural) as per backend DTO
            categoryType={categoryItem.categoryTypes}
          />
        );
      })}

      {/* Footer component. 
          If its content was previously from content.json, you need to:
          1. Hardcode it directly within the Footer component if it's always static.
          2. Fetch it from the backend via an API call and pass it as a prop (recommended for dynamic content).
          For now, this assumes Footer can render without the 'content' prop or gets it from elsewhere.
      */}
      <Footer /* If footer content is dynamic, pass it here, e.g., content={footerContent} */ />
    </>
  );
};

export default Shop;