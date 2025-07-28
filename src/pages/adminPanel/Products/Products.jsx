// src/pages/adminPanel/ProductList.jsx

import React, { useState, useEffect, useCallback } from "react"; // Added useCallback
import { FiPlus } from "react-icons/fi";
import { productsColumns } from "../../../data/productsColumns"; // Ensure this path is correct
import Table from "../../../components/Table"; // Ensure this path is correct
import AddProduct from "./AddProduct"; // Corrected path to AddProduct.jsx
import EditProduct from "./EditProduct"; // Import new component - ensure path is correct
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant"; // Ensure this path is correct

const Products = () => { // Renamed from ProductList for clarity, though your file is named ProductList.jsx
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // This will be passed to AddProduct for dropdowns
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Use useCallback for fetchProductsAndCategories to prevent unnecessary re-renders
  const fetchProductsAndCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: getHeaders() };
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}`, config),
        axios.get(`${API_BASE_URL}${API_URLS.GET_CATEGORIES}`, config),
      ]);
      setProducts(productsResponse.data);
      setCategories(categoriesResponse.data); // Set fetched categories
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load products or categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this function is created once

  useEffect(() => {
    fetchProductsAndCategories();
  }, [fetchProductsAndCategories]); // Dependency array ensures it runs when fetchProductsAndCategories changes (which it won't due to useCallback)

  const handleAddModalOpen = () => setIsAddModalOpen(true);
  const handleAddModalClose = () => setIsAddModalOpen(false);
  // This function is called by AddProduct after successful product creation
  const handleProductAdded = () => {
    fetchProductsAndCategories(); // Re-fetch all products after adding
  };

  // --- Handlers for Edit and Delete ---
  const handleEditModalOpen = (product) => {
    setProductToEdit(product);
    setIsEditModalOpen(true);
  };
  const handleEditModalClose = () => {
    setProductToEdit(null);
    setIsEditModalOpen(false);
  };
  const handleProductUpdated = (updatedProduct) => {
    // Optimistically update the product in the list
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    // If you prefer to be absolutely safe and refetch everything:
    // fetchProductsAndCategories(); 
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        const config = { headers: getHeaders() };
        await axios.delete(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}/${productId}`, config);
        
        // Optimistically remove the product from the list
        setProducts(prev => prev.filter(p => p.id !== productId));
        console.log(`Product with ID ${productId} deleted successfully.`);
        
      } catch (error) {
        console.error("Error deleting product:", error);
        window.alert("Failed to delete product. Please try again.");
      }
    }
  };

  if (isLoading) {
    return <div className="pt-20 pb-5 text-center text-gray-500 dark:text-gray-400">Loading products...</div>;
  }
  if (error) {
    return <div className="pt-20 pb-5 text-center text-red-500 dark:text-red-400">Error: {error}</div>;
  }

  return (
    <div className="pt-20 pb-5 ml-80"> {/* ml-80 will push the whole content to the right */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Products
        </h2>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
          onClick={handleAddModalOpen}
        >
          <FiPlus />
          Add Product
        </button>
      </div>

      {/* Conditionally render AddProduct modal */}
      {isAddModalOpen && (
        <AddProduct
          open={isAddModalOpen}
          handleClose={handleAddModalClose}
          onProductAdded={handleProductAdded}
          // The categories prop is now available and passed
          categories={categories} 
        />
      )}
      
      {/* Conditionally render EditProduct modal */}
      {isEditModalOpen && productToEdit && (
        <EditProduct
          open={isEditModalOpen}
          handleClose={handleEditModalClose}
          productToEdit={productToEdit}
          onProductUpdated={handleProductUpdated}
          categories={categories} // Also pass categories to EditProduct
        />
      )}

      <Table
        data={products}
        // Pass the handlers to the columns function
        fields={productsColumns(handleEditModalOpen, handleDeleteProduct)}
        numberOfRows={10}
        enableTopToolBar={true}
        enableBottomToolBar={true}
        enablePagination={true}
        enableRowSelection={false}
        enableColumnFilters={false}
        enableEditing={true}
        enableColumnDragging={true}
      />
    </div>
  );
};

export default Products;