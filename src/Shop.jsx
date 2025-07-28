// import React, { useEffect } from 'react';
// import HeroSection from './components/HeroSection/HeroSection';
// import NewArrivals from './components/Sections/NewArrivals';
// import Category from './components/Sections/Categories/Category';
// import content from './data/content.json';
// import Footer from './components/Footer/Footer';
// import { getAllCategories } from './api/fetchCategories'; // <- Fixed import
// import { useDispatch } from 'react-redux';
// import { loadCategories } from './store/features/category';
// import { setLoading } from './store/features/common';

// const Shop = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(setLoading(true));
//     getAllCategories()
//       .then(res => {
//         dispatch(loadCategories(res));
//       })
//       .catch(err => {
//         console.error('Failed to fetch categories:', err);
//       })
//       .finally(() => {
//         dispatch(setLoading(false));
//       });
//   }, [dispatch]);

//   return (
//     <>
//       <HeroSection />
//       <NewArrivals />
//       {content?.pages?.shop?.sections?.map((item, index) => (
//         <Category key={item?.title + index} {...item} />
//       ))}
//       <Footer content={content?.footer} />
//     </>
//   );
// };

// export default Shop;

import React, { useEffect } from 'react';
import HeroSection from './components/HeroSection/HeroSection';
import NewArrivals from './components/Sections/NewArrivals';
import Category from './components/Sections/Categories/Category';
import content from './data/content.json'; // Assuming this path is correct
import Footer from './components/Footer/Footer';
import { getAllCategories } from './api/fetchCategories';
import { useDispatch } from 'react-redux';
import { loadCategories } from './store/features/category';
import { setLoading } from './store/features/common';

const Shop = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    getAllCategories()
      .then(res => {
        dispatch(loadCategories(res));
      })
      .catch(err => {
        console.error('Failed to fetch categories:', err);
      })
      .finally(() => {
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  // Debugging: Log the sections data before mapping
  // This will help you see if any 'item' is missing a 'title'
  console.log("Content sections for Shop page:", content?.pages?.shop?.sections);

  return (
    <>
      <HeroSection />
      <NewArrivals />
      {/* Body Section: Mapping over content sections */}
      {content?.pages?.shop?.sections?.map((item, index) => {
        // Debugging: Log the item and its title being used for the key
        // Check your browser's console for output like "Category item title:", "Key generated:"
        console.log(`Category item at index ${index}:`, item);
        console.log(`Key generated for Category: ${item?.title + index}`);

        // The key should ideally be a unique, stable ID from your data.
        // If 'item' has a unique 'id' or 'uuid' property from your backend, use that instead.
        // For example: <Category key={item.id} {...item} />
        // If 'title' is guaranteed to be unique and always present, it could be used alone:
        // <Category key={item.title} {...item} />
        // If 'title' can be missing, ensure a fallback or fix your data:
        return (
          <Category key={item?.title || `category-${index}`} {...item} />
          // The above uses a fallback key if item.title is undefined/null
        );
      })}
      <Footer content={content?.footer} />
    </>
  );
};

export default Shop;
