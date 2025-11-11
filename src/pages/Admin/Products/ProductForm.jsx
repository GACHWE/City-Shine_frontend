// import React, { useRef, useState, useEffect } from "react";
// import axios from "axios";
// import { ImagePlus, X, Star } from "lucide-react";
// import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

// const ProductForm = ({
//   open,
//   handleClose,
//   onProductAction,
//   product = null,
// }) => {
//   const [fetchedCategories, setFetchedCategories] = useState([]);
//   const [productData, setProductData] = useState({
//     name: "",
//     description: "",
//     categoryId: "",
//     categoryTypeId: "",
//     tags: [],
//     brand: "",
//     price: "",
//     discount: "",
//     rating: 0,
//     newArrival: false,
//     slug: "",
//   });
//   const [variant, setVariant] = useState({
//     color: "",
//     conditionStatus: "NEW",
//     stockQuantity: 0,
//     id: null,
//   });
//   const [images, setImages] = useState([]);
//   const [newImages, setNewImages] = useState([]);
//   const [isUploadingImage, setIsUploadingImage] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

//   const imageInputRef = useRef(null);

//   // Function to upload image to backend
//   const uploadImageToBackend = async (file) => {
//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       const response = await axios.post(
//         `${API_BASE_URL}/api/files/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             ...getHeaders(),
//           },
//           timeout: 30000,
//         }
//       );

//       if (response.data.url) {
//         return response.data.url;
//       } else {
//         throw new Error(response.data.error || "Upload failed");
//       }
//     } catch (err) {
//       console.error("Backend upload failed:", err);

//       if (err.response?.status === 400) {
//         setStatusMessage({
//           type: "error",
//           text: err.response.data.error || "Invalid file",
//         });
//       } else if (err.response?.status === 413) {
//         setStatusMessage({
//           type: "error",
//           text: "File too large. Maximum size is 10MB.",
//         });
//       } else if (err.code === "ECONNABORTED") {
//         setStatusMessage({
//           type: "error",
//           text: "Upload timeout. Please try again.",
//         });
//       } else {
//         setStatusMessage({
//           type: "error",
//           text: "Image upload failed. Please try again.",
//         });
//       }

//       return null;
//     }
//   };

//   // Fetches categories on component mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await axios.get(
//           `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`,
//           { headers: getHeaders() }
//         );
//         setFetchedCategories(response.data);
//       } catch (err) {
//         setStatusMessage({ type: "error", text: "Failed to load categories." });
//       }
//     };
//     fetchCategories();
//   }, []);

//   // Populates form data when the modal opens or product prop changes
//   useEffect(() => {
//     if (open) {
//       setProductData({
//         name: product?.name || "",
//         description: product?.description || "",
//         categoryId: product?.categoryId || "",
//         categoryTypeId: product?.categoryTypeId || "",
//         tags: product?.tags || [],
//         brand: product?.brand || "",
//         price: product?.price || "",
//         discount: product?.discount || "",
//         rating: product?.rating || 0,
//         newArrival: product?.newArrival || false,
//         slug: product?.slug || "",
//       });

//       // Set single variant - take the first variant if exists, otherwise use default
//       const firstVariant = product?.variants?.[0];
//       setVariant(
//         firstVariant
//           ? {
//               color: firstVariant.color || "",
//               conditionStatus: firstVariant.conditionStatus || "NEW",
//               stockQuantity: firstVariant.stockQuantity || 0,
//               id: firstVariant.id || null,
//             }
//           : {
//               color: "",
//               conditionStatus: "NEW",
//               stockQuantity: 0,
//               id: null,
//             }
//       );

//       setImages(product?.productResources || []);
//       setNewImages([]);
//       setStatusMessage({ type: "", text: "" });

//       if (imageInputRef.current) imageInputRef.current.value = "";
//     }
//   }, [open, product]);

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { id, name, value, type, checked } = e.target;
//     const fieldName = id.startsWith("product-")
//       ? id.replace("product-", "")
//       : name;
//     setProductData((prev) => ({
//       ...prev,
//       [fieldName]: type === "checkbox" ? checked : value,
//     }));
//   };

//   // Handle image file selection
//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);

//     // Validate file types
//     const validFiles = files.filter((file) =>
//       ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
//     );

//     if (validFiles.length !== files.length) {
//       setStatusMessage({
//         type: "error",
//         text: "Some files were skipped. Only images are allowed.",
//       });
//     }

