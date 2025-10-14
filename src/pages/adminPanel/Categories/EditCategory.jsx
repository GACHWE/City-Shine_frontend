// src/components/EditCategory.jsx

import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const EditCategory = ({
  open,
  handleClose,
  categoryToEdit,
  onCategoryUpdated,
}) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    code: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Use useEffect to populate the form when a new categoryToEdit is provided
  useEffect(() => {
    if (categoryToEdit) {
      setCategoryData({
        name: categoryToEdit.name,
        code: categoryToEdit.code,
        categoryTypes: categoryToEdit.categoryTypes,
        description: categoryToEdit.description,
      });
    }
  }, [categoryToEdit]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [id.replace("edit-category-", "")]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    const payload = {
      name: categoryData.name,
      code: categoryData.code,
      categoryTypes: categoryData.categoryTypes,
      description: categoryData.description,
    };

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...getHeaders(),
      },
    };

    // The API endpoint for updating a category requires its ID
    const backendUrl = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/${categoryToEdit.id}`;

    try {
      const response = await axios.put(backendUrl, payload, config);

      console.log("Category updated successfully:", response.data);
      setStatusMessage({
        type: "success",
        text: "Category updated successfully!",
      });

      if (onCategoryUpdated) {
        onCategoryUpdated(response.data);
      }

      setTimeout(() => {
        handleClose();
        setStatusMessage({ type: "", text: "" });
      }, 1000);
    } catch (error) {
      console.error("Error updating category:", error);
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          error.message ||
          "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!categoryToEdit) return null; // Don't render the modal if no category is selected

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-900/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel
          className="
            w-full max-w-sm 
            rounded-xl 
            bg-white dark:bg-gray-800 
            p-6 
            shadow-lg
          "
        >
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Edit Category
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Modify the category details below.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4">
            <div>Category Name</div>
            <input
              autoFocus
              id="edit-category-name"
              type="text"
              placeholder="Category Name"
              value={categoryData.name}
              onChange={handleChange}
              className="
                mt-2 block w-full 
                rounded-md 
                border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                px-3 py-2 
                text-gray-900 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-blue-500 focus:ring-blue-500
                focus:outline-none
              "
              required
            />
            <div>Category Code</div>

            <input
              id="edit-category-code"
              type="text"
              placeholder="Category Code (e.g., MEN_APP)"
              value={categoryData.code}
              onChange={handleChange}
              className="
                mt-4 block w-full 
                rounded-md 
                border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                px-3 py-2 
                text-gray-900 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-blue-500 focus:ring-blue-500
                focus:outline-none
              "
              required
            />
             <div>Category Type</div>
             <input
              autoFocus
              id="edit-category-type"
              type="text"
              placeholder="Category Type"
              value={categoryData.categoryTypes}
              onChange={handleChange}
              className="
                mt-2 block w-full 
                rounded-md 
                border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                px-3 py-2 
                text-gray-900 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-blue-500 focus:ring-blue-500
                focus:outline-none
              "
              
            />

            <div>Category Description</div>

            <textarea
              id="edit-category-description"
              placeholder="Category Description"
              rows="3"
              value={categoryData.description}
              onChange={handleChange}
              className="
                mt-4 block w-full 
                rounded-md 
                border border-gray-300 dark:border-gray-600
                bg-gray-50 dark:bg-gray-700
                px-3 py-2 
                text-gray-900 dark:text-gray-200
                placeholder-gray-400 dark:placeholder-gray-500
                focus:border-blue-500 focus:ring-blue-500
                focus:outline-none
              "
              required
            />

            <div className="mt-6 flex justify-end gap-2">
              {statusMessage.text && (
                <p
                  className={`flex-1 text-sm text-right mt-2 ${
                    statusMessage.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {statusMessage.text}
                </p>
              )}
              <button
                type="button"
                onClick={handleClose}
                className="
                rounded-md 
                border border-gray-300 dark:border-gray-600 
                bg-white dark:bg-gray-800 
                px-4 py-2 
                text-sm font-medium 
                text-gray-700 dark:text-gray-200
                hover:bg-gray-50 dark:hover:bg-gray-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="
                rounded-md bg-blue-600 px-4 py-2 
                text-sm font-medium text-white 
                hover:bg-blue-700
                focus:outline-none focus:ring-2 focus:ring-blue-500
              "
              >
                {isLoading ? "Updating..." : "Update"}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditCategory;
