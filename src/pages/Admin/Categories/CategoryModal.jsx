// Updated CategoryModal.jsx - Simplified version
import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const CategoryModal = ({
  open,
  handleClose,
  categoryToEdit = null,
  onCategorySuccess,
  mode = "add"
}) => {
  const [categoryData, setCategoryData] = useState({
    name: "",
    code: "",
    description: "",
    // categoryTypes is optional - don't include it in initial state
  });
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (open) {
      if (mode === "edit" && categoryToEdit) {
        setCategoryData({
          name: categoryToEdit.name || "",
          code: categoryToEdit.code || "",
          description: categoryToEdit.description || "",
          // Only include categoryTypes if it exists in the data
          ...(categoryToEdit.categoryTypes && { categoryTypes: categoryToEdit.categoryTypes })
        });
      } else {
        setCategoryData({
          name: "",
          code: "",
          description: "",
        });
      }
      setStatusMessage({ type: "", text: "" });
    }
  }, [open, categoryToEdit, mode]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const fieldName = id.replace("category-", "");
    
    setCategoryData(prevData => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const validateForm = () => {
    if (!categoryData.name?.trim()) {
      setStatusMessage({ type: "error", text: "Category name is required." });
      return false;
    }
    if (!categoryData.code?.trim()) {
      setStatusMessage({ type: "error", text: "Category code is required." });
      return false;
    }
    if (!categoryData.description?.trim()) {
      setStatusMessage({ type: "error", text: "Category description is required." });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Prepare payload - only include categoryTypes if it exists and has values
    const payload = {
      name: categoryData.name.trim(),
      code: categoryData.code.trim(),
      description: categoryData.description.trim(),
      // Only include categoryTypes if it exists and is not empty
      ...(categoryData.categoryTypes && categoryData.categoryTypes.length > 0 && {
        categoryTypes: categoryData.categoryTypes
      })
    };

    console.log('Sending payload:', payload);

    const config = {
      headers: getHeaders(),
    };

    try {
      let response;
      if (mode === "edit" && categoryToEdit) {
        const backendUrl = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/${categoryToEdit.id}`;
        response = await axios.put(backendUrl, payload, config);
      } else {
        const backendUrl = `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`;
        response = await axios.post(backendUrl, payload, config);
      }

      console.log(`Category ${mode === 'add' ? 'added' : 'updated'} successfully:`, response.data);
      
      setStatusMessage({
        type: "success",
        text: `Category ${mode === 'add' ? 'added' : 'updated'} successfully!`,
      });

      if (onCategorySuccess) {
        onCategorySuccess(response.data, mode);
      }

      setTimeout(() => {
        handleClose();
      }, 1000);

    } catch (error) {
      console.error(`Error ${mode === 'add' ? 'adding' : 'updating'} category:`, error);
      
      if (error.response?.status === 401) {
        setStatusMessage({
          type: "error",
          text: "Authentication failed. Please check your token.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: error.response?.data?.message ||
                error.message ||
                `An unexpected error occurred while ${mode === 'add' ? 'adding' : 'updating'} the category.`,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Form fields - only required fields
  const formFields = [
    {
      id: "category-name",
      label: "Category Name",
      type: "text",
      value: categoryData.name,
      placeholder: "Category Name",
      required: true,
      autoFocus: true
    },
    {
      id: "category-code",
      label: "Category Code",
      type: "text",
      value: categoryData.code,
      placeholder: "Category Code (e.g., MEN_APP)",
      required: true
    },
    {
      id: "category-description",
      label: "Category Description",
      type: "textarea",
      value: categoryData.description,
      placeholder: "Category Description",
      required: true,
      rows: 3
    }
  ];

  const renderField = (field) => {
    const commonClasses = `
      mt-2 block w-full 
      rounded-md 
      border border-gray-300 dark:border-gray-600
      bg-gray-50 dark:bg-gray-700
      px-3 py-2 
      text-gray-900 dark:text-gray-200
      placeholder-gray-400 dark:placeholder-gray-500
      focus:border-blue-500 focus:ring-blue-500
      focus:outline-none
    `;

    if (field.type === "textarea") {
      return (
        <textarea
          id={field.id}
          placeholder={field.placeholder}
          rows={field.rows || 3}
          value={field.value}
          onChange={handleChange}
          className={commonClasses}
          required={field.required}
        />
      );
    }

    return (
      <input
        id={field.id}
        type={field.type}
        placeholder={field.placeholder}
        value={field.value}
        onChange={handleChange}
        className={commonClasses}
        required={field.required}
        autoFocus={field.autoFocus}
      />
    );
  };

  const getTitle = () => {
    return mode === "add" ? "Add Category" : "Edit Category";
  };

  const getDescription = () => {
    return mode === "add" 
      ? "Provide the category name, code and description."
      : "Modify the category details below.";
  };

  const getSubmitButtonText = () => {
    if (isLoading) {
      return mode === "add" ? "Adding..." : "Updating...";
    }
    return mode === "add" ? "Add" : "Update";
  };

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-900/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-sm rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            {getTitle()}
          </Dialog.Title>

          <Dialog.Description className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {getDescription()}
          </Dialog.Description>

          <form onSubmit={handleSubmit} className="mt-4">
            {formFields.map((field, index) => (
              <div key={field.id} className={index > 0 ? "mt-4" : ""}>
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </div>
                {renderField(field)}
              </div>
            ))}

            <div className="mt-6 flex justify-end gap-2">
              {statusMessage.text && (
                <p
                  className={`flex-1 text-sm text-right mt-2 ${
                    statusMessage.type === "success" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {statusMessage.text}
                </p>
              )}
              <button
                type="button"
                onClick={handleClose}
                disabled={isLoading}
                className="
                  rounded-md 
                  border border-gray-300 dark:border-gray-600 
                  bg-white dark:bg-gray-800 
                  px-4 py-2 
                  text-sm font-medium 
                  text-gray-700 dark:text-gray-200
                  hover:bg-gray-50 dark:hover:bg-gray-700
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  disabled:opacity-50
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
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default CategoryModal;