//     setNewImages((prev) => [...prev, ...validFiles]);
//   };

//   // Handle changes to variant fields
//   const handleVariantChange = (field, value) => {
//     setVariant((prev) => ({ ...prev, [field]: value }));
//   };

//   // Remove an image from the preview
//   const removeImage = (index, isNew = false) => {
//     if (isNew) {
//       setNewImages((prev) => prev.filter((_, i) => i !== index));
//     } else {
//       setImages((prev) => prev.filter((_, i) => i !== index));
//     }
//   };

//   // Handle tag input
//   const handleTagsChange = (e) => {
//     if (e.key === "Enter" && e.target.value) {
//       e.preventDefault();
//       const newTag = e.target.value.trim().toLowerCase();
//       if (newTag && !productData.tags.includes(newTag)) {
//         setProductData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
//       }
//       e.target.value = "";
//     }
//   };

//   // Remove a tag
//   const removeTag = (tagToRemove) => {
//     setProductData((prev) => ({
//       ...prev,
//       tags: prev.tags.filter((tag) => tag !== tagToRemove),
//     }));
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setStatusMessage({ type: "", text: "" });

//     // Validation
//     if (
//       !productData.name ||
//       !productData.slug ||
//       !productData.description ||
//       !productData.categoryId ||
//       !productData.price
//     ) {
//       setStatusMessage({
//         type: "error",
//         text: "Please fill all required fields.",
//       });
//       setIsLoading(false);
//       return;
//     }

//     // Single variant validation
//     if (!variant.color) {
//       setStatusMessage({
//         type: "error",
//         text: "Fill in the color variant field.",
//       });
//       setIsLoading(false);
//       return;
//     }

//     setIsUploadingImage(true);
//     const uploadedImageUrls = await Promise.all(
//       newImages.map(uploadImageToBackend)
//     );
//     setIsUploadingImage(false);

//     const successfulUploads = uploadedImageUrls.filter((url) => url !== null);

//     if (newImages.length > 0 && successfulUploads.length === 0) {
//       setStatusMessage({
//         type: "error",
//         text: "All image uploads failed. Please try again.",
//       });
//       setIsLoading(false);
//       return;
//     }

//     const allResources = [
//       ...images.map((res, idx) => ({
//         id: res.id || null,
//         name: res.name || `existing_image_${idx}`,
//         url: res.url,
//         type: res.type || "image",
//         isPrimary: idx === 0,
//       })),
//       ...successfulUploads.map((url, idx) => ({
//         id: null,
//         name: `uploaded_image_${idx}`,
//         url,
//         type: "image",
//         isPrimary: images.length === 0 && idx === 0,
//       })),
//     ];

//     if (!allResources.length) {
//       setStatusMessage({
//         type: "error",
//         text: "Please upload at least one product image.",
//       });
//       setIsLoading(false);
//       return;
//     }

//     const payload = {
//       id: product?.id || null,
//       ...productData,
//       price: parseFloat(productData.price),
//       discount: parseFloat(productData.discount) || 0,
//       rating: parseInt(productData.rating) || 0,
//       variants: [
//         {
//           color: variant.color,
//           conditionStatus: variant.conditionStatus,
//           stockQuantity: parseInt(variant.stockQuantity, 10),
//         },
//       ],
//       productResources: allResources,
//     };

//     try {
//       const isEditing = !!product?.id;
//       const url = isEditing
//         ? `${API_BASE_URL}${API_URLS.GET_PRODUCTS}/${product.id}`
//         : `${API_BASE_URL}${API_URLS.GET_PRODUCTS}`;
//       const method = isEditing ? axios.put : axios.post;
//       await method(url, payload, {
//         headers: { "Content-Type": "application/json", ...getHeaders() },
//       });

//       setStatusMessage({
//         type: "success",
//         text: `Product ${isEditing ? "updated" : "added"}!`,
//       });
//       handleClose();
//       onProductAction?.();
//     } catch (err) {
//       setStatusMessage({
//         type: "error",
//         text: err.response?.data?.message || "Error submitting product.",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   if (!open) return null;

