import React, { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const EditProduct = ({ open, handleClose, productToEdit, onProductUpdated, categories }) => {
  const [productData, setProductData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        name: productToEdit.name,
        brand: productToEdit.brand,
        description: productToEdit.description,
        price: productToEdit.price,
        is_new_arrival: productToEdit.is_new_arrival,
        category_id: productToEdit.category.id,
      });
    }
  }, [productToEdit]);

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setProductData((prevData) => ({
      ...prevData,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const config = { headers: getHeaders() };
      const response = await axios.put(
        `${API_BASE_URL}${API_URLS.GET_PRODUCTS}/${productToEdit.id}`,
        productData,
        config
      );

      console.log("Product updated successfully:", response.data);
      setStatusMessage({ type: "success", text: "Product updated successfully!" });
      
      if (onProductUpdated) {
        onProductUpdated(response.data);
      }

      setTimeout(() => {
        handleClose();
        setStatusMessage({ type: "", text: "" });
      }, 1000);

    } catch (error) {
      console.error("Error updating product:", error);
      setStatusMessage({
        type: "error",
        text: error.response?.data?.message || error.message || "An unexpected error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!productToEdit) return null;

  return (
    <Dialog open={open} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-gray-900/60" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-xl rounded-xl bg-white dark:bg-gray-800 p-6 shadow-lg">
          <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-gray-200">
            Edit Product
          </Dialog.Title>
          <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Input fields for product details */}
            <div>
              <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input id="name" type="text" value={productData.name || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="brand" className="text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
              <input id="brand" type="text" value={productData.brand || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
              <label htmlFor="price" className="text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
              <input id="price" type="number" value={productData.price || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div>
                <label htmlFor="category_id" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <select id="category_id" value={productData.category_id || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <div className="col-span-1 md:col-span-2">
                <label htmlFor="description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                <textarea id="description" rows="3" value={productData.description || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" required />
            </div>
            <div className="col-span-1 md:col-span-2 flex items-center">
              <input id="is_new_arrival" type="checkbox" checked={productData.is_new_arrival || false} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
              <label htmlFor="is_new_arrival" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Is New Arrival?</label>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4 flex justify-end gap-2">
              <button type="button" onClick={handleClose} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">Cancel</button>
              <button type="submit" disabled={isLoading} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">{isLoading ? "Updating..." : "Update"}</button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default EditProduct;