import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadCategories } from "../store/features/category";
import { getAllCategories } from "../api/fetchCategories";
import { Outlet } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import Spinner from "../components/Spinner/Spinner";

const ShopApplicationWrapper = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state?.commonState?.loading);

  useEffect(() => {
    getAllCategories()
      .then((data) => {
        dispatch(loadCategories(data));
      })
      .catch((err) => {
        console.error("Failed to load categories", err);
      });
  }, [dispatch]);

  return (
    <div>
      <Navigation />
      <Outlet />
      {isLoading && <Spinner />}
    </div>
  );
};
export default ShopApplicationWrapper;