//   return (
//     <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center overflow-y-auto font-inter">
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl mx-auto m-4 flex flex-col">
//         {/* Sticky Header */}
//         <div className="flex justify-between items-center  pb-2 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
//           <h3 className="text-lg md:text-xl font-semibold text-gray-900 dark:text-gray-100">
//             {product ? "Edit Product" : "Add New Product"}
//           </h3>
//           <button
//             type="button"
//             onClick={handleClose}
//             className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//           >
//             <X className="h-6 w-6" />
//           </button>
//         </div>

//         {/* Form Content */}
//         <form
//           onSubmit={handleSubmit}
//           className="p-4 pt-96 space-y-6 overflow-y-auto"
//         >
//           {/* General Information Section */}
//           <div className="space-y-4">
//             <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
//               General Information
//             </h4>
//             {/* Name */}
//             <div>
//               <label
//                 htmlFor="product-name"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Product Name *
//               </label>
//               <input
//                 id="product-name"
//                 type="text"
//                 value={productData.name}
//                 onChange={handleChange}
//                 placeholder="Product Name"
//                 className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 required
//               />
//             </div>
//             {/* Slug */}
//             <div>
//               <label
//                 htmlFor="product-slug"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Product Slug *
//               </label>
//               <input
//                 id="product-slug"
//                 type="text"
//                 value={productData.slug}
//                 onChange={handleChange}
//                 placeholder="e.g., elegant-blue-handbag"
//                 className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 required
//               />
//             </div>
//             {/* Description */}
//             <div>
//               <label
//                 htmlFor="product-description"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Product Description *
//               </label>
//               <textarea
//                 id="product-description"
//                 rows={4}
//                 value={productData.description}
//                 onChange={handleChange}
//                 placeholder="Product Description"
//                 className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 required
//               />
//             </div>
//             {/* Category */}
//             <div>
//               <label
//                 htmlFor="product-categoryId"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Category *
//               </label>
//               <select
//                 id="product-categoryId"
//                 value={productData.categoryId}
//                 onChange={handleChange}
//                 className="w-full rounded-md dark:bg-gray-800 border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 required
//               >
//                 <option value="" disabled>
//                   Select a Category
//                 </option>
//                 {fetchedCategories.map((cat) => (
//                   <option key={cat.id} value={cat.id}>
//                     {cat.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             {/* Brand & Rating */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="product-brand"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Brand
//                 </label>
//                 <input
//                   id="product-brand"
//                   type="text"
//                   value={productData.brand}
//                   onChange={handleChange}
//                   placeholder="Brand Name"
//                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Rating
//                 </label>
//                 <div className="flex items-center gap-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <Star
//                       key={star}
//                       className={`cursor-pointer transition-colors h-5 w-5 ${
//                         star <= productData.rating
//                           ? "text-yellow-400 fill-current"
//                           : "text-gray-300 dark:text-gray-600"
//                       }`}
//                       onClick={() =>
//                         setProductData((prev) => ({ ...prev, rating: star }))
//                       }
//                     />
//                   ))}
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Pricing Section */}
//           <div className="space-y-4">
//             <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
//               Pricing & Details
//             </h4>
//             {/* Price & Discount */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="product-price"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Price *
//                 </label>
//                 <input
//                   id="product-price"
//                   type="number"
//                   value={productData.price}
//                   onChange={handleChange}
//                   placeholder="Price"
//                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                   required
//                 />
//               </div>
//               <div>
//                 <label
//                   htmlFor="product-discount"
//                   className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//                 >
//                   Discount (%)
//                 </label>
//                 <input
//                   id="product-discount"
//                   type="number"
//                   value={productData.discount}
//                   onChange={handleChange}
//                   placeholder="Discount"
//                   min="0"
//                   max="100"
//                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//                 />
//               </div>
//             </div>
//             {/* Tags Input */}
//             <div>
//               <label
//                 htmlFor="product-tags"
//                 className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
//               >
//                 Tags
//               </label>
//               <input
//                 id="product-tags"
//                 type="text"
//                 onKeyDown={handleTagsChange}
//                 placeholder="Press Enter to add tags"
//                 className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
//               />
//               <div className="mt-2 flex flex-wrap gap-2">
//                 {productData.tags.map((tag) => (
//                   <div
//                     key={tag}
//                     className="flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
//                   >
//                     <span>{tag}</span>
//                     <button
//                       type="button"
//                       onClick={() => removeTag(tag)}
//                       className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
//                     >
//                       <X size={12} />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             {/* New Arrival Checkbox */}
//             <div className="flex items-center gap-2">
//               <input
//                 id="product-newArrival"
//                 type="checkbox"
//                 checked={productData.newArrival || false}
//                 onChange={(e) =>
//                   setProductData({
//                     ...productData,
//                     newArrival: e.target.checked,
//                   })
//                 }
//                 className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
//               />
//               <label
//                 htmlFor="product-newArrival"
//                 className="text-sm font-medium text-gray-700 dark:text-gray-300"
//               >
//                 Is this a new arrival?
//               </label>
//             </div>
//           </div>

