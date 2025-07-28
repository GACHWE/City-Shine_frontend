// import React from 'react';
// import SectionHeading from './SectionsHeading/SectionHeading';
// import Card from '../Card/Card';

// import Jeans from '../../assets/img/jeans.jpg';
// import Shirts from '../../assets/img/shirts.jpg';
// import Tshirt from '../../assets/img/tshirts.jpeg';
// import Dresses from '../../assets/img/dresses.jpg';
// import Joggers from '../../assets/img/joggers.jpg';
// import Kurtis from '../../assets/img/kurtis.jpg';

// import Carousel from 'react-multi-carousel';
// import { responsive } from '../../utils/Section.constants';
// import './NewArrivals.css';

// const items = [
//   { title: 'Jeans', imagePath: Jeans },
//   { title: 'Shirts', imagePath: Shirts },
//   { title: 'T-Shirts', imagePath: Tshirt },
//   { title: 'Dresses', imagePath: Dresses },
//   { title: 'Joggers', imagePath: Joggers },
//   { title: 'Kurtis', imagePath: Kurtis }
// ];

// const NewArrivals = () => {
//   return (
//     <>
//       <SectionHeading title="New Arrivals" />
//       <Carousel
//         responsive={responsive}
//         autoPlay={false}
//         swipeable={true}
//         draggable={false}
//         showDots={false}
//         infinite={false}
//         partialVisible={false}
//         itemClass="react-slider-custom-item"
//         className="px-8"
//       >
//         {items.map((item, index) => (
//           <Card key={item.title + index} title={item.title} imagePath={item.imagePath} />
//         ))}
//       </Carousel>
//     </>
//   );
// };

// export default NewArrivals;

import React, { useEffect, useState } from 'react';
import SectionHeading from './SectionsHeading/SectionHeading';
// Adjust this import path if your ProductCard component is located elsewhere
// import ProductCard from '../ProductListPage/ProductCard';

import Carousel from 'react-multi-carousel';
import { responsive } from '../../utils/Section.constants';
import './NewArrivals.css'; // Your existing styles
import ProductCard from '../../pages/ProductListPage/ProductCard';

// ----------------------------------------------------------------------
// IMPORTANT: This is DUMMY DATA for testing the ProductCard linking on the home page.
// In a real application, you would fetch this data from your backend API
// (e.g., a dedicated endpoint for "new arrivals" or a filtered list of recent products).
const DUMMY_NEW_ARRIVALS = [
    {
        id: 'new-prod-1',
        name: 'Classic Blue Jeans', // Used for the displayed title
        slug: 'classic-blue-jeans-501', // This is CRUCIAL for the Link to work
        description: 'Comfortable and stylish blue jeans.',
        price: 49.99,
        discount: 0,
        rating: 4.5,
        brand: 'DenimCo',
        thumbnail: 'https://images.unsplash.com/photo-1541099644-4861219b661d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', // Example image URL
        productResources: [ // Minimal structure for images if ProductDetails needs it
            { url: 'https://images.unsplash.com/photo-1541099644-4861219b661d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
        ]
    },
    {
        id: 'new-prod-2',
        name: 'Elegant Summer Dress',
        slug: 'elegant-summer-dress-floral',
        description: 'Light and airy floral dress for summer.',
        price: 75.00,
        discount: 10,
        rating: 4.8,
        brand: 'ChicWear',
        thumbnail: 'https://images.unsplash.com/photo-1596752009289-49c4dd0860ac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        productResources: [
            { url: 'https://images.unsplash.com/photo-1596752009289-49c4dd0860ac?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
        ]
    },
    {
        id: 'new-prod-3',
        name: 'Comfort Fit T-Shirt',
        slug: 'comfort-fit-tshirt-cotton',
        description: 'Soft cotton t-shirt for everyday wear.',
        price: 25.00,
        discount: 0,
        rating: 4.2,
        brand: 'ComfyBrand',
        thumbnail: 'https://images.unsplash.com/photo-1618677610486-ff7d853b063d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        productResources: [
            { url: 'https://images.unsplash.com/photo-1618677610486-ff7d853b063d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
        ]
    }
    // You can add more dummy products here for testing if you like
];
// ----------------------------------------------------------------------

const NewArrivals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // For this testing phase, we're using dummy data.
        // In your full application, you would replace this with an actual API call
        // to your backend to fetch new arrival products.
        // Example: fetchNewArrivalProductsFromAPI().then(data => setProducts(data));
        setProducts(DUMMY_NEW_ARRIVALS);
    }, []);

    return (
        <>
            <SectionHeading title="New Arrivals" />
            <Carousel
                responsive={responsive}
                autoPlay={false}
                swipeable={true}
                draggable={false}
                showDots={false}
                infinite={false}
                partialVisible={false}
                itemClass="react-slider-custom-item"
                className="px-8"
            >
                {products.map((item) => (
                    // Using ProductCard and spreading all item properties,
                    // including the crucial 'slug' from the DUMMY_NEW_ARRIVALS data.
                    // ProductCard expects 'title' and 'thumbnail' for display.
                    <ProductCard
                        key={item.id} // Use item.id as key
                        {...item}
                        title={item.name} // Map 'name' from dummy data to 'title' prop for ProductCard
                    />
                ))}
            </Carousel>
        </>
    );
};

export default NewArrivals;