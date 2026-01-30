// // import "slick-carousel/slick/slick.css";
// // import "slick-carousel/slick/slick-theme.css";
// // import Slider from "react-slick";
// // import { motion as Motion } from "framer-motion";

// // import bannerImg1 from "../../../dist/assets/adobe-bNTliY0y.avif";
// // import bannerImg2 from "../../../dist/assets/mixer-BqtnALs6.avif";
// // import bannerImg3 from "../../../dist/assets/kettle-DfoBRati.avif";

// // const Banner = () => {
// //   const products = [
// //     {
// //       id: 1,
// //       title: "Best Fridge collection for your kitchen",
// //       subTitle: "Welcome to CityShine",
// //       image: bannerImg1,
// //       layout: "left-text",
// //       bg: "bg-gradient-to-b from-blue-200 via-white to-blue-400 dark:bg-gradient-to-b dark:from-blue-300 dark:via-white/90 dark:to-blue-700",
// //     },
// //     {
// //       id: 2,
// //       title: "Luxury mixers for modern kitchens",
// //       subTitle: "Crafted with comfort and luxury",
// //       image: bannerImg2,
// //       layout: "left-text",
// //       bg: "bg-gradient-to-b from-yellow-100 dark:via-white to-yellow-300 dark:bg-gradient-to-b dark:from-yellow-300 via-white/90 dark:to-yellow-600",
// //     },
// //     {
// //       id: 3,
// //       title: "Elegant kettles for your kitchen",
// //       subTitle: "Luxury redefined",
// //       image: bannerImg3,
// //       layout: "right-text",
// //       bg: "bg-gradient-to-b from-purple-400 via-white to-purple-300 dark:bg-gradient-to-b dark:from-purple-800 dark:via-white/90 dark:to-purple-500",
// //     },
// //   ];

// //   const settings = {
// //     dots: true,
// //     infinite: true,
// //     speed: 1000,
// //     slidesToShow: 1,
// //     slidesToScroll: 1,
// //     autoplay: true,
// //     autoplaySpeed: 5000,
// //     arrows: false,
// //   };

// //   const renderSlide = (data) => {
// //     switch (data.layout) {
// //       case "left-text":
// //         return (
// //           <div className={`grid grid-cols-2 ${data.bg} rounded-3xl`}>
// //             {/* Text left */}
// //             <Motion.div
// //                initial={{ opacity: 0, scale: 0 }}
// //            whileInView={{ opacity: 1, scale: 1 }}
// //            viewport={{ once: false }}
// //            transition={{
// //                type: "spring",
// //                stiffness: 50,
// //                damping: 20,
// //                delay: 0.4}}
// //               className="flex flex-col justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-6 sm:py-12 text-center sm:text-left order-2 sm:order-1"
// //             >
// //               <Motion.h2   initial={{ opacity: 0, scale: 0 }}
// //            whileInView={{ opacity: 1, scale: 1 }}
// //            viewport={{ once: false }}
// //            transition={{
// //                type: "spring",
// //                stiffness: 50,
// //                damping: 20,
// //                delay: 0.4}} className="text-lg  font-semibold text-gray-700">
// //                 {data.subTitle}
// //               </Motion.h2>
// //               <Motion.h1   initial={{ opacity: 0, scale: 0 }}
// //            whileInView={{ opacity: 1, scale: 1 }}
// //            viewport={{ once: false }}
// //            transition={{
// //                type: "spring",
// //                stiffness: 50,
// //                damping: 20,
// //                delay: 0.4}} className="text-2xl  font-bold text-blue-900">
// //                 {data.title}
// //               </Motion.h1>
// //             </Motion.div>

// //             {/* Image right */}
// //             <Motion.div
// //               initial={{ opacity: 0, scale: 0 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: false }}
// //               transition={{
// //                 type: "spring",
// //                 stiffness: 50,
// //                 damping: 20,
// //                 delay: 0.4,
// //               }}
// //               className="flex justify-center items-center order-1 sm:order-2 py-4 sm:py-0"
// //             >
// //               <img
// //                 src={data.image}
// //                 alt={data.title}
// //                 className="w-[180px] sm:w-[400px] object-contain drop-shadow-xl"
// //               />
// //             </Motion.div>
// //           </div>
// //         );