//           {/* Single Variant Section */}
//           <div className="space-y-4">
//             <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
//               Product Variant
//             </h4>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 border rounded-lg dark:border-gray-700">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Color *
//                 </label>
//                 <input
//                   type="text"
//                   value={variant.color}
//                   onChange={(e) => handleVariantChange("color", e.target.value)}
//                   placeholder="Color"
//                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100"
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Stock Quantity *
//                 </label>
//                 <input
//                   type="number"
//                   value={variant.stockQuantity}
//                   onChange={(e) => {
//                     const value = e.target.value;

//                     // Handle empty input
//                     if (value === "") {
//                       handleVariantChange("stockQuantity", 0);
//                       return;
//                     }

//                     // Parse as integer
//                     const parsedValue = parseInt(value, 10);

//                     // Allow 0 and positive numbers, default to 0 for invalid values
//                     if (!isNaN(parsedValue) && parsedValue >= 0) {
//                       handleVariantChange("stockQuantity", parsedValue);
//                     } else {
//                       handleVariantChange("stockQuantity", 0);
//                     }
//                   }}
//                   min="0"
//                   placeholder="0"
//                   className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100"
//                   required
//                 />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Enter 0 for out of stock items
//                 </p>
//               </div>{" "}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                   Condition *
//                 </label>
//                 <select
//                   value={variant.conditionStatus}
//                   onChange={(e) =>
//                     handleVariantChange("conditionStatus", e.target.value)
//                   }
//                   className="w-full rounded-md dark:bg-gray-800 border border-gray-300 dark:border-gray-600 bg-transparent p-2 text-sm focus:border-blue-500 dark:text-gray-100"
//                   required
//                 >
//                   <option value="NEW">New</option>
//                   <option value="USED">Used</option>
//                   <option value="REFURBISHED">Refurbished</option>
//                 </select>
//               </div>
//             </div>
//           </div>

//           {/* Images Section */}
//           <div className="space-y-4">
//             <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
//               Product Images *
//             </h4>
//             <input
//               type="file"
//               hidden
//               ref={imageInputRef}
//               onChange={handleImageChange}
//               accept="image/*"
//               multiple
//             />
//             <div className="overflow-x-auto flex gap-4 p-2 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl">
//               {images.map((img, i) => (
//                 <div
//                   key={i}
//                   className="relative flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
//                 >
//                   <img
//                     src={img.url}
//                     alt=""
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(i)}
//                     className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               {newImages.map((file, i) => (
//                 <div
//                   key={i}
//                   className="relative flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
//                 >
//                   <img
//                     src={URL.createObjectURL(file)}
//                     alt=""
//                     className="w-full h-full object-cover"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeImage(i, true)}
//                     className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-700 hover:bg-gray-100 transition-colors"
//                   >
//                     <X className="w-4 h-4" />
//                   </button>
//                 </div>
//               ))}
//               <div
//                 onClick={() => imageInputRef.current.click()}
//                 className="flex flex-col items-center justify-center flex-shrink-0 w-28 h-28 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//               >
//                 <ImagePlus className="text-3xl text-blue-600 dark:text-blue-400" />
//                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                   Add Image
//                 </p>
//               </div>
//             </div>
//             <p className="text-xs text-gray-500 dark:text-gray-400">
//               Supported formats: JPEG, PNG, GIF, WEBP. Max size: 10MB
//             </p>
//           </div>

