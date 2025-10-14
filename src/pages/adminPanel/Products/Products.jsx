import React, { useState, useEffect, useCallback } from "react";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { productsColumns } from "../../../data/productsColumns";
import Table from "../../../components/Table";
import ProductForm from "./ProductForm";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const Products = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalItems: 0,
    totalPages: 0
  });

  const fetchProducts = useCallback(async (page = 0, size = 10) => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: getHeaders() };
      const response = await axios.get(
        `${API_BASE_URL}${API_URLS.GET_PRODUCTS}?page=${page}&size=${size}`,
        config
      );
      
      // Handle both response formats for backward compatibility
      const responseData = response.data;
      let productsData, totalItems, totalPages;
      
      if (responseData.products !== undefined) {
        // New paginated response format
        productsData = responseData.products;
        totalItems = responseData.totalItems;
        totalPages = responseData.totalPages;
      } else {
        // Legacy array format
        productsData = responseData;
        totalItems = responseData.length;
        totalPages = Math.ceil(totalItems / size);
      }
      
      setProducts(productsData);
      setPagination({
        page,
        size,
        totalItems,
        totalPages
      });
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(0, 10);
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, pagination.size);
  };

  const handlePageSizeChange = (newSize) => {
    fetchProducts(0, newSize);
  };

  const handleAddProduct = () => {
    setProductToEdit(null);
    setIsFormOpen(true);
  };

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setProductToEdit(null);
    fetchProducts(pagination.page, pagination.size);
  };

  const handleDeleteProduct = async (productId) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone."
      )
    ) {
      try {
        const config = { headers: getHeaders() };
        await axios.delete(
          `${API_BASE_URL}${API_URLS.GET_PRODUCTS}/${productId}`,
          config
        );
        // Refresh current page
        fetchProducts(pagination.page, pagination.size);
        console.log(`Product with ID ${productId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting product:", error);
        window.alert("Failed to delete product. Please try again.");
      }
    }
  };

  const handleRefresh = () => {
    fetchProducts(pagination.page, pagination.size);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="pt-20 pb-5 text-center text-gray-500 dark:text-gray-400">
        <div className="flex items-center justify-center">
          <FiRefreshCw className="animate-spin mr-2" />
          Loading products...
        </div>
      </div>
    );
  }

  if (error && products.length === 0) {
    return (
      <div className="pt-20 pb-5 text-center text-red-500 dark:text-red-400">
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={handleRefresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-5 ml-80">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Products</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Showing {products.length} of {pagination.totalItems} products
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Refresh products"
          >
            <FiRefreshCw className={isLoading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            onClick={handleAddProduct}
          >
            <FiPlus />
            Add Product
          </button>
        </div>
      </div>

      {isFormOpen && (
        <ProductForm
          open={isFormOpen}
          handleClose={handleCloseForm}
          onProductAction={handleCloseForm}
          product={productToEdit}
        />
      )}

      <div className="dark:text-white text-black">
        <Table
          data={products}
          fields={productsColumns(handleEditProduct, handleDeleteProduct)}
          numberOfRows={pagination.size}
          enableTopToolBar={true}
          enableBottomToolBar={true}
          enablePagination={true}
          enableRowSelection={false}
          enableColumnFilters={true}
          enableEditing={true}
          enableColumnDragging={true}
          // Pagination props
          pagination={{
            page: pagination.page,
            totalPages: pagination.totalPages,
            totalItems: pagination.totalItems,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
            pageSizeOptions: [5, 10, 20, 50]
          }}
        />
      </div>

      {error && products.length > 0 && (
        <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-800 rounded-lg">
          <p className="text-red-700 dark:text-red-400 text-sm">
            Warning: {error} Some products may not be displayed correctly.
          </p>
        </div>
      )}
    </div>
  );
};

export default Products;