// //       case "centered":
// //         return (
// //           <div
// //             className={`${data.bg} flex flex-col justify-center items-center text-center rounded-3xl py-8 sm:py-12`}
// //           >
// //             <img
// //               src={data.image}
// //               alt={data.title}
// //               className="w-[150px] sm:w-[400px] object-contain drop-shadow-lg mb-4 sm:mb-6"
// //             />
// //             <Motion.h2
// //               initial={{ opacity: 0, scale: 0 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: false }}
// //               transition={{
// //                 type: "spring",
// //                 stiffness: 50,
// //                 damping: 20,
// //                 delay: 0.4,
// //               }}
// //               className="text-base sm:text-2xl text-gray-600"
// //             >
// //               {data.subTitle}
// //             </Motion.h2>
// //             <Motion.h1
// //               initial={{ opacity: 0, scale: 0 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: false }}
// //               transition={{
// //                 type: "spring",
// //                 stiffness: 50,
// //                 damping: 20,
// //                 delay: 0.4,
// //               }}
// //               className="text-2xl sm:text-5xl font-bold text-yellow-800"
// //             >
// //               {data.title}
// //             </Motion.h1>
// //           </div>
// //         );

// //       case "right-text":
// //         return (
// //           <div className={`grid grid-cols-2 ${data.bg} rounded-3xl`}>
// //             {/* Image left */}
// //             <Motion.div
// //               initial={{ opacity: 0, scale: 0 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: false }}
// //               transition={{
// //                 type: "spring",
// //                 stiffness: 50,
// //                 damping: 20,
// //                 delay: 0.4,
// //               }}
// //               className="flex justify-center items-center order-1 sm:order-1 py-4 sm:py-0"
// //             >
// //               <img
// //                 src={data.image}
// //                 alt={data.title}
// //                 className="w-[180px] sm:w-[400px] object-contain drop-shadow-xl"
// //               />
// //             </Motion.div>

// //             {/* Text right */}
// //             <Motion.div
// //               initial={{ opacity: 0, scale: 0 }}
// //               whileInView={{ opacity: 1, scale: 1 }}
// //               viewport={{ once: false }}
// //               transition={{
// //                 type: "spring",
// //                 stiffness: 50,
// //                 damping: 20,
// //                 delay: 0.4,
// //               }}
// //               className="flex flex-col justify-center gap-2 sm:gap-4 px-4 sm:px-6 py-3 text-center sm:text-right order-2 sm:order-2"
// //             >
// //               <Motion.h2
// //                 initial={{ opacity: 0, scale: 0 }}
// //                 whileInView={{ opacity: 1, scale: 1 }}
// //                 viewport={{ once: false }}
// //                 transition={{
// //                   type: "spring",
// //                   stiffness: 50,
// //                   damping: 20,
// //                   delay: 0.4,
// //                 }}
// //                 className="text-lg  font-semibold text-gray-500"
// //               >
// //                 {data.subTitle}
// //               </Motion.h2>
// //               <Motion.h1
// //                 initial={{ opacity: 0, scale: 0 }}
// //                 whileInView={{ opacity: 1, scale: 1 }}
// //                 viewport={{ once: false }}
// //                 transition={{
// //                   type: "spring",
// //                   stiffness: 50,
// //                   damping: 20,
// //                   delay: 0.4,
// //                 }}
// //                 className="text-2xl font-bold text-purple-900 dark:text-purple-500"
// //               >
// //                 {data.title}
// //               </Motion.h1>
// //             </Motion.div>
// //           </div>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="container ">
// //       <div className="overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[500px] flex justify-center items-center relative z-10">
// //         <div className="w-full">
// //           <Slider {...settings}>
// //             {products.map((data) => (
// //               <div key={data.id}>{renderSlide(data)}</div>
// //             ))}
// //           </Slider>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default Banner;

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import Slider from "react-slick";
// import { motion } from "framer-motion";
// import { ArrowRight, ChevronRight } from "lucide-react";

// import bannerImg1 from "../../../dist/assets/adobe-bNTliY0y.avif";
// import bannerImg2 from "../../../dist/assets/mixer-BqtnALs6.avif";
// import bannerImg3 from "../../../dist/assets/kettle-DfoBRati.avif";

