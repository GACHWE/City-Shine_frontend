import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import ProductPrice from "../../components/layouts/ProductPrice";
import CountdownTimer from "../../components/layouts/CountdownTimer";
import { FiStar, FiClock, FiShoppingCart, FiChevronLeft, FiChevronRight, FiShare2, FiHeart } from "react-icons/fi";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Rating from "../../components/Rating/Rating";
import ProductColors from "./ProductColors";
import ProductCard from "../ProductListPage/ProductCard";

import { fetchProducts } from "../../api/fetchProducts";
import { addItemToCartAction } from "../../store/actions/cartAction";
import Carousel from "../../components/common/Carousel";
import { AiOutlineWhatsApp } from "react-icons/ai";
import { TbTruckDelivery } from "react-icons/tb";
import { IoRepeatOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaLeaf } from "react-icons/fa";

const extraSections = [
  {
    icon: <IoShieldCheckmarkOutline className="text-2xl sm:text-3xl" />,
    label: "Secure Payment",
    description: "Protected payment",
  },
  {
    icon: <FaLeaf className="text-green-500 text-2xl sm:text-3xl" />,
    label: "Eco-Friendly",
    description: "Low power consumption",
  },
  {
    icon: <TbTruckDelivery className="text-violet-600 dark:text-violet-400 text-2xl sm:text-3xl" />,
    label: "Free Delivery",
    description: "On all orders",
  },
  {
    icon: <IoRepeatOutline className="text-gray-700 dark:text-gray-400 text-2xl sm:text-3xl" />,
    label: "30-Day Returns",
    description: "Easy returns",
  },
];

