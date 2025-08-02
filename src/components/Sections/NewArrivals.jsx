// src/components/NewArrivals/NewArrivals.jsx
import React, { useEffect, useState, useCallback } from 'react'; // Added useCallback
import axios from 'axios'; // Import axios
import { API_BASE_URL, API_URLS } from '../../api/constant'; // Adjust path if needed
import SectionHeading from './SectionsHeading/SectionHeading';
import ProductCard from '../../pages/ProductListPage/ProductCard';

import Carousel from 'react-multi-carousel';
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css'; // Your existing styles
import Spinner from '../Spinner/Spinner';

const NewArrivals = () => {
    const [newArrivalProducts, setNewArrivalProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNewArrivals = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Fetch all products, and then filter for new arrivals.
            // OPTIMAL: If your backend has a dedicated endpoint for new arrivals
            // (e.g., /api/products?isNewArrival=true), use that for better performance.
            const response = await axios.get(`${API_BASE_URL}${API_URLS.GET_PRODUCTS}`);
            
            // Filter products where isNewArrival is true
            // Ensure your product objects from the backend have an 'isNewArrival' boolean property
            const filteredNewArrivals = response.data.filter(product => product.isNewArrival);
            
            setNewArrivalProducts(filteredNewArrivals);
        } catch (err) {
            console.error("Error fetching new arrivals:", err);
            setError("Failed to load new arrivals. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }, []); // useCallback memoizes the function, preventing infinite loops in useEffect

    useEffect(() => {
        fetchNewArrivals();
    }, [fetchNewArrivals]); // Dependency array ensures it runs when fetchNewArrivals changes (which it won't due to useCallback)

    if (isLoading) {
        return (
            <div className="py-12 text-center">
                <Spinner /> {/* Display a spinner while loading */}
                <p className="text-gray-600 dark:text-gray-400 mt-4">Loading new arrivals...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-12 text-center text-red-500">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <>
            <SectionHeading title="New Arrivals" />
            
            {newArrivalProducts.length === 0 ? (
                <p className="text-center text-gray-600 dark:text-gray-400 text-lg py-8">
                    No new arrivals found at the moment.
                </p>
            ) : (
                <Carousel
                    responsive={responsive}
                    autoPlay={false} // Consider setting to true if you want auto-play
                    swipeable={true}
                    draggable={false}
                    showDots={false}
                    infinite={false} // Set to true if you want continuous looping
                    partialVisible={false}
                    itemClass="react-slider-custom-item"
                    className="px-8"
                >
                    {newArrivalProducts.map((product) => (
                        <ProductCard
                            key={product.id} // Ensure 'id' exists on your product objects
                            product={product} // Pass the entire product object as the 'product' prop
                        />
                    ))}
                </Carousel>
            )}
        </>
    );
};

export default NewArrivals;