// const Banner = () => {
//   const products = [
//     {
//       id: 1,
//       title: "Smart Fridge Collection",
//       subTitle: "New Arrivals",
//       description: "Experience intelligent cooling technology with our premium fridge lineup",
//       image: bannerImg1,
//       layout: "left-text",
//       buttonText: "Shop Now",
//       badge: "Featured",
//       color: "blue",
//     },
//     {
//       id: 2,
//       title: "Premium Mixers",
//       subTitle: "Modern Kitchen",
//       description: "Professional-grade mixers for culinary perfection",
//       image: bannerImg2,
//       layout: "right-text",
//       buttonText: "Explore",
//       badge: "Sale -30%",
//       color: "amber",
//     },
//     {
//       id: 3,
//       title: "Elegant Kettles",
//       subTitle: "Luxury Collection",
//       description: "Sleek design meets rapid boiling technology",
//       image: bannerImg3,
//       layout: "left-text",
//       buttonText: "Discover",
//       badge: "New",
//       color: "purple",
//     },
//   ];

//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 800,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 5000,
//     arrows: false,
//     fade: true,
//     dotsClass: "slick-dots !bottom-6",
//   };

//   const colorClasses = {
//     blue: {
//       bg: "bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800",
//       text: "text-blue-600 dark:text-blue-400",
//       button: "bg-blue-600 hover:bg-blue-700 text-white",
//       badge: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
//     },
//     amber: {
//       bg: "bg-gradient-to-br from-amber-50 to-white dark:from-gray-900 dark:to-gray-800",
//       text: "text-amber-600 dark:text-amber-400",
//       button: "bg-amber-600 hover:bg-amber-700 text-white",
//       badge: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
//     },
//     purple: {
//       bg: "bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800",
//       text: "text-purple-600 dark:text-purple-400",
//       button: "bg-purple-600 hover:bg-purple-700 text-white",
//       badge: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
//     },
//   };

//   const renderSlide = (data) => {
//     const colors = colorClasses[data.color];

//     return (
//       <div className={`relative overflow-hidden rounded-2xl ${colors.bg} h-full`}>
//         {/* Background decorative elements */}
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-r from-white/20 to-transparent dark:from-gray-800/20" />
//           <div className="absolute -left-12 -bottom-12 h-48 w-48 rounded-full bg-gradient-to-l from-white/20 to-transparent dark:from-gray-800/20" />
//         </div>

//         <div className="container mx-auto h-full px-4">
//           <div className="grid h-full items-center gap-8 md:grid-cols-2">
//             {/* Text Content */}
//             <motion.div
//               initial={{ opacity: 0, x: -50 }}
//               animate={{ opacity: 1, x: 0 }}
//               transition={{ duration: 0.6, delay: 0.2 }}
//               className={`py-12 md:py-0 ${data.layout === "right-text" ? "md:order-2 md:pl-12" : "md:pr-12"}`}
//             >
//               {/* Badge */}
//               {data.badge && (
//                 <motion.span
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className={`mb-4 inline-block rounded-full px-4 py-1.5 text-sm font-medium ${colors.badge}`}
//                 >
//                   {data.badge}
//                 </motion.span>
//               )}

//               {/* Subtitle */}
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.1 }}
//                 className={`mb-2 text-sm font-semibold uppercase tracking-wider ${colors.text}`}
//               >
//                 {data.subTitle}
//               </motion.p>

//               {/* Main Title */}
//               <motion.h1
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.2 }}
//                 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl lg:text-5xl"
//               >
//                 {data.title}
//               </motion.h1>

//               {/* Description */}
//               <motion.p
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.3 }}
//                 className="mb-8 text-gray-600 dark:text-gray-300 md:text-lg"
//               >
//                 {data.description}
//               </motion.p>

//               {/* CTA Button */}
//               <motion.button
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5, delay: 0.4 }}
//                 className={`group flex items-center gap-2 rounded-lg px-6 py-3 font-semibold transition-all duration-300 ${colors.button}`}
//               >
//                 {data.buttonText}
//                 <ChevronRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
//               </motion.button>

//               {/* Additional Info */}
//               <motion.p
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.5, delay: 0.6 }}
//                 className="mt-8 text-sm text-gray-500 dark:text-gray-400"
//               >
//                 Free shipping on orders over $100
//               </motion.p>
//             </motion.div>

