// src/pages/adminPanel/ProductCategories.jsx

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory"; // Import the new component
import Table from "../../../components/Table";
import { categoriesColumns } from "../../../data/categoriesColumns";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const ProductCategories = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // New state for edit modal
  const [categoryToEdit, setCategoryToEdit] = useState(null); // New state to hold the item being edited
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const config = { headers: getHeaders() };
      const response = await axios.get(
        `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`,
        config
      );
      setCategories(response.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddModalOpen = () => {
    setIsAddModalOpen(true);
  };

  const handleAddModalClose = () => {
    setIsAddModalOpen(false);
  };

  const handleEditModalOpen = (category) => {
    setCategoryToEdit(category); // Set the category data to be edited
    setIsEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setCategoryToEdit(null); // Clear the category data
    setIsEditModalOpen(false);
  };

  const handleCategoryAdded = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
    // fetchCategories(); // Or you can refetch all categories
  };

  const handleCategoryUpdated = (updatedCategory) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? updatedCategory : cat))
    );
    // fetchCategories();
  };

  // --- New Delete Handler ---
  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const config = { headers: getHeaders() };
        await axios.delete(
          `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/${categoryId}`,
          config
        );

        // Optimistically remove the category from the list
        setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
        console.log(`Category with ID ${categoryId} deleted successfully.`);
      } catch (error) {
        console.error("Error deleting category:", error);
        window.alert("Failed to delete category. Please try again.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="pt-20 pb-5 text-center text-gray-500 dark:text-gray-400">
        Loading categories...
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-20 pb-5 text-center text-red-500 dark:text-red-400">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="pt-20 pb-5 ml-80">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Categories
        </h2>

        <button
          className="
            flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full
            hover:bg-blue-700 transition-colors
          "
          onClick={handleAddModalOpen}
        >
          <FiPlus />
          Add Category
        </button>
      </div>

      <AddCategory
        open={isAddModalOpen}
        handleClose={handleAddModalClose}
        onCategoryAdded={handleCategoryAdded}
      />

      {/* New EditCategory Modal */}
      <EditCategory
        open={isEditModalOpen}
        handleClose={handleEditModalClose}
        categoryToEdit={categoryToEdit}
        onCategoryUpdated={handleCategoryUpdated}
      />
      <div className="dark:text-white text-black">
        <Table
          data={categories}
          // Pass the handlers to the columns function
          fields={categoriesColumns(handleEditModalOpen, handleDeleteCategory)}
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
    </div>
  );
};

export default ProductCategories;
