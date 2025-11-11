
// import React, { useState, useEffect } from "react";
// import { FiPlus } from "react-icons/fi";
// import CategoryModal from "./CategoryModal";
// import Table from "../../../components/Table";
// import { categoriesColumns } from "../../../data/categoriesColumns";
// import axios from "axios";
// import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

// const ProductCategories = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [categoryToEdit, setCategoryToEdit] = useState(null);
//   const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
//   const [categories, setCategories] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const fetchCategories = async () => {
//     setIsLoading(true);
//     setError(null);
//     try {
//       const config = { headers: getHeaders() };
//       const response = await axios.get(
//         `${API_BASE_URL}${API_URLS.GET_CATEGORIES}`,
//         config
//       );
//       setCategories(response.data);
//     } catch (err) {
//       console.error("Error fetching categories:", err);
//       setError("Failed to load categories. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCategories();
//   }, []);

//   const handleAddModalOpen = () => {
//     setModalMode("add");
//     setCategoryToEdit(null);
//     setIsModalOpen(true);
//   };

//   const handleEditModalOpen = (category) => {
//     setModalMode("edit");
//     setCategoryToEdit(category);
//     setIsModalOpen(true);
//   };

//   const handleModalClose = () => {
//     setIsModalOpen(false);
//     setCategoryToEdit(null);
//   };

//   const handleCategorySuccess = (categoryData, mode) => {
//     if (mode === "add") {
//       // Add new category to the list
//       setCategories((prev) => [...prev, categoryData]);
//     } else if (mode === "edit") {
//       // Update existing category in the list
//       setCategories((prev) =>
//         prev.map((cat) => (cat.id === categoryData.id ? categoryData : cat))
//       );
//     }
    
//     // Optional: Refetch all categories to ensure data consistency
//     // fetchCategories();
//   };

//   const handleDeleteCategory = async (categoryId) => {
//     if (window.confirm("Are you sure you want to delete this category?")) {
//       try {
//         const config = { headers: getHeaders() };
//         await axios.delete(
//           `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/${categoryId}`,
//           config
//         );

//         // Remove the category from the list
//         setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
//         console.log(`Category with ID ${categoryId} deleted successfully.`);
//       } catch (error) {
//         console.error("Error deleting category:", error);
//         window.alert("Failed to delete category. Please try again.");
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="pt-20 pb-5 text-center text-gray-500 dark:text-gray-400">
//         Loading categories...
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="pt-20 pb-5 text-center text-red-500 dark:text-red-400">
//         Error: {error}
//       </div>
//     );
//   }

//   return (
//     <div className="pt-20 pb-5 ml-80">
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
//           Categories
//         </h2>

//         <button
//           className="
//             flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full
//             hover:bg-blue-700 transition-colors
//           "
//           onClick={handleAddModalOpen}
//         >
//           <FiPlus />
//           Add Category
//         </button>
//       </div>

//       {/* Single reusable modal for both add and edit */}
//       <CategoryModal
//         open={isModalOpen}
//         handleClose={handleModalClose}
//         categoryToEdit={categoryToEdit}
//         onCategorySuccess={handleCategorySuccess}
//         mode={modalMode}
//       />

//       <div className="dark:text-white text-black">
//         <Table
//           data={categories}
//           fields={categoriesColumns(handleEditModalOpen, handleDeleteCategory)}
//           numberOfRows={10}
//           enableTopToolBar={true}
//           enableBottomToolBar={true}
//           enablePagination={true}
//           enableRowSelection={false}
//           enableColumnFilters={false}
//           enableEditing={true}
//           enableColumnDragging={true}
//         />
//       </div>
//     </div>
//   );
// };

// export default ProductCategories;

import React, { useState, useEffect } from "react";
import { FiPlus } from "react-icons/fi";
import CategoryModal from "./CategoryModal";
import Table from "../../../components/Table";
import { categoriesColumns } from "../../../data/categoriesColumns";
import axios from "axios";
import { API_BASE_URL, API_URLS, getHeaders } from "../../../api/constant";

const ProductCategories = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
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
    setModalMode("add");
    setCategoryToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditModalOpen = (category) => {
    setModalMode("edit");
    setCategoryToEdit(category);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCategoryToEdit(null);
  };

  const handleCategorySuccess = (categoryData, mode) => {
    if (mode === "add") {
      setCategories((prev) => [...prev, categoryData]);
    } else if (mode === "edit") {
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryData.id ? categoryData : cat))
      );
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        const config = { headers: getHeaders() };
        await axios.delete(
          `${API_BASE_URL}${API_URLS.GET_CATEGORIES}/${categoryId}`,
          config
        );

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
    <div className="pt-20 pb-5 px-4 sm:px-6  lg:mr-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Categories
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {categories.length} categories
          </p>
        </div>

        <button
          className="
            flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-full
            hover:bg-blue-700 transition-colors text-sm sm:text-base w-full sm:w-auto justify-center
          "
          onClick={handleAddModalOpen}
        >
          <FiPlus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Category Modal */}
      <CategoryModal
        open={isModalOpen}
        handleClose={handleModalClose}
        categoryToEdit={categoryToEdit}
        onCategorySuccess={handleCategorySuccess}
        mode={modalMode}
      />

      {/* Table Section */}
      <div className="dark:text-white text-black bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[600px] xl:min-w-0">
            <Table
              data={categories}
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
      </div>
    </div>
  );
};

export default ProductCategories;