//             {/* Product Image */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.9 }}
//               animate={{ opacity: 1, scale: 1 }}
//               transition={{ duration: 0.8, delay: 0.3 }}
//               className={`relative ${data.layout === "right-text" ? "md:order-1" : ""}`}
//             >
//               <div className="relative mx-auto max-w-md">
//                 {/* Floating elements around product */}
//                 <div className="absolute -left-4 -top-4 h-24 w-24 rounded-2xl bg-gradient-to-br from-white/80 to-transparent backdrop-blur-sm dark:from-gray-800/80" />
//                 <div className="absolute -bottom-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-tr from-white/80 to-transparent backdrop-blur-sm dark:from-gray-800/80" />

//                 {/* Product Image */}
//                 <div className="relative z-10">
//                   <img
//                     src={data.image}
//                     alt={data.title}
//                     className="w-full object-contain drop-shadow-2xl"
//                   />

//                   {/* Floating price tag */}
//                   <div className="absolute -right-4 top-1/2 -translate-y-1/2">
//                     <div className="rounded-lg bg-white/90 p-3 shadow-xl backdrop-blur-sm dark:bg-gray-800/90">
//                       <div className="text-center">
//                         <div className="text-xs text-gray-500">Starting at</div>
//                         <div className="text-xl font-bold text-gray-900 dark:text-white">$299</div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto px-4 py-6">
//       <div className="relative">
//         <div className="h-[500px] md:h-[600px]">
//           <Slider {...settings}>
//             {products.map((data) => (
//               <div key={data.id} className="h-full px-2">
//                 {renderSlide(data)}
//               </div>
//             ))}
//           </Slider>
//         </div>

//         {/* Custom dots styling - Add this to your global CSS or as a style tag */}
//         <style jsx>{`
//           :global(.slick-dots li button:before) {
//             font-size: 10px;
//             color: #9ca3af;
//           }
//           :global(.slick-dots li.slick-active button:before) {
//             color: #3b82f6;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default Banner;

// components/Home/FeaturedProductsBanner.jsx
// components/Home/FeaturedProductsBanner.jsx
import React, { useState, useEffect, useRef } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiShoppingBag,
} from "react-icons/fi";
import { motion } from "framer-motion";
import ProductPrice from "../layouts/ProductPrice";
import CountdownTimer from "../layouts/CountdownTimer";
import { API_BASE_URL } from "../../api/constant";
import axios from "axios";

const NextArrow = ({ onClick }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className="absolute right-3 top-1/2 -translate-y-1/2 z-20
               bg-white/85 dark:bg-gray-800/85 backdrop-blur-md
               rounded-full p-2.5 shadow-lg border border-gray-200/60 dark:border-gray-700/60
               md:p-3 md:right-5"
    aria-label="Next slide"
  >
    <FiChevronRight className="text-gray-800 dark:text-white text-xl md:text-2xl" />
  </motion.button>
);

const PrevArrow = ({ onClick }) => (
  <motion.button
    whileTap={{ scale: 0.92 }}
    onClick={onClick}
    className="absolute left-3 top-1/2 -translate-y-1/2 z-20
               bg-white/85 dark:bg-gray-800/85 backdrop-blur-md
               rounded-full p-2.5 shadow-lg border border-gray-200/60 dark:border-gray-700/60
               md:p-3 md:left-5"
    aria-label="Previous slide"
  >
    <FiChevronLeft className="text-gray-800 dark:text-white text-xl md:text-2xl" />
  </motion.button>
);

