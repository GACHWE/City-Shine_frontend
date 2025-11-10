import React from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { FaWhatsapp } from "react-icons/fa";
import { addItemToCartAction } from "../../store/actions/cartAction";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const {
    id,
    name,
    price,
    brand,
    slug,
    productResources,
    isNewArrival,
    variants = [],
  } = product;

  const thumbnail =
    productResources?.find((res) => res.isPrimary)?.url ||
    productResources?.[0]?.url ||
    "https://placehold.co/600x600/94a3b8/e2e8f0?text=No+Image";

  const displayPrice = price ? `Ksh ${price.toFixed(1)}` : "N/A";

  const shopNumber = "254739299636";
  const productUrl = window.location.origin + "/product/" + product.slug;

  const message = `Hello, I’d like more details about ${product.name}. Here’s the link: ${productUrl}`;
  const whatsappLink = `https://wa.me/${shopNumber}?text=${encodeURIComponent(
    message
  )}`;

  const selectedVariant = variants[0];
  const stockQuantity = selectedVariant?.stockQuantity ?? 0;
  const variantId = selectedVariant?.id;
  const conditionStatus = selectedVariant?.conditionStatus;

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    dispatch(
      addItemToCartAction({
        productId: id,
        thumbnail,
        name,
        variantId,
        variantName: `${selectedVariant.color ?? ""} `,
        quantity: 1,
        subTotal: selectedVariant.price ?? price,
        price: price,
      })
    );
  };

  const isOutOfStock = stockQuantity <= 0;

  return (
    <div className="relative flex flex-col w-full h-full p-3 bg-gradient-to-br from-white to-yellow-50 dark:bg-gradient-to-br dark:from-gray-700 dark:to-gray-900 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
      {/* Product Tags */}
      <div className="absolute top-2 left-2 z-10 space-y-1">
        {isNewArrival && (
          <span className="block bg-green-500 dark:bg-green-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
            New Arrival
          </span>
        )}
        {conditionStatus && (
          <span
            className={`block text-white text-xs font-semibold px-2 py-1 rounded-full ${
              conditionStatus === "REFURBISHED"
                ? "bg-blue-500 dark:bg-blue-600"
                : conditionStatus === "USED"
                ? "bg-orange-400 dark:bg-orange-400"
                : "bg-red-600 dark:bg-red-500"
            }`}
          >
            {conditionStatus === "REFURBISHED"
              ? "Refurbished"
              : conditionStatus === "USED"
              ? "Used"
              : "New"}
          </span>
        )}
      </div>

      {/* Product Image */}
      <Link
        to={`/product/${slug || id}`}
        className="block overflow-hidden rounded-lg"
      >
        <img
          className="w-full h-40 sm:h-64 object-cover transition-transform duration-300 hover:scale-110"
          src={thumbnail}
          alt={name}
          loading="lazy"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 flex flex-col justify-between pt-4">
        <div className="space-y-1">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {name}
          </p>
          {brand && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{brand}</p>
          )}
        </div>

        <div className="flex justify-between items-center mt-2">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
            {displayPrice}
          </p>
          <p
            className={`text-sm font-semibold ${
              isOutOfStock
                ? "text-red-500"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {isOutOfStock ? "Out of Stock" : "In Stock"}
          </p>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`w-full mt-4 py-2 px-4 rounded-lg font-medium text-white transition-colors duration-200 ${
            isOutOfStock
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
          }`}
        >
          {isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </button>

        {/* WhatsApp Contact */}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
        >
          {/* Small screens */}
          <span className="flex items-center sm:hidden">
            Contact via <FaWhatsapp className="ml-1 text-lg" />
          </span>

          {/* Larger screens */}
          <span className="hidden sm:inline">
            Contact via WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