//           {/* Status & Submit */}
//           {statusMessage.text && (
//             <div className="py-2 text-center text-sm font-medium">
//               <p
//                 className={
//                   statusMessage.type === "success"
//                     ? "text-green-600"
//                     : "text-red-600"
//                 }
//               >
//                 {statusMessage.text}
//               </p>
//             </div>
//           )}
//           <div className="flex justify-end pt-4">
//             <button
//               type="submit"
//               disabled={isLoading || isUploadingImage}
//               className="rounded-full bg-blue-600 px-6 py-2 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-opacity"
//             >
//               {isLoading
//                 ? "Submitting..."
//                 : isUploadingImage
//                 ? "Uploading..."
//                 : product
//                 ? "Save Changes"
//                 : "Add Product"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default ProductForm;
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { ImagePlus, X, Star } from "lucide-react";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const ProductForm = ({
  open,
  handleClose,
  onProductAction,
  product = null,
}) => {
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
    newArrival: false,
    slug: "",
  });
  const [variant, setVariant] = useState({
    color: "",
    conditionStatus: "NEW",
    stockQuantity: 0,
    id: null,
  });
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  const imageInputRef = useRef(null);

  // Function to upload image to backend
  const uploadImageToBackend = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/files/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            ...getHeaders(),
          },
          timeout: 30000,
        }
      );

      if (response.data.url) {
        return response.data.url;
      } else {
        throw new Error(response.data.error || "Upload failed");
      }
    } catch (err) {
      console.error("Backend upload failed:", err);

      if (err.response?.status === 400) {
        setStatusMessage({
          type: "error",
          text: err.response.data.error || "Invalid file",
        });
      } else if (err.response?.status === 413) {
        setStatusMessage({
          type: "error",
          text: "File too large. Maximum size is 10MB.",
        });
      } else if (err.code === "ECONNABORTED") {
        setStatusMessage({
          type: "error",
          text: "Upload timeout. Please try again.",
        });
      } else {
        setStatusMessage({
          type: "error",
          text: "Image upload failed. Please try again.",
        });
      }

      return null;
    }
  };

  // Fetches categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`,
          { headers: getHeaders() }
        );
        setFetchedCategories(response.data);
      } catch (err) {
        setStatusMessage({ type: "error", text: "Failed to load categories." });
      }
    };
    fetchCategories();
  }, []);

  // Populates form data when the modal opens or product prop changes
  useEffect(() => {
    if (open) {
      setProductData({
        name: product?.name || "",
        description: product?.description || "",
        categoryId: product?.categoryId || "",
        categoryTypeId: product?.categoryTypeId || "",
        tags: product?.tags || [],
        brand: product?.brand || "",
        price: product?.price || "",
        discount: product?.discount || "",
        rating: product?.rating || 0,
        newArrival: product?.newArrival || false,
        slug: product?.slug || "",
      });

      // Set single variant - take the first variant if exists, otherwise use default
      const firstVariant = product?.variants?.[0];
      setVariant(
        firstVariant
          ? {
              color: firstVariant.color || "",
              conditionStatus: firstVariant.conditionStatus || "NEW",
              stockQuantity: firstVariant.stockQuantity || 0,
              id: firstVariant.id || null,
            }
          : {
              color: "",
              conditionStatus: "NEW",
              stockQuantity: 0,
              id: null,
            }
      );

      setImages(product?.productResources || []);
      setNewImages([]);
      setStatusMessage({ type: "", text: "" });

      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  }, [open, product]);

  // Handle form field changes
  const handleChange = (e) => {
    const { id, name, value, type, checked } = e.target;
    const fieldName = id.startsWith("product-")
      ? id.replace("product-", "")
      : name;
    setProductData((prev) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Validate file types
    const validFiles = files.filter((file) =>
      ["image/jpeg", "image/png", "image/gif", "image/webp"].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      setStatusMessage({
        type: "error",
        text: "Some files were skipped. Only images are allowed.",
      });
    }

    setNewImages((prev) => [...prev, ...validFiles]);
  };

  // Handle changes to variant fields
  const handleVariantChange = (field, value) => {
    setVariant((prev) => ({ ...prev, [field]: value }));
  };

  // Remove an image from the preview
  const removeImage = (index, isNew = false) => {
    if (isNew) {
      setNewImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle tag input
  const handleTagsChange = (e) => {
    if (e.key === "Enter" && e.target.value) {
      e.preventDefault();
      const newTag = e.target.value.trim().toLowerCase();
      if (newTag && !productData.tags.includes(newTag)) {
        setProductData((prev) => ({ ...prev, tags: [...prev.tags, newTag] }));
      }
      e.target.value = "";
    }
  };

  // Remove a tag
  const removeTag = (tagToRemove) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage({ type: "", text: "" });

    // Validation
    if (
      !productData.name ||
      !productData.slug ||
      !productData.description ||
      !productData.categoryId ||
      !productData.price
    ) {
      setStatusMessage({
        type: "error",
        text: "Please fill all required fields.",
      });
      setIsLoading(false);
      return;
    }

    // Single variant validation
    if (!variant.color) {
      setStatusMessage({
        type: "error",
        text: "Fill in the color variant field.",
      });
      setIsLoading(false);
      return;
    }

    setIsUploadingImage(true);
    const uploadedImageUrls = await Promise.all(
      newImages.map(uploadImageToBackend)
    );
    setIsUploadingImage(false);

    const successfulUploads = uploadedImageUrls.filter((url) => url !== null);

    if (newImages.length > 0 && successfulUploads.length === 0) {
      setStatusMessage({
        type: "error",
        text: "All image uploads failed. Please try again.",
      });
      setIsLoading(false);
      return;
    }

    const allResources = [
      ...images.map((res, idx) => ({
        id: res.id || null,
        name: res.name || `existing_image_${idx}`,
        url: res.url,
        type: res.type || "image",
        isPrimary: idx === 0,
      })),
      ...successfulUploads.map((url, idx) => ({
        id: null,
        name: `uploaded_image_${idx}`,
        url,
        type: "image",
        isPrimary: images.length === 0 && idx === 0,
      })),
    ];

    if (!allResources.length) {
      setStatusMessage({
        type: "error",
        text: "Please upload at least one product image.",
      });
      setIsLoading(false);
      return;
    }

    const payload = {
      id: product?.id || null,
      ...productData,
      price: parseFloat(productData.price),
      discount: parseFloat(productData.discount) || 0,
      rating: parseInt(productData.rating) || 0,
      variants: [
        {
          color: variant.color,
          conditionStatus: variant.conditionStatus,
          stockQuantity: parseInt(variant.stockQuantity, 10),
        },
      ],
      productResources: allResources,
    };

    try {
      const isEditing = !!product?.id;
      const url = isEditing
        ? `${API_BASE_URL}${API_URLS.GET_PRODUCTS}/${product.id}`
        : `${API_BASE_URL}${API_URLS.GET_PRODUCTS}`;
      const method = isEditing ? axios.put : axios.post;
      await method(url, payload, {
        headers: { "Content-Type": "application/json", ...getHeaders() },
      });

      setStatusMessage({
        type: "success",
        text: `Product ${isEditing ? "updated" : "added"}!`,
      });
      handleClose();
      onProductAction?.();
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.message || "Error submitting product.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4 overflow-y-auto font-inter">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl lg:max-w-4xl mx-auto my-4 flex flex-col max-h-[95vh]">
        {/* Sticky Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 pb-2 sm:pb-3 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
            {product ? "Edit Product" : "Add New Product"}
          </h3>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100 p-1 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form
          onSubmit={handleSubmit}
          className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1"
        >
          {/* General Information Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              General Information
            </h4>
            
            {/* Name */}
            <div>
              <label
                htmlFor="product-name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Name *
              </label>
              <input
                id="product-name"
                type="text"
                value={productData.name}
                onChange={handleChange}
                placeholder="Product Name"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label
                htmlFor="product-slug"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Slug *
              </label>
              <input
                id="product-slug"
                type="text"
                value={productData.slug}
                onChange={handleChange}
                placeholder="e.g., elegant-blue-handbag"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="product-description"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Product Description *
              </label>
              <textarea
                id="product-description"
                rows={3}
                value={productData.description}
                onChange={handleChange}
                placeholder="Product Description"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="product-categoryId"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Category *
              </label>
              <select
                id="product-categoryId"
                value={productData.categoryId}
                onChange={handleChange}
                className="w-full rounded-md dark:bg-gray-800 border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                required
              >
                <option value="" disabled>
                  Select a Category
                </option>
                {fetchedCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="product-brand"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Brand
                </label>
                <input
                  id="product-brand"
                  type="text"
                  value={productData.brand}
                  onChange={handleChange}
                  placeholder="Brand Name"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`cursor-pointer transition-colors h-4 w-4 sm:h-5 sm:w-5 ${
                        star <= productData.rating
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                      onClick={() =>
                        setProductData((prev) => ({ ...prev, rating: star }))
                      }
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Pricing & Details
            </h4>
            
            {/* Price & Discount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label
                  htmlFor="product-price"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Price *
                </label>
                <input
                  id="product-price"
                  type="number"
                  value={productData.price}
                  onChange={handleChange}
                  placeholder="Price"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="product-discount"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Discount (%)
                </label>
                <input
                  id="product-discount"
                  type="number"
                  value={productData.discount}
                  onChange={handleChange}
                  placeholder="Discount"
                  min="0"
                  max="100"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
                />
              </div>
            </div>

            {/* Tags Input */}
            <div>
              <label
                htmlFor="product-tags"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Tags
              </label>
              <input
                id="product-tags"
                type="text"
                onKeyDown={handleTagsChange}
                placeholder="Press Enter to add tags"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100 transition-colors"
              />
              <div className="mt-2 flex flex-wrap gap-1 sm:gap-2">
                {productData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-1 rounded-full bg-gray-200 dark:bg-gray-700 px-2 sm:px-3 py-1 text-xs font-medium text-gray-800 dark:text-gray-200"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* New Arrival Checkbox */}
            <div className="flex items-center gap-2">
              <input
                id="product-newArrival"
                type="checkbox"
                checked={productData.newArrival || false}
                onChange={(e) =>
                  setProductData({
                    ...productData,
                    newArrival: e.target.checked,
                  })
                }
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="product-newArrival"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Is this a new arrival?
              </label>
            </div>
          </div>

          {/* Single Variant Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Product Variant
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg dark:border-gray-700">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color *
                </label>
                <input
                  type="text"
                  value={variant.color}
                  onChange={(e) => handleVariantChange("color", e.target.value)}
                  placeholder="Color"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={variant.stockQuantity}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      handleVariantChange("stockQuantity", 0);
                      return;
                    }
                    const parsedValue = parseInt(value, 10);
                    if (!isNaN(parsedValue) && parsedValue >= 0) {
                      handleVariantChange("stockQuantity", parsedValue);
                    } else {
                      handleVariantChange("stockQuantity", 0);
                    }
                  }}
                  min="0"
                  placeholder="0"
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter 0 for out of stock items
                </p>
              </div>
              <div className="sm:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Condition *
                </label>
                <select
                  value={variant.conditionStatus}
                  onChange={(e) =>
                    handleVariantChange("conditionStatus", e.target.value)
                  }
                  className="w-full rounded-md dark:bg-gray-800 border border-gray-300 dark:border-gray-600 bg-transparent p-2 sm:p-3 text-sm focus:border-blue-500 dark:text-gray-100"
                  required
                >
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                  <option value="REFURBISHED">Refurbished</option>
                </select>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
              Product Images *
            </h4>
            <input
              type="file"
              hidden
              ref={imageInputRef}
              onChange={handleImageChange}
              accept="image/*"
              multiple
            />
            <div className="overflow-x-auto flex gap-3 p-2 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-xl">
              {images.map((img, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 sm:p-1 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
              {newImages.map((file, i) => (
                <div
                  key={i}
                  className="relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(i, true)}
                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 sm:p-1 text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              ))}
              <div
                onClick={() => imageInputRef.current.click()}
                className="flex flex-col items-center justify-center flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-lg border-2 border-dashed border-gray-400 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <ImagePlus className="text-xl sm:text-2xl lg:text-3xl text-blue-600 dark:text-blue-400" />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center px-1">
                  Add Image
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Supported formats: JPEG, PNG, GIF, WEBP. Max size: 10MB
            </p>
          </div>

          {/* Status & Submit */}
          {statusMessage.text && (
            <div className="py-2 text-center text-sm font-medium">
              <p
                className={
                  statusMessage.type === "success"
                    ? "text-green-600"
                    : "text-red-600"
                }
              >
                {statusMessage.text}
              </p>
            </div>
          )}
          <div className="flex justify-end pt-3 sm:pt-4">
            <button
              type="submit"
              disabled={isLoading || isUploadingImage}
              className="rounded-full bg-blue-600 px-4 sm:px-6 py-2 sm:py-2.5 text-white font-medium hover:bg-blue-700 disabled:opacity-50 transition-opacity text-sm sm:text-base w-full sm:w-auto"
            >
              {isLoading
                ? "Submitting..."
                : isUploadingImage
                ? "Uploading..."
                : product
                ? "Save Changes"
                : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;