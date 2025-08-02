import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLoaderData, useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import Rating from '../../components/Rating/Rating';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductColors from './ProductColors'; // Assuming this component exists
import SvgCreditCard from '../../components/common/SvgCreditCard';
import SvgCloth from '../../components/common/SvgCloth';
import SvgShipping from '../../components/common/SvgShipping';
import SvgReturn from '../../components/common/SvgReturn';
import SectionHeading from '../../components/Sections/SectionsHeading/SectionHeading'; // Path might need adjustment for SectionsHeading
import ProductCard from '../ProductListPage/ProductCard'; // Ensure this path is correct
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash'; // Lodash is used here
import { getAllProducts } from '../../api/fetchProducts'; // Make sure this function is defined and correctly fetches products
import { addItemToCartAction } from '../../store/actions/cartAction';

const extraSections = [
  {
    icon: <SvgCreditCard />,
    label: 'Secure payment'
  },
  {
    icon: <SvgCloth />,
    label: 'Size & Fit'
  },
  {
    icon: <SvgShipping />,
    label: 'Free shipping'
  },
  {
    icon: <SvgReturn />,
    label: 'Free Shipping & Returns'
  }
];

const ProductDetails = () => {
  const { product } = useLoaderData(); 
  const [currentDisplayImage, setCurrentDisplayImage] = useState(''); 
  const [breadCrumbLinks, setBreadCrumbLink] = useState([]);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cartState?.cart); 
  const [similarProducts, setSimilarProducts] = useState([]); 
  const categories = useSelector((state) => state?.categoryState?.categories);
  const [selectedSize, setSelectedSize] = useState(''); 
  const [error, setError] = useState('');
  const [loadingSimilar, setLoadingSimilar] = useState(true); 
  const [similarError, setSimilarError] = useState(null); 
  // Determine the product's category
  const productCategory = useMemo(() => {
    return categories?.find((category) => category?.id === product?.categoryId);
  }, [product, categories]);

  // Fetch similar products
  useEffect(() => {
    if (!product?.categoryId) return; // Ensure categoryId exists before fetching

    setLoadingSimilar(true);
    setSimilarError(null); // Clear previous errors
    // Assuming getAllProducts can take categoryId and categoryTypeId as filters
    getAllProducts(product.categoryId, product.categoryTypeId)
      .then(res => {
        const filteredSimilarProducts = res?.filter((item) => item?.id !== product?.id);
        setSimilarProducts(filteredSimilarProducts);
      })
      .catch((err) => {
        console.error('Failed to fetch similar products:', err);
        setSimilarError('Failed to load similar products. Please try again.');
        setSimilarProducts([]); 
      })
      .finally(() => {
        setLoadingSimilar(false);
      });
  }, [product?.categoryId, product?.categoryTypeId, product?.id]);

  
  useEffect(() => {
   
    const primaryImage = product?.productResources?.find(res => res.isPrimary)?.url;
    const fallbackImage = product?.productResources?.[0]?.url;
    setCurrentDisplayImage(primaryImage || fallbackImage || ''); // Ensure a default empty string if no images

    // Build breadcrumb links
    const newBreadcrumbLinks = [{ title: 'Shop', path: '/shop' }]; // Changed path to /shop, adjust as needed

    if (productCategory) {
      newBreadcrumbLinks.push({
        title: productCategory.name,
        path: `/category/${productCategory.code}` // Assuming category path uses code/slug
      });
    }

    const productType = productCategory?.categoryTypes?.find((item) => item?.id === product?.categoryTypeId);
    if (productType) {
      newBreadcrumbLinks.push({
        title: productType.name,
        path: `/category/${productCategory.code}/${productType.code}` // Assuming category type path uses code/slug
      });
    }

    newBreadcrumbLinks.push({
      title: product?.name,
      path: `/product/${product?.slug}` // Or product?.slug if your route uses slugs
    });

    setBreadCrumbLink(newBreadcrumbLinks);
  }, [productCategory, product]); // Depend on productCategory and product

  // Add item to cart handler
  const addItemToCart = useCallback(() => {
    if (!selectedSize) {
      setError('Please select a size');
      return; 
    } else {
      setError(''); 
    }

    const selectedVariant = product?.variants?.find((variant) => variant?.size === selectedSize);

    if (!selectedVariant) {
      setError('Selected size variant not found.');
      return;
    }

    if (selectedVariant.stockQuantity > 0) {
      // Get the thumbnail URL for the cart item
      const cartThumbnail = product?.productResources?.find(res => res.isPrimary)?.url ||
                           product?.productResources?.[0]?.url;

      dispatch(addItemToCartAction({
        productId: product.id,
        thumbnail: cartThumbnail, 
        name: product.name,
        variant: selectedVariant, 
        quantity: 1, 
        subTotal: product.price, 
        price: product.price,
      }));
      console.log("Added to cart:", { product, selectedSize, selectedVariant });
      
    } else {
      setError('Out of Stock for the selected size.');
    }
  }, [dispatch, product, selectedSize]); // Dependencies for useCallback

  // Clear error when size changes
  useEffect(() => {
    if (selectedSize) {
      setError('');
    }
  }, [selectedSize]);

  // Extract colors and sizes from variants using useMemo
  const colors = useMemo(() => {
    const colorSet = _.uniq(_.map(product?.variants, 'color'));
    return colorSet;
  }, [product]);

  const sizes = useMemo(() => {
    const sizeSet = _.uniq(_.map(product?.variants, 'size'));
    return sizeSet;
  }, [product]);

  // Handle case where product data might not be available (e.g., if useLoaderData returns null for some reason)
  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        <p>Product not found.</p>
      </div>
    );
  }

  return (
    <>
      <div className='flex flex-col md:flex-row px-10 py-8'> {/* Added py-8 for overall spacing */}
        <div className='w-full lg:w-[50%] md:w-[40%]'>
          {/* Main Product Image and Thumbnails */}
          <div className='flex flex-col md:flex-row'>
            {/* Thumbnail Gallery (left/top) */}
            <div className='w-full md:w-[20%] flex justify-center items-start md:h-[420px]'>
              <div className='flex flex-row md:flex-col justify-center items-center h-full gap-2'>
                {
                  product?.productResources?.map((item, index) => (
                    <button
                      key={item?.url || index} // Use item.url as key if unique, otherwise index
                      onClick={() => setCurrentDisplayImage(item?.url)}
                      className={`rounded-lg w-fit p-1 ${currentDisplayImage === item?.url ? 'border-2 border-blue-500' : 'border border-transparent'} hover:border-blue-500 transition-all`}
                    >
                      <img src={item?.url} className='h-[60px] w-[60px] rounded-lg object-cover' alt={`${product?.name} thumbnail ${index + 1}`} />
                    </button>
                  ))
                }
              </div>
            </div>
            {/* Large Display Image */}
            <div className='w-full md:w-[80%] flex justify-center md:pt-0 pt-10'>
              <img
                src={currentDisplayImage} // Display selected image
                className='h-full w-full max-h-[520px] border rounded-lg object-contain' // Changed object-cover to object-contain to prevent cropping
                alt={product?.name}
              />
            </div>
          </div>
        </div>

        {/* Product Description and Actions */}
        <div className='w-full md:w-[60%] px-4 md:px-10 mt-8 md:mt-0'> {/* Adjusted padding/margins */}
          <Breadcrumb links={breadCrumbLinks} />
          <h1 className='text-4xl font-bold pt-4 text-gray-900 dark:text-gray-100'>{product?.name}</h1>
          <Rating rating={product?.rating} />
          <p className='text-3xl font-bold py-2 text-blue-600 dark:text-blue-400'>${product?.price?.toFixed(2)}</p> {/* Format price */}
          
          {/* Size Selection */}
          <div className='flex flex-col py-2'>
            <div className='flex gap-2 items-center'> {/* Added items-center for vertical alignment */}
              <p className='text-base font-semibold text-gray-800 dark:text-gray-200'>Select Size:</p>
              <Link className='text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors' to={'https://en.wikipedia.org/wiki/Clothing_sizes'} target='_blank'>Size Guide &rarr;</Link>
            </div>
          </div>
          <div className='mt-2'>
            {sizes.length > 0 ? (
              <SizeFilter
                onChange={(values) => { setSelectedSize(values?.[0] ?? ''); }}
                sizes={sizes}
                hidleTitle={true} 
                multi={false}
              />
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">No size options available.</p>
            )}
          </div>
          
          {/* Colors Available */}
          <div className='mt-4'>
            <p className='text-base font-semibold text-gray-800 dark:text-gray-200 mb-2'>Colors Available:</p>
            {colors.length > 0 ? (
                <ProductColors colors={colors} />
            ) : (
                <p className="text-sm text-gray-500 dark:text-gray-400">No color options available.</p>
            )}
          </div>

          {/* Add to Cart Button */}
          <div className='flex py-4'>
            <button
              onClick={addItemToCart}
              className='bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center h-[48px] w-[180px] font-semibold text-lg' // Improved button styling
            >
              <svg width="20" height="20" className='mr-2' viewBox="0 0 17 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"> {/* Changed fill to currentColor */}
                <path d="M1.5 1.33325H2.00526C2.85578 1.33325 3.56986 1.97367 3.6621 2.81917L4.3379 9.014C4.43014 9.8595 5.14422 10.4999 5.99474 10.4999H13.205C13.9669 10.4999 14.6317 9.98332 14.82 9.2451L15.9699 4.73584C16.2387 3.68204 15.4425 2.65733 14.355 2.65733H4.5M4.52063 13.5207H5.14563M4.52063 14.1457H5.14563M13.6873 13.5207H14.3123M13.6873 14.1457H14.3123M5.66667 13.8333C5.66667 14.2935 5.29357 14.6666 4.83333 14.6666C4.37310 14.6666 4 14.2935 4 13.8333C4 13.373 4.37310 12.9999 4.83333 12.9999C5.29357 12.9999 5.66667 13.373 5.66667 13.8333ZM14.8333 13.8333C14.8333 14.2935 14.4602 14.6666 14 14.6666C13.5398 14.6666 13.1667 14.2935 13.1667 13.8333C13.1667 13.373 13.5398 12.9999 14 12.9999C14.4602 12.9999 14.8333 13.373 14.8333 13.8333Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Add to cart
            </button>
          </div>
          {error && <p className='text-lg text-red-600 mt-2'>{error}</p>}

          {/* Extra Sections (Secure Payment, etc.) */}
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4'> {/* Use sm:grid-cols-2 for responsiveness */}
            {
              extraSections?.map((section, index) => (
                <div key={index} className='flex items-center text-gray-700 dark:text-gray-300'>
                  {section?.icon}
                  <p className='px-2'>{section?.label}</p>
                </div>
              ))
            }
          </div>
        </div>
      </div>

      {/* Product Description */}
      <SectionHeading title={'Product Description'} />
      <div className='md:w-[80%] w-full p-2 mx-auto'> {/* Centered and wider */}
        <p className='px-8 text-gray-700 dark:text-gray-300 leading-relaxed'>{product?.description}</p>
      </div>

      {/* Similar Products */}
      <SectionHeading title={'Similar Products'} />
      <div className='px-10 pb-10'>
        {loadingSimilar ? (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-400">Loading similar products...</p>
            {/* You can add a Spinner component here as well */}
          </div>
        ) : similarError ? (
          <div className="text-center py-8 text-red-500">
            <p>{similarError}</p>
          </div>
        ) : similarProducts?.length ? (
          <div className='pt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-2'>
            {similarProducts.map((item) => (
              <ProductCard
                key={item?.id} // Use item.id as the key
                product={item} // Pass the entire item as the 'product' prop
              />
            ))}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500 dark:text-gray-400">No similar products found.</p>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
