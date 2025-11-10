import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLoaderData } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import _ from "lodash";

import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import Rating from "../../components/Rating/Rating";
import ProductColors from "./ProductColors";
import SvgReturn from "../../components/common/SvgReturn";
import ProductCard from "../ProductListPage/ProductCard";

import { fetchProducts } from "../../api/fetchProducts";
import { addItemToCartAction } from "../../store/actions/cartAction";
import Carousel from "../../components/common/Carousel";
import { AiOutlineWhatsApp } from "react-icons/ai";
import {
  FiShoppingCart,
  FiChevronLeft,
  FiChevronRight,
  FiShare2,
  FiHeart,
} from "react-icons/fi";
import { TbTruckDelivery } from "react-icons/tb";
import { IoRepeatOutline, IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaLeaf } from "react-icons/fa";

const extraSections = [
  {
    icon: <IoShieldCheckmarkOutline className=" text-4xl" />,
    label: "Secure payment",
    description: "Your payment information is protected",
  },
  {
    icon: <FaLeaf className="text-green-500"/>,
    label: "Eco-Friendly",
    description: "Less power consumption, more efficient",
  },
  {
    icon: <TbTruckDelivery className="text-violet-600 dark:text-violet-400 text-4xl" />,
    label: "Free Delivery",
    description: "On all your Orders",
  },
  {
    icon: <IoRepeatOutline className="text-gray-700 dark:text-gray-400 text-4xl" />,
    label: "Free Returns",
    description: "30-day return policy",
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
  const whatsappLink = `https://wa.me/${shopNumber}?text=${encodeURIComponent(
    message
  )}`;

  // FIXED: Similar products fetch function
  useEffect(() => {
    if (!product?.categoryId) return;
    setLoadingSimilar(true);
    setSimilarError(null);

    fetchProducts({
      categoryId: product.categoryId,
      typeId: product.categoryTypeId,
    })
      .then((res) => { 
        const filtered = res?.data?.filter((item) => item?.id !== product?.id) || [];
        setSimilarProducts(filtered.slice(0, 8)); // Limit to 8 products
      })
      .catch((err) => {
        console.error("Error fetching similar products:", err);
        setSimilarError("Failed to load similar products.");
      })
      .finally(() => setLoadingSimilar(false));
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
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 dark:bg-gray-800">
        {/* Breadcrumb */}
        <div className="py-4 border-b border-gray-200 dark:border-gray-800">
          <Breadcrumb links={breadCrumbLinks} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-8">
          {/* Image Gallery - Left Column */}
          <div className="lg:col-span-7">
            <div className="flex flex-col lg:flex-row gap-6 ">
              {/* Thumbnails - Vertical on desktop */}
              <div className="hidden lg:flex flex-col gap-4  max-h-[600px]">
                {product?.productResources?.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentDisplayImage(item?.url);
                      setCurrentImageIndex(index);
                    }}
                    className={`rounded-lg p-1 transition-all duration-200 ${
                      currentDisplayImage === item?.url
                        ? "border-2 border-blue-500 shadow-lg scale-105"
                        : "border border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <img
                      src={item?.url}
                      alt={`thumbnail-${index}`}
                      className="h-20 w-20 object-cover rounded-lg"
                    />
                  </button>
                ))}
              </div>

              {/* Main Image Area */}
              <div className="flex-1">
                <div className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 lg:p-8">
                  {/* Navigation Arrows */}
                  {product?.productResources?.length > 1 && (
                    <>
                      <button
                        onClick={() => navigateImage("prev")}
                        className="absolute left-2 lg:left-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 rounded-full p-3 shadow-lg z-10 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 lg:hidden"
                        aria-label="Previous image"
                      >
                        <FiChevronLeft className="text-xl" />
                      </button>
                      <button
                        onClick={() => navigateImage("next")}
                        className="absolute right-2 lg:right-4 top-1/2 transform -translate-y-1/2 bg-white/90 dark:bg-gray-700/90 rounded-full p-3 shadow-lg z-10 hover:bg-white dark:hover:bg-gray-600 transition-all duration-200 lg:hidden"
                        aria-label="Next image"
                      >
                        <FiChevronRight className="text-xl" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  {product?.productResources?.length > 1 && (
                    <div className="absolute top-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full z-10">
                      {currentImageIndex + 1} /{" "}
                      {product.productResources.length}
                    </div>
                  )}

                  {/* Main Image */}
                  <div className="flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
                    <img
                      src={currentDisplayImage}
                      alt={product?.name}
                      className="max-w-full max-h-[500px] object-contain rounded-lg"
                    />
                  </div>

                  {/* Mobile Gallery Expand Button */}
                  {product?.productResources?.length > 1 && (
                    <button
                      onClick={() => setIsMobileGalleryExpanded(true)}
                      className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center justify-center w-full lg:hidden text-sm"
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
              isSticky ? "lg:sticky lg:top-24 lg:self-start" : ""
            }`}
          >
            <div className="space-y-6">
              {/* Header Section */}
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h1 className="text-2xl lg:text-3xl font-bold leading-tight pr-4">
                    {product?.name}
                  </h1>
                  <button
                    onClick={shareProduct}
                    className="flex-shrink-0 p-2 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400 transition-colors"
                    aria-label="Share product"
                  >
                    <FiShare2 className="text-xl" />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <Rating rating={product?.rating} showCount={true} />
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {product?.price != null
                        ? `Ksh ${product.price.toLocaleString()}`
                        : "Price not available"}
                    </p>
                    {product?.originalPrice &&
                      product.originalPrice > product.price && (
                        <p className="text-sm text-gray-500 line-through">
                          Ksh {product.originalPrice.toLocaleString()}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="prose prose-gray dark:prose-invert max-w-none">
                <ul className="text-gray-600 dark:text-gray-300 leading-relaxed list-disc list-inside space-y-1">
                  {product?.description?.split("\n").map((point, index) => (
                    <li key={index}>{point.trim()}</li>
                  ))}
                </ul>
              </div>

              {/* Key Features Grid - FIXED: Using selectedVariant for conditionStatus */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Condition
                  </p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {selectedVariant?.conditionStatus || "N/A"}
                  </p>
                </div>
                <div className="text-center">
                  <p className="font-semibold text-sm text-gray-600 dark:text-gray-400">
                    Availability
                  </p>
                  <p
                    className={`text-lg font-bold ${
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
                  <p className="font-semibold text-lg">Select Color</p>
                  {selectedColor && (
                    <p className="text-sm text-gray-500">
                      Selected: {selectedColor}
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
                    className={`flex items-center justify-center gap-3 rounded-xl px-8 py-4 font-semibold text-lg transition-all duration-300 shadow-lg flex-1 ${
                      isAddToCartDisabled
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700 text-white hover:shadow-xl hover:scale-105"
                    }`}
                  >
                    <FiShoppingCart className="text-xl" />
                    {isAddToCartDisabled ? "Out of Stock" : "Add to Cart"}
                  </button>

                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg transition-all duration-300 hover:scale-105 flex-1"
                  >
                    <AiOutlineWhatsApp className="text-2xl" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                {error && (
                  <p className="text-red-600 dark:text-red-400 text-sm text-center bg-red-50 dark:bg-red-900/20 py-2 rounded-lg">
                    {error}
                  </p>
                )}

                {/* Trust Badges */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {extraSections.map((section, idx) => (
                    <div key={idx} className="flex flex-col items-center text-center space-y-2 p-2">
                      <div className="text-blue-600 dark:text-blue-400  text-2xl">
                        {section.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-xs">{section.label}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
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
        <div className="mt-16 border-t border-gray-200 dark:border-gray-800 pt-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold mb-2">
              You Might Also Like
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Discover similar products that match your style
            </p>
          </div>

          {loadingSimilar ? (
            <div className="flex justify-center py-10">
              <div className="animate-pulse text-gray-500">
                Loading similar products...
              </div>
            </div>
          ) : similarError ? (
            <div className="text-center py-10 text-red-500">{similarError}</div>
          ) : similarProducts.length > 0 ? (
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
          ) : (
            <div className="text-center py-10 text-gray-500">
              No similar products found.
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
              className="text-white text-2xl p-2 bg-black/50 rounded-full"
              aria-label="Close gallery"
            >
              &times;
            </button>
          </div>

          <div className="relative w-full h-4/5 flex items-center justify-center">
            <img
              src={currentDisplayImage}
              alt={product?.name}
              className="max-w-full max-h-full object-contain"
            />

            {product?.productResources?.length > 1 && (
              <>
                <button
                  onClick={() => navigateImage("prev")}
                  className="absolute left-2 bg-white/20 rounded-full p-3 text-white hover:bg-white/30 transition-colors"
                  aria-label="Previous image"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button
                  onClick={() => navigateImage("next")}
                  className="absolute right-2 bg-white/20 rounded-full p-3 text-white hover:bg-white/30 transition-colors"
                  aria-label="Next image"
                >
                  <FiChevronRight className="text-xl" />
                </button>

                <div className="absolute bottom-4 bg-black/70 text-white text-sm px-4 py-2 rounded-full">
                  {currentImageIndex + 1} / {product.productResources.length}
                </div>
              </>
            )}
          </div>

          <div className="mt-4 flex gap-3 overflow-x-auto py-2 w-full px-4">
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
                  className="h-16 w-16 object-cover rounded-lg"
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