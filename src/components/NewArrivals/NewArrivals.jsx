// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_BASE_URL } from "../../api/constant";
// import ProductCard from "../../pages/ProductListPage/ProductCard";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const NewArrivals = () => {
//   const [newArrivals, setNewArrivals] = useState([]);
//   const [loading, setLoading] = useState(true);
  
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 600,
//     slidesToShow: 5, // Default for largest screens (2xl and above)
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     arrows: true,
//     responsive: [
//       {
//         breakpoint: 640, // sm breakpoint
//         settings: {
//           slidesToShow: 1, // Show 1 on very small screens
//           slidesToScroll: 1,
//           arrows: true,
//         }
//       }, 
//       {
//         breakpoint: 768, // md breakpoint
//         settings: {
//           slidesToShow: 2,
//           slidesToScroll: 1,
//           arrows: true,
//         }
//       },
//       {
//         breakpoint: 1024, // lg breakpoint
//         settings: {
//           slidesToShow: 3,
//           slidesToScroll: 1,
//           arrows: true,
//         }
//       },
//       {
//         breakpoint: 1280, // xl breakpoint
//         settings: {
//           slidesToShow: 4,
//           slidesToScroll: 1,
//           arrows: true,
//         }
//       }
//       // Removed the 2500px breakpoint - default handles larger screens
//     ]
//   };

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/products`);
//         const filtered = response.data.products.filter((product) => product.newArrival === true);
//         setNewArrivals(filtered);
//       } catch (error) {
//         console.error("Error fetching new arrivals:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProducts();
//   }, []);

//   if (loading) return (
//     <div className="text-center py-8 md:py-12 text-gray-500 dark:text-gray-400 text-sm md:text-base">
//       Loading new arrivals...
//     </div>
//   );
  
//   if (newArrivals.length === 0) return (
//     <div className="text-center py-8 md:py-12 text-gray-400 dark:text-gray-500 text-sm md:text-base">
//       No new arrivals at the moment.
//     </div>
//   );

//   return (
//     <section className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 transition-colors duration-300 mx-auto">
//       <div className="container mx-auto">
//         <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-gray-900 dark:text-gray-100 px-2">
//           New Arrivals
//         </h2>
//         <div className="slider-container">
//           <Slider {...settings}>
//             {newArrivals.map((product) => (
//               <div key={product._id || product.id} className="px-1 sm:px-2"> 
//                 <div className="flex justify-center">
//                   <div className="w-full max-w-[160px] xs:max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px]">
//                     <ProductCard product={product} />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </Slider>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default NewArrivals;

import React, { useEffect, useState, useLayoutEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api/constant";
import ProductCard from "../../pages/ProductListPage/ProductCard";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(2);

  // Detect screen size on mount and resize
  useLayoutEffect(() => {
    const updateSlidesToShow = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setSlidesToShow(2);
      } else if (width < 768) {
        setSlidesToShow(3);
      } else if (width < 1024) {
        setSlidesToShow(3);
      } else if (width < 1280) {
        setSlidesToShow(3);
      } else if (width < 1536) {
        setSlidesToShow(4);
      } else {
        setSlidesToShow(5);
      }
    };

    // Set initial value
    updateSlidesToShow();

    // Add event listener
    window.addEventListener('resize', updateSlidesToShow);

    // Cleanup
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          arrows: true,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          arrows: true,
        }
      },
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          arrows: true,
        }
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          arrows: true,
        }
      }
    ]
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const filtered = response.data.products.filter((product) => product.newArrival === true);
        setNewArrivals(filtered);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return (
    <div className="text-center py-8 md:py-12 text-gray-500 dark:text-gray-400 text-sm md:text-base">
      Loading new arrivals...
    </div>
  );
  
  if (newArrivals.length === 0) return (
    <div className="text-center py-8 md:py-12 text-gray-400 dark:text-gray-500 text-sm md:text-base">
      No new arrivals at the moment.
    </div>
  );

  return (
    <section className="w-full px-3 xs:px-4 sm:px-6 lg:px-8 py-6 md:py-8 lg:py-10 transition-colors duration-300 mx-auto">
      <div className="container mx-auto">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 md:mb-6 text-gray-900 dark:text-gray-100 px-2">
          New Arrivals
        </h2>
        <div className="slider-container">
          <Slider {...settings}>
            {newArrivals.map((product) => (
              <div key={product._id || product.id} className="px-1 sm:px-2"> 
                <div className="flex justify-center">
                  <div className="w-full max-w-[160px] xs:max-w-[180px] sm:max-w-[200px] md:max-w-[220px] lg:max-w-[240px] xl:max-w-[260px]">
                    <ProductCard product={product} />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;