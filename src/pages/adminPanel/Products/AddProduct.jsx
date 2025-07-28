// src/pages/adminPanel/Products/AddProduct.jsx
import React, { useRef, useState, useEffect } from "react";
import { BiImageAdd } from "react-icons/bi";
import axios from 'axios';
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant"; // Adjust path as per your project structure
import { FiX } from "react-icons/fi";

const CLOUDINARY_CLOUD_NAME = 'dyl7v3xqm';
const CLOUDINARY_UPLOAD_PRESET = 'shopease_upload_preset';

const AddProduct = ({ open, handleClose, onProductAdded }) => { // <--- Props added here
    const [fetchedCategories, setFetchedCategories] = useState([]);
    const [productData, setProductData] = useState({
        name: "",
        description: "",
        categoryId: "",
        categoryTypeId: "",
        tags: [],
        brand: "",
        price: "",
        discount: "",
        rating: 0,
        isNewArrival: false,
        slug: "",
        thumbnailFile: null,
        thumbnailUrl: null,
    });

    const [tagInput, setTagInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });
    const imageInputRef = useRef(null);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const config = {
                    headers: getHeaders(),
                };
                const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_CATEGORIES}`, config);
                setFetchedCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
                setStatusMessage({ type: "error", text: "Failed to load categories. Please check backend." });
            }
        };

        fetchCategories();
    }, []);

    // Reset form when modal is opened (from parent's 'open' prop changing to true)
    useEffect(() => {
        if (open) {
            setProductData({
                name: "", description: "", categoryId: "", categoryTypeId: "", tags: [],
                brand: "", price: "", discount: "", rating: 0, isNewArrival: false, slug: "",
                thumbnailFile: null, thumbnailUrl: null,
            });
            setTagInput("");
            setStatusMessage({ type: "", text: "" }); // Clear messages on open
            if (imageInputRef.current) {
                imageInputRef.current.value = ""; // Clear file input visual
            }
        }
    }, [open]);


    const handleChange = (e) => {
        const { id, name, value, type, checked } = e.target;
        // Adjusted to properly handle IDs and names for various inputs
        const fieldName = id.startsWith("product-") ? id.replace("product-", "") : name; 

        setProductData((prevData) => ({
            ...prevData,
            [fieldName]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProductData((prevData) => ({
                ...prevData,
                thumbnailFile: file,
                thumbnailUrl: null, // Reset URL if a new file is selected, indicates it needs upload
            }));
        } else {
            setProductData((prevData) => ({
                ...prevData,
                thumbnailFile: null,
                thumbnailUrl: null,
            }));
        }
    };

    const handleTagInput = (event) => {
        if (event.key === "Enter" && tagInput.trim() !== "") {
            event.preventDefault();
            setProductData((prevData) => ({
                ...prevData,
                tags: [...prevData.tags, tagInput.trim()],
            }));
            setTagInput("");
        }
    };

    const removeTag = (index) => {
        setProductData((prevData) => ({
            ...prevData,
            tags: prevData.tags.filter((_, i) => i !== index),
        }));
    };

    const uploadImageToCloudinary = async (file) => {
        if (!file) return null;

        setIsUploadingImage(true);
        setStatusMessage({ type: "", text: "" });

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                formData
            );
            const imageUrl = response.data.secure_url;
            setProductData(prevData => ({ ...prevData, thumbnailUrl: imageUrl }));
            setIsUploadingImage(false);
            return imageUrl;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            setStatusMessage({ type: "error", text: "Failed to upload image. Please try again." });
            setIsUploadingImage(false);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setStatusMessage({ type: "", text: "" });

        // Basic validation
        if (!productData.name || !productData.description || !productData.categoryId || !productData.price) {
            setStatusMessage({ type: "error", text: "Please fill out all required fields (Name, Description, Category, Price)." });
            setIsLoading(false);
            return;
        }

        let finalThumbnailUrl = productData.thumbnailUrl;
        if (productData.thumbnailFile && !productData.thumbnailUrl) {
            const uploadedUrl = await uploadImageToCloudinary(productData.thumbnailFile);
            if (!uploadedUrl) {
                setIsLoading(false);
                return;
            }
            finalThumbnailUrl = uploadedUrl;
        }

        if (!finalThumbnailUrl) {
            setStatusMessage({ type: "error", text: "Please upload a product image." });
            setIsLoading(false);
            return;
        }

        const productResources = [{
            name: productData.thumbnailFile ? productData.thumbnailFile.name : 'product_thumbnail',
            url: finalThumbnailUrl,
            type: 'image',
            isPrimary: true,
        }];

        const payload = {
            name: productData.name,
            description: productData.description,
            brand: productData.brand,
            price: parseFloat(productData.price),
            discount: parseFloat(productData.discount) || 0,
            rating: parseInt(productData.rating) || 0,
            isNewArrival: productData.isNewArrival,
            slug: productData.slug,
            categoryId: productData.categoryId,
            categoryTypeId: productData.categoryTypeId || null,
            // tags: productData.tags, // Uncomment if your backend ProductDto has a 'tags' field
            productResources: productResources,
        };

        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...getHeaders(),
            },
        };

        const backendUrl = `${API_BASE_URL}${API_URLS.GET_PRODUCTS}`;
        try {
            const response = await axios.post(backendUrl, payload, config);

            console.log("Product added successfully:", response.data);
            setStatusMessage({ type: "success", text: "Product added successfully!" });
            
            // Close the modal and trigger parent refresh
            handleClose(); 
            if (onProductAdded) {
                onProductAdded();
            }

        } catch (error) {
            console.error("Error adding product:", error);
            setStatusMessage({
                type: "error",
                text: error.response?.data?.message || error.message || "An unexpected error occurred."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const selectedCategory = fetchedCategories.find(cat => cat.id === productData.categoryId);

    // Conditional rendering: If 'open' is false, render nothing
    if (!open) return null;

    return (
        // Modal overlay (fixed position, covers entire screen)
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto pt-96 z-50 flex items-center justify-center">
            {/* Modal content area (white box in the center) */}
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-4xl mx-auto dark:bg-gray-800 relative"> 
                
                {/* Header with title and close button */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                        Add New Product
                    </h3>
                    <button
                        type="button"
                        onClick={handleClose} // Calls the handleAddModalClose from parent
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Close"
                    >
                        <FiX className="h-6 w-6" /> {/* Close icon */}
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div
                        className="
                            rounded-xl border border-gray-200 dark:border-gray-700
                            p-5 bg-white dark:bg-gray-800 shadow-sm
                        "
                    >
                        {/* Product Name */}
                        <div className="my-4">
                            <label htmlFor="product-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Product Name
                            </label>
                            <input
                                id="product-name"
                                type="text"
                                placeholder="Product Name"
                                value={productData.name}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                required
                            />
                        </div>

                        {/* Product Description */}
                        <div className="mt-6">
                            <label htmlFor="product-description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Product Description
                            </label>
                            <textarea
                                id="product-description"
                                placeholder="Product Description"
                                rows={4}
                                value={productData.description}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                required
                            />
                        </div>

                        {/* Category Dropdown (now populated from backend) */}
                        <div className="mt-6">
                            <label htmlFor="product-categoryId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Category
                            </label>
                            <select
                                id="product-categoryId"
                                value={productData.categoryId}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                required
                            >
                                <option value="" disabled>
                                    Select a Category
                                </option>
                                {fetchedCategories.length > 0 ? (
                                    fetchedCategories.map((category) => (
                                        <option value={category.id} key={category.id}>
                                            {category.name}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>Loading categories...</option>
                                )}
                            </select>
                        </div>

                        {/* Category Type Dropdown (conditionally rendered) */}
                        {selectedCategory && selectedCategory.categoryTypes && selectedCategory.categoryTypes.length > 0 && (
                            <div className="mt-6">
                                <label htmlFor="product-categoryTypeId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Category Type
                                </label>
                                <select
                                    id="product-categoryTypeId"
                                    value={productData.categoryTypeId}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                >
                                    <option value="" disabled>
                                        Select a Category Type
                                    </option>
                                    {selectedCategory.categoryTypes.map((type) => (
                                        <option value={type.id} key={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Product Tags */}
                        <div className="mt-6 ">
                            <label htmlFor="tag-input" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Tags
                            </label>
                            <div className="relative">
                                <input
                                    id="tag-input"
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={handleTagInput}
                                    placeholder="Type a tag and press enter"
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {productData.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-700 dark:text-gray-200"
                                    >
                                        {tag}
                                        <button
                                            type="button" // Important to prevent form submission
                                            onClick={() => removeTag(index)}
                                            className="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Brand */}
                        <div className="mt-6">
                            <label htmlFor="product-brand" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Brand
                            </label>
                            <input
                                id="product-brand"
                                type="text"
                                placeholder="Brand"
                                value={productData.brand}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                            />
                        </div>

                        {/* Price and Discount */}
                        <div className="mt-6 flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="product-price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Price
                                </label>
                                <input
                                    id="product-price"
                                    type="number"
                                    placeholder="Price"
                                    value={productData.price}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                    required
                                />
                            </div>
                            <div className="w-1/2">
                                <label htmlFor="product-discount" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Discount
                                </label>
                                <input
                                    id="product-discount"
                                    type="number"
                                    placeholder="Discount"
                                    value={productData.discount}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                />
                            </div>
                        </div>

                        {/* Rating and New Arrival */}
                        <div className="mt-6 flex gap-4">
                            <div className="w-1/2">
                                <label htmlFor="product-rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Rating (0-5)
                                </label>
                                <input
                                    id="product-rating"
                                    type="number"
                                    placeholder="Rating (0-5)"
                                    value={productData.rating}
                                    onChange={handleChange}
                                    className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                    min="0"
                                    max="5"
                                />
                            </div>
                            <div className="w-1/2 flex items-center mt-2">
                                <label htmlFor="product-isNewArrival" className="flex items-center cursor-pointer">
                                    <input
                                        id="product-isNewArrival"
                                        name="isNewArrival"
                                        type="checkbox"
                                        checked={productData.isNewArrival}
                                        onChange={handleChange}
                                        className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:checked:bg-blue-600 dark:checked:border-transparent"
                                    />
                                    <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">New Arrival</span>
                                </label>
                            </div>
                        </div>

                        {/* Slug */}
                        <div className="my-4">
                            <label htmlFor="product-slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Product Slug
                            </label>
                            <input
                                id="product-slug"
                                type="text"
                                placeholder="Product Slug (e.g., product-name-123)"
                                value={productData.slug}
                                onChange={handleChange}
                                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 focus:outline-none dark:text-gray-100"
                                required
                            />
                        </div>

                        {/* Image Upload */}
                        <input
                            type="file"
                            hidden
                            ref={imageInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        <div
                            className="
                                mt-6 h-48 cursor-pointer rounded-xl border-2 border-dashed
                                border-gray-400 dark:border-gray-600 flex items-center justify-center
                            "
                            onClick={() => imageInputRef.current.click()}
                        >
                            {productData.thumbnailFile || productData.thumbnailUrl ? (
                                <img
                                    src={productData.thumbnailFile ? URL.createObjectURL(productData.thumbnailFile) : productData.thumbnailUrl}
                                    alt="Uploaded Product"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div className="text-center">
                                    <BiImageAdd
                                        className="mx-auto text-5xl text-blue-600 dark:text-blue-400"
                                    />
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        Drop your image here or{" "}
                                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                                            browse
                                        </span>
                                    </p>
                                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                                        JPG, PNG and GIF images are allowed
                                    </p>
                                </div>
                            )}
                        </div>
                        {isUploadingImage && <p className="text-sm text-blue-500 mt-2 text-center">Uploading image to Cloudinary...</p>}

                        {/* Status Message */}
                        {statusMessage.text && (
                            <p
                                className={`mb-4 text-sm mt-4 text-center ${
                                    statusMessage.type === "success"
                                        ? "text-green-600 dark:text-green-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {statusMessage.text}
                            </p>
                        )}

                        {/* Submit Button */}
                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={isLoading || isUploadingImage}
                                className={`
                                    rounded-full bg-blue-600 px-6 py-2 text-white
                                    transition-colors
                                    ${
                                        isLoading || isUploadingImage
                                            ? "opacity-50 cursor-not-allowed"
                                            : "hover:bg-blue-700"
                                    }
                                `}
                            >
                                {isLoading ? "Submitting..." : (isUploadingImage ? "Uploading Image..." : "Add Product")}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;