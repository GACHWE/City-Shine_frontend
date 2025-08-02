// src/pages/ShopApplicationWrapper.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "../store/features/category";
import { getAllCategories } from "../api/fetchCategories"; // This function now manages its own loading state
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Spinner from "../components/Spinner/Spinner";

const ShopApplicationWrapper = () => {
  const dispatch = useDispatch();
  const globalLoading = useSelector((state) => state?.commonState?.loading);
  const commonError = useSelector((state) => state?.commonState?.error); // To display global errors

  useEffect(() => {
    // getAllCategories now handles dispatching setLoading internally
    getAllCategories()
      .then((data) => {
        // Only load categories if data is returned and not null/undefined (e.g., from an error path)
        if (data) {
            dispatch(loadCategories(data));
        } else {
            console.warn("getAllCategories returned no data. Redux category state remains as is.");
        }
      })
      .catch((err) => {
        // The error has already been logged and potentially set in commonState by getAllCategories
        console.error("Caught error in ShopApplicationWrapper useEffect (already handled by getAllCategories):", err);
      });
  }, [dispatch]);

  return (
    <div>
      <Navigation />
      <main> {/* Use a main tag for semantic structure */}
        {commonError && ( // Display global error if set
            <div className="flex justify-center items-center py-4 text-red-500">
                <p>{commonError}</p>
            </div>
        )}
        {globalLoading && !commonError && <Spinner />} {/* Show spinner only if loading and no error */}
        <Outlet />
      </main>
    </div>
  );
};
export default ShopApplicationWrapper;