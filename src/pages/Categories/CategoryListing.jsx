import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductListing from "../ProductListPage/ProductListPage";

export default function CategoryListing() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <ProductListing
      categoryId={id}
      categoryName="Category Products" // You can fetch the actual category name here
      showFilters={true}
      enablePagination={true}
      onBack={handleBack}
    />
  );
}