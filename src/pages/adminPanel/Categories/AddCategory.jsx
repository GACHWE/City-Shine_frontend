import * as React from "react";
import { useState } from "react";
import { Dialog } from "@headlessui/react"; // For the modal functionality
import axios from 'axios';
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant"; // Import API constants

const AddCategory = ({ open, handleClose, onCategoryAdded }) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    code: "",
    categoryTypes: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [id.replace("category-", "")]: value, // Adjust ID prefix if needed
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Basic validation
    if (!categoryData.name || !categoryData.code || !categoryData.description) {
      setStatusMessage({ type: "error", text: "Please fill out all required fields." });
      setIsLoading(false);
      return;
    }

    const payload = {
      name: categoryData.name,
      categoryTypes: categoryData.categoryTypes,
      code: categoryData.code,
      description: categoryData.description,
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders(), // Include Authorization header
      },
    };

    const backendUrl = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`; // POST to /api/categories
    try {
      const response = await axios.post(backendUrl, payload, config);

      console.log("Category added successfully:", response.data);
      setStatusMessage({ type: "success", text: "Category added successfully!" });
      
      // Callback to parent component (e.g., to refresh the list)
      if (onCategoryAdded) {
        onCategoryAdded(response.data);
      }

      // Reset form and close modal after success
      setCategoryData({ name: "", code: "",categoryTypes: "", description: "" });
      setTimeout(() => { // Give user time to see success message
        handleClose();
        setStatusMessage({ type: "", text: "" }); // Clear message for next open
      }, 1000); 

    } catch (error) {
      console.error("Error adding category:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "An unexpected error occurred."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      {/* The backdrop, rendered as a fixed sibling to the panel container */}
      <div className="fixed inset-0 bg-gray-900/60" aria-hidden="true" />

      {/* Full-screen container to center the panel */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        {/* The actual dialog panel */}
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
            Add Category
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Provide the category name, code, type and description.
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4">
            <input
              autoFocus
              id="category-name"
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
            <input
              id="category-code"
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
             <input
              id="category-type"
              type="text"
              placeholder="Category Type"
              value={categoryData.categoryTypes}
              onChange={handleChange}
              className=" mt-4 block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-2  text-gray-900 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
                focus:border-blue-500 focus:ring-blue-500
                focus:outline-none
              "
            
            />
            <textarea
              id="category-description"
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
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AddCategory;