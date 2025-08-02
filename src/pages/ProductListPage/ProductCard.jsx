// import React from 'react'
// import SvgFavourite from '../../components/common/SvgFavourite'
// import { Link } from 'react-router-dom'

// const ProductCard = ({id,title,description,price,discount,rating,brand,thumbnail,slug}) => {
//   return (
//     <div className='flex flex-col hover:scale-105 relative'>
//       <Link to={`/product/${slug}`}>
//         <img className={`h-[320px] w-[280px]
//          border rounded-lg cursor-pointer object-cover block`} src={thumbnail} alt={title}/>
//          </Link>
         
//          <div className='flex justify-between items-center'>
//           <div className='flex flex-col pt-2'>
//           <p className='text-[16px] p-1'>{title}</p>
//           {description && <p className='text-[12px] px-1 text-gray-600'>{brand}</p>}
//           </div>
//           <div>
//             <p>${price}</p>
//           </div>
//         </div>
//         <button onClick={()=> console.log("Click button")} className='absolute top-0 right-0 pt-4 pr-4 cursor-pointer'><SvgFavourite /></button>
//     </div>
//   )
// }

// export default ProductCard

// src/components/ProductCard.jsx
// src/components/ProductCard.jsx
import React from 'react';
import SvgFavourite from '../../components/common/SvgFavourite';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { id, name, description, price, discount, rating, brand, slug, productResources, isNewArrival } = product;

  const thumbnail = productResources?.find(resource => resource.isPrimary)?.url || productResources?.[0]?.url;
  const displayPrice = price ? `$${price.toFixed(2)}` : 'N/A';
  const displayDiscount = discount > 0 ? `-${discount}%` : '';

  return (
    <div className='flex flex-col hover:scale-105 relative'>
      <Link to={`/product/${slug || id}`}>
        <img
          className='h-[320px] w-[280px] border rounded-lg cursor-pointer object-cover block'
          src={thumbnail}
          alt={name}
        />
      </Link>

      <div className='flex justify-between items-center'>
        <div className='flex flex-col pt-2'>
          <p className='text-[16px] p-1'>{name}</p>
          {brand && <p className='text-[12px] px-1 text-gray-600'>{brand}</p>}
        </div>
        <div>
          <p className='text-[16px] font-bold'>{displayPrice}</p>
        </div>
      </div>

      <button
        onClick={() => console.log(`Favourite clicked for product: ${name} (ID: ${id})`)}
        className='absolute top-0 right-0 pt-4 pr-4 cursor-pointer'
        aria-label={`Add ${name} to favourites`}
      >
        <SvgFavourite />
      </button>

      {discount > 0 && (
        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          {displayDiscount}
        </span>
      )}

      {isNewArrival && (
        <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
          New
        </span>
      )}
    </div>
  );
};

export default ProductCard;