const FeaturedProductsBanner = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const products = response.data.products || response.data || [];
        const activeFeatured = products.filter(
          (p) =>
            p.featured &&
            (!p.featuredUntil || new Date(p.featuredUntil) > new Date()),
        );
        setFeaturedProducts(activeFeatured.slice(0, 8));
      } catch (err) {
        console.error("Failed to load featured products", err);
      } finally {
        setLoading(false);
      }
    };
    loadFeaturedProducts();
  }, []);

  const settings = {
    dots: true,
    infinite: featuredProducts.length > 1,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: featuredProducts.length > 1,
    autoplaySpeed: 5500,
    arrows: true,
    fade: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    dotsClass: "slick-dots !bottom-4 sm:!bottom-6",
    beforeChange: (_, newIndex) => setCurrentSlide(newIndex),
    responsive: [
      {
        breakpoint: 1024,
        settings: { arrows: false },
      },
      {
        breakpoint: 640,
        settings: { fade: false }, // smoother on very small screens
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-[380px] sm:min-h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading featured items...
          </p>
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <div className="relative ">
      <div className="container  px-0 lg:px-6 py-3 ">
        <Slider {...settings} ref={sliderRef}>
          {featuredProducts.map((product) => {
            const isDiscount = product.originalPrice > product.price;
            const primaryImg =
              product.productResources?.find((r) => r.isPrimary)?.url ||
              product.productResources?.[0]?.url ||
              "https://via.placeholder.com/600";

            return (
              <div key={product.id} className=" ">
                <div className="bg-gradient-to-br from-blue-300 to-indigo-300 rounded-2xl sm:rounded-3xl shadow-xl border border-gray-200/40 dark:border-gray-700/40 ">
                  <div className="grid grid-cols-2 gap-0">
                    {/* ─── LEFT ─── Text Content ─── */}
                    <div className="p-5 sm:p-7 lg:py-0 xl:p-11 flex flex-col  order-2 lg:order-1">
                      <div className="flex flex-wrap gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <span className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow flex items-center gap-1.5">
                          <FiStar className="text-xs sm:text-sm" /> FEATURED
                        </span>
                        {isDiscount && (
                          <span className="hidden md:block bg-gradient-to-r from-green-600 to-emerald-700 text-white text-xs sm:text-sm font-bold px-3 py-1.5 rounded-full shadow">
                            SAVE{" "}
                            {Math.round(
                              (1 - product.price / product.originalPrice) * 100,
                            )}
                            %
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2">
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight mb-3 sm:mb-4 line-clamp-3">
                        {product.name}
                      </h3>
                       <div className=" mb-6 sm:mb-8">
                                <div className="flex items-center  gap-2.5 mb-3">
                                  <FiClock className="text-xs sm:text-2xl text-amber-600 dark:text-amber-400" />
                                  <span className="text-xs font-bold text-gray-900 dark:text-white">
                                    Ends soon:
                                  </span>
                                </div>
                                <CountdownTimer
                                  targetDate={product.featuredUntil}
                                  size="small"
                                  showUrgency={true}
                                  showLabels={true}
                                />
                              </div>
                      </div>
                      {product.brand && (
                        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-4 sm:mb-6">
                          by{" "}
                          <span className="font-semibold">{product.brand}</span>
                        </p>
                      )}
                      <div className="mb-5 sm:mb-7 scale-95 sm:scale-100 origin-left text-sm md:text-lg">
                        <ProductPrice
                          price={product.price}
                          originalPrice={product.originalPrice}
                          // size="large"
                          showYouSave={true}
                        />
                      </div>
                      {/* {product.featuredUntil && (
                        <div className="hidden md:block mb-6 sm:mb-8">
                          <div className="flex items-center gap-2.5 mb-3">
                            <FiClock className="text-xl sm:text-2xl text-amber-600 dark:text-amber-400" />
                            <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                              Ends soon:
                            </span>
                          </div>
                          <CountdownTimer
                            targetDate={product.featuredUntil}
                            size="small" // ← assume you have small variant
                            showUrgency={true}
                            showLabels={true}
                          />
                        </div>
                      )} */}
                      <div className="hidden md:block  flex-col xs:flex-row gap-3 sm:gap-4 mt-2">
                        <Link
                          to={`/product/${product.slug}`}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm sm:text-base py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                        >
                          <FiShoppingBag className="text-base sm:text-lg" />
                          Shop Now
                          <FiChevronRight className="group-hover:translate-x-1.5 transition-transform" />
                        </Link>
                      </div>
                    </div>

                    {/* ─── RIGHT ─── Image Area ─── */}
                    <div className="relative order-1 lg:order-2 flex items-center justify-center p-6 sm:p-8 lg:p-6 ">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="relative w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={primaryImg}
                          alt={product.name}
                          className="max-w-full max-h-[85%] sm:max-h-[80%] lg:max-h-[75%] object-contain drop-shadow-2xl transition-transform duration-500 hover:scale-[1.03]"
                          loading="lazy"
                        />

                  

                        <div className="md:hidden absolute bottom-4 left-2 ">
                          <Link
                            to={`/product/${product.slug}`}
                            className=" bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-sm sm:text-base py-3 px-5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 "
                          >
                            <FiShoppingBag className="text-base sm:text-xs" />
                            Shop Now
                            <FiChevronRight className="" />
                          </Link>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
};

export default FeaturedProductsBanner;