const ProductDetails = () => {
  const { product } = useLoaderData();
  const dispatch = useDispatch();
  const categories = useSelector((state) => state?.categoryState?.categories);

  const [currentDisplayImage, setCurrentDisplayImage] = useState("");
  const [breadCrumbLinks, setBreadCrumbLinks] = useState([]);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [error, setError] = useState("");
  const [loadingSimilar, setLoadingSimilar] = useState(true);
  const [similarError, setSimilarError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobileGalleryExpanded, setIsMobileGalleryExpanded] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const productCategory = useMemo(() => {
    return categories?.find((category) => category?.id === product?.categoryId);
  }, [product, categories]);

  const shopNumber = "254739299636";
  const productUrl = window.location.origin + "/product/" + product.slug;

  const message = `Hello, I'd like more details about ${product.name}. Here's the link: ${productUrl}`;
  const whatsappLink = `https://wa.me/${shopNumber}?text=${encodeURIComponent(message)}`;

  // Similar products fetch function
  useEffect(() => {
    if (!product?.categoryId) return;
    
    setLoadingSimilar(true);
    setSimilarError(null);

    fetchProducts({
      categoryId: product.categoryId,
      typeId: product.categoryTypeId,
    })
      .then((res) => {
        // Handle different response structures
        let productsArray = [];
        
        if (Array.isArray(res?.products)) {
          productsArray = res.products;
        } else if (Array.isArray(res?.data?.products)) {
          productsArray = res.data.products;
        } else if (Array.isArray(res?.data)) {
          productsArray = res.data;
        }
        
        const filtered = productsArray.filter((item) => item?.id !== product?.id);
        setSimilarProducts(filtered.slice(0, 8));
      })
      .catch((err) => {
        console.error("Error fetching similar products:", err);
        setSimilarError("Failed to load similar products.");
      })
      .finally(() => {
        setLoadingSimilar(false);
      });
  }, [product?.categoryId, product?.categoryTypeId, product?.id]);

  useEffect(() => {
    const primaryImage = product?.productResources?.find(
      (res) => res.isPrimary
    )?.url;
    const fallbackImage = product?.productResources?.[0]?.url;
    setCurrentDisplayImage(primaryImage || fallbackImage || "");

    if (product?.productResources?.length) {
      const primaryIndex = product.productResources.findIndex(
        (res) => res.isPrimary
      );
      setCurrentImageIndex(primaryIndex >= 0 ? primaryIndex : 0);
    }

    const links = [{ title: "Shop", path: "/shop" }];
    if (productCategory) {
      links.push({
        title: productCategory.name,
        path: `/category/${productCategory.code}`,
      });
    }

    const productType = productCategory?.categoryTypes?.find(
      (item) => item?.id === product?.categoryTypeId
    );
    if (productType) {
      links.push({
        title: productType.name,
        path: `/category/${productCategory.code}/${productType.code}`,
      });
    }

    links.push({ title: product?.name, path: `/product/${product?.slug}` });
    setBreadCrumbLinks(links);

    if (product?.variants?.length) {
      setSelectedColor(product.variants[0].color);
    }
  }, [productCategory, product]);

  // Sticky sidebar effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsSticky(scrollTop > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const selectedVariant = useMemo(() => {
    if (!product?.variants || !selectedColor) return null;
    return product.variants.find((variant) => variant.color === selectedColor);
  }, [product, selectedColor]);

  const addItemToCart = useCallback(() => {
    setError("");
    if (!selectedVariant) {
      setError("Please select a color.");
      return;
    }

    if (selectedVariant.stockQuantity > 0) {
      const cartThumbnail =
        product?.productResources?.find((res) => res.isPrimary)?.url ||
        product?.productResources?.[0]?.url;

      dispatch(
        addItemToCartAction({
          productId: product.id,
          thumbnail: cartThumbnail,
          name: product.name,
          variantId: selectedVariant.id,
          variantName: `${selectedColor}`,
          quantity: 1,
          subTotal: selectedVariant.price,
          price: product.price,
        })
      );
    } else {
      setError("Selected variant is out of stock.");
    }
  }, [dispatch, product, selectedVariant, selectedColor]);

  useEffect(() => {
    if (selectedColor) setError("");
  }, [selectedColor]);

  const colors = useMemo(
    () => _.uniq(_.map(product?.variants, "color")),
    [product]
  );
  const isAddToCartDisabled =
    !selectedVariant || selectedVariant.stockQuantity <= 0;

  const navigateImage = (direction) => {
    if (!product?.productResources?.length) return;

    const newIndex =
      direction === "next"
        ? (currentImageIndex + 1) % product.productResources.length
        : (currentImageIndex - 1 + product.productResources.length) %
          product.productResources.length;

    setCurrentImageIndex(newIndex);
    setCurrentDisplayImage(product.productResources[newIndex].url);
  };

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] text-gray-500">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="py-3 sm:py-4 border-b border-gray-200 dark:border-gray-800">
          <Breadcrumb links={breadCrumbLinks} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 py-6 md:py-8">
          {/* Image Gallery - Left Column */}
          <div className="lg:col-span-7">
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
              {/* Thumbnails - Vertical on desktop */}
              <div className="hidden lg:flex flex-col gap-3 max-h-[500px] overflow-y-auto pr-2">
                {product?.productResources?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentDisplayImage(item?.url);
                      setCurrentImageIndex(index);
                    }}
                    className={`rounded-lg p-1 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      currentDisplayImage === item?.url
                        ? "border-2 border-blue-500 shadow-lg scale-105"
                        : "border border-gray-200 dark:border-gray-700 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={item?.url}
                      alt={`thumbnail-${index}`}
                      className="h-16 w-16 md:h-20 md:w-20 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Area */}
              <div className="flex-1">
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-xl md:rounded-2xl p-3 md:p-4 lg:p-6">
                  {/* Navigation Arrows */}
                  {product?.productResources?.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage("prev")}
                        className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 rounded-full p-2 md:p-3 shadow-lg z-10 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 lg:hidden"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="text-lg md:text-xl" />
                      </button>
                      <button
                        onClick={() => navigateImage("next")}
                        className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 rounded-full p-2 md:p-3 shadow-lg z-10 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 lg:hidden"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="text-lg md:text-xl" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product?.productResources?.length > 1 && (
                    <div className="absolute top-3 right-3 bg-black/70 text-white text-xs md:text-sm px-2 md:px-3 py-1 rounded-full z-10">
                      {currentImageIndex + 1} /{" "}
                      {product.productResources.length}
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="flex items-center justify-center min-h-[300px] sm:min-h-[350px] md:min-h-[400px] lg:min-h-[450px]">
                    <img
                      src={currentDisplayImage}
                      alt={product?.name}
                      className="max-w-full max-h-[350px] sm:max-h-[400px] md:max-h-[450px] object-contain rounded-lg"
                      loading="eager"
                    />
                  </div>

                  {/* Mobile Gallery Expand Button */}
                  {product?.productResources?.length > 1 && (
                    <button
                      onClick={() => setIsMobileGalleryExpanded(true)}
                      className="mt-3 md:mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center w-full lg:hidden text-sm"
                    >
                      View all images ({product.productResources.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Product Details - Right Column */}
          <div
            className={`lg:col-span-5 ${
              isSticky ? "lg:sticky lg:top-20 lg:self-start" : ""
            }`}
          >
            <div className="space-y-5 md:space-y-6">
              {/* Header Section */}
              <div className="space-y-3 md:space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight pr-3">
                    {product?.name}
                  </h1>
                  <button
                    onClick={shareProduct}
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="Share product"
                  >
                    <FiShare2 className="text-lg md:text-xl" />
                  </button>
                </div>

                {/* Rating and Price Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Rating rating={product?.rating} showCount={true} />
                    {product?.isFeatured &&
                      (!product.featuredUntil ||
                        new Date(product.featuredUntil) > new Date()) && (
                        <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                          <FiStar className="text-xs" />
                          <span>FEATURED</span>
                        </div>
                      )}
                  </div>

                  <div className="text-left sm:text-right">
                    <ProductPrice
                      price={product?.price || 0}
                      originalPrice={product?.originalPrice}
                      size="large"
                    />
                  </div>
                </div>

                {/* Mobile Featured Badge */}
                {product?.isFeatured &&
                  (!product.featuredUntil ||
                    new Date(product.featuredUntil) > new Date()) && (
                    <div className="sm:hidden flex items-center gap-1 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full w-fit">
                      <FiStar className="text-xs" />
                      <span>FEATURED PRODUCT</span>
                    </div>
                  )}
              </div>

              {/* Description */}
              <div className="prose prose-gray dark:prose-invert max-w-none text-sm md:text-base">
                <ul className="text-gray-600 dark:text-gray-300 leading-relaxed space-y-2">
                  {product?.description?.split("\n").map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span>{point.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Countdown Timer */}
              {product?.isFeatured &&
                product?.featuredUntil &&
                new Date(product.featuredUntil) > new Date() && (
                  <div className="p-3 md:p-4 bg-gradient-to-r from-blue-50 to-amber-50 dark:from-blue-900/20 dark:to-amber-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <FiClock className="text-blue-600 dark:text-blue-400 text-lg md:text-xl" />
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm md:text-base">
                            Limited Time Offer
                          </h4>
                          <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                            This featured discount ends soon!
                          </p>
                        </div>
                      </div>

                      {product.originalPrice &&
                        product.originalPrice > product.price && (
                          <div className="bg-red-600 text-white text-xs md:text-sm font-bold px-2 md:px-3 py-1 rounded-full">
                            Save{" "}
                            {Math.round(
                              (1 - product.price / product.originalPrice) * 100
                            )}
                            %
                          </div>
                        )}
                    </div>

                    <CountdownTimer
                      targetDate={product.featuredUntil}
                      size="medium"
                      showUrgency={true}
                    />

                    <div className="mt-3 text-xs md:text-sm text-gray-600 dark:text-gray-400">
                      <p>Don't miss this exclusive offer! Add to cart now before time runs out.</p>
                    </div>
                  </div>
                )}

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 gap-3 md:gap-4 p-3 md:p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-center">
                  <p className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Condition
                  </p>
                  <p className="text-base md:text-lg font-bold text-gray-900 dark:text-white">
                    {selectedVariant?.conditionStatus || "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Availability
                  </p>
                  <p
                    className={`text-base md:text-lg font-bold ${
                      selectedVariant?.stockQuantity > 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {selectedVariant?.stockQuantity > 0
                      ? `${selectedVariant.stockQuantity} in stock`
                      : "Out of stock"}
                  </p>
                </div>
              </div>

              {/* Color Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-base md:text-lg">Select Color</p>
                  {selectedColor && (
                    <p className="text-xs md:text-sm text-gray-500">
                      Selected: <span className="font-medium">{selectedColor}</span>
                    </p>
                  )}
                </div>
                {colors.length > 0 ? (
                  <ProductColors
                    colors={colors}
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                  />
                ) : (
                  <p className="text-sm text-gray-500">No colors available</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={addItemToCart}
                    disabled={isAddToCartDisabled}
                    className={`flex items-center justify-center gap-2 md:gap-3 rounded-xl px-4 md:px-6 py-3 md:py-4 font-semibold text-sm md:text-base transition-all duration-300 shadow-lg flex-1 ${
                      isAddToCartDisabled
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:scale-105 active:scale-95"
                    }`}
                  >
                    <FiShoppingCart className="text-lg md:text-xl" />
                    {isAddToCartDisabled ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 md:gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 md:px-6 py-3 md:py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 active:scale-95 flex-1"
                  >
                    <AiOutlineWhatsApp className="text-xl md:text-2xl" />
                    <span className="text-sm md:text-base">WhatsApp</span>
                  </a>
                </div>

                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {extraSections.map((section, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center text-center space-y-1 p-2"
                    >
                      <div className="text-blue-600 dark:text-blue-400">
                        {section.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{section.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                          {section.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div className="mt-12 md:mt-16 border-t border-gray-200 dark:border-gray-800 pt-8 md:pt-12">
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-2">
              You Might Also Like
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base">
              Discover similar products that match your style
            </p>
          </div>

          {loadingSimilar ? (
            <div className="flex justify-center py-8 md:py-10">
              <div className="flex flex-col items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500">Loading similar products...</p>
              </div>
            </div>
          ) : similarError ? (
            <div className="text-center py-8 md:py-10 text-red-500">
              {similarError}
            </div>
          ) : similarProducts.length > 0 ? (
            <>
              {/* Mobile Grid View */}
              <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-4">
                {similarProducts.slice(0, 6).map((product) => (
                  <div
                    key={product?.id}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
              
              {/* Desktop Carousel View */}
              <div className="hidden lg:block">
                <Carousel
                  items={similarProducts}
                  renderItem={(product) => (
                    <div
                      key={product?.id}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 mx-2 hover:scale-105"
                    >
                      <ProductCard product={product} />
                    </div>
                  )}
                />
              </div>
            </>
          ) : (
            <div className="text-center py-8 md:py-10">
              <div className="max-w-md mx-auto">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-500 dark:text-gray-400">
                  No similar products found. Check back later!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Gallery Modal */}
      {isMobileGalleryExpanded && (
        <div className="fixed inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-4 lg:hidden">
          <div className="absolute top-4 right-4 z-10">
            <button
              onClick={() => setIsMobileGalleryExpanded(false)}
              className="text-white text-2xl p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
              aria-label="Close gallery"
            >
              &times;
            </button>
          </div>

          <div className="relative w-full h-3/4 md:h-4/5 flex items-center justify-center">
            <img
              src={currentDisplayImage}
              alt={product?.name}
              className="max-w-full max-h-full object-contain"
            />

            {product?.productResources?.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-2 md:left-4 bg-white/20 rounded-full p-2 md:p-3 text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="text-xl md:text-2xl" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-2 md:right-4 bg-white/20 rounded-full p-2 md:p-3 text-white hover:bg-white/30 transition-colors"
                  aria-label="Next image"
                >
                  <FiChevronRight className="text-xl md:text-2xl" />
                </button>

                <div className="absolute bottom-4 bg-black/70 text-white text-sm px-3 py-2 rounded-full">
                  {currentImageIndex + 1} / {product.productResources.length}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-2 md:gap-3 overflow-x-auto py-2 w-full px-2 md:px-4">
            {product?.productResources?.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentDisplayImage(item?.url);
                  setCurrentImageIndex(index);
                }}
                className={`flex-shrink-0 rounded-lg p-1 transition-all ${
                  currentDisplayImage === item?.url
                    ? "border-2 border-blue-500 shadow-lg"
                    : "border border-gray-400 opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={item?.url}
                  alt={`thumbnail-${index}`}
                  className="h-14 w-14 md:h-16 md:w-16 object-cover rounded-lg"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;

