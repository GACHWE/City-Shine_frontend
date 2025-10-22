import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../api/constant";
import ProductCard from "../../pages/ProductListPage/ProductCard";
import Carousel from "../common/Carousel";

const NewArrivals = () => {
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/products`);
        const filtered = response.data.products.filter((products) => products.newArrival === true);
        setNewArrivals(filtered);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <div className="text-center py-6 text-gray-500 dark:text-gray-400">Loading new arrivals...</div>;
  if (newArrivals.length === 0) return <div className="text-center py-6 text-gray-400 dark:text-gray-500">No new arrivals at the moment.</div>;

  return (
    <section  className="px-4 py-6  transition-colors duration-300">
      <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-gray-100">New Arrivals</h2>
      <Carousel items={newArrivals} renderItem={(product) => <ProductCard product={product} />} />
    </section>
  );
};

export default NewArrivals;
