import React from "react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ category, product }) => {
  return (
    <nav className="flex py-2" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        {/* Home */}
        <li className="inline-flex items-center">
          <Link
            to="/"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
          >
            Home
          </Link>
          <Separator />
        </li>

        {/* Categories */}
        <li className="inline-flex items-center">
          <Link
            to="/categories"
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
          >
            Categories
          </Link>
          {category && <Separator />}
        </li>

        {/* Category Page */}
        {category && (
          <li className="inline-flex items-center">
            <Link
              to={`/category/${category.id}`}
              className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-black"
            >
              {category.name}
            </Link>
            {product && <Separator />}
          </li>
        )}

        {/* Product Page */}
        {product && (
          <li className="inline-flex items-center">
            <span className="text-sm font-medium text-gray-500">{product.name}</span>
          </li>
        )}
      </ol>
    </nav>
  );
};

const Separator = () => (
  <svg
    className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 6 10"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m1 9 4-4-4-4"
    />
  </svg>
);

export default Breadcrumb;
