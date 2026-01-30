// // components/Product/ProductPrice.jsx
// import React from 'react';

// const ProductPrice = ({ price, originalPrice, showSavings = true, size = 'medium', className = '' }) => {
//   const hasDiscount = originalPrice && originalPrice > price;
//   const savingsPercentage = hasDiscount 
//     ? Math.round((1 - price / originalPrice) * 100)
//     : 0;

//   const sizeClasses = {
//     small: 'text-sm',
//     medium: 'text-base',
//     large: 'text-lg'
//   };

//   const priceSizeClasses = {
//     small: 'text-xl',
//     medium: 'text-2xl',
//     large: 'text-3xl'
//   };

//   return (
//     <div className={`flex flex-col bg-yellow-300   ${className}`}>
//       <div className="flex gap-5">
//         <span className={`font-bold ${priceSizeClasses[size]} text-gray-900 dark:text-white`}>
//           Ksh {price.toLocaleString()}
//         </span>
        
//         {hasDiscount && originalPrice && (
//           <span className={`${sizeClasses[size]} text-gray-500 dark:text-gray-400 line-through`}>
//             Ksh {originalPrice.toLocaleString()}
//           </span>
//         )}

//         {hasDiscount && showSavings && savingsPercentage > 0 && (
//           <span className="px-2 py-1 text-xs font-semibold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 rounded-full">
//             Save {savingsPercentage}%
//           </span>
//         )}
//       </div>

//       {hasDiscount && (
//         <div className="text-xs text-green-600 dark:text-green-400 font-medium">
//           Limited time offer!
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProductPrice;

import React from 'react';

const ProductPrice = ({ price, originalPrice, showSavings = true, size = 'medium', className = '' }) => {
  const hasDiscount = originalPrice && originalPrice > price;
  const savingsPercentage = hasDiscount 
    ? Math.round((1 - price / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    small: {
      currentPrice: 'text-xl font-bold',
      originalPrice: 'text-base',
      badge: 'text-xs',
      container: 'gap-2'
    },
    medium: {
      currentPrice: 'text-2xl sm:text-3xl font-bold',
      originalPrice: 'text-lg sm:text-xl',
      badge: 'text-sm',
      container: 'gap-3'
    },
    large: {
      currentPrice: 'text-3xl sm:text-4xl font-bold',
      originalPrice: 'text-xl sm:text-2xl',
      badge: 'text-base',
      container: 'gap-4'
    }
  };

  const sizeConfig = sizeClasses[size];

  return (
    <div className={`space-y-1 ${className}`}>
      {/* Price Row */}
      <div className={`flex items-baseline flex-wrap ${sizeConfig.container}`}>
        {/* Current Price - Always visible */}
        <span className={`${sizeConfig.currentPrice} text-gray-900 dark:text-white`}>
          Ksh {price.toLocaleString()}
        </span>
        
        {/* Discount Information */}
        {hasDiscount && (
          <div className="flex items-center gap-2">
            {/* Original Price */}
            <span className={`${sizeConfig.originalPrice} text-gray-500 dark:text-gray-400 line-through`}>
              Ksh {originalPrice.toLocaleString()}
            </span>
            
            {/* Savings Badge */}
            {showSavings && savingsPercentage > 0 && (
              <span className={`${sizeConfig.badge} font-medium text-red-600 dark:text-red-400 px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded`}>
                {savingsPercentage}% OFF
              </span>
            )}
          </div>
        )}
      </div>

      {/* Perks Line */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {hasDiscount && (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className='text-green-600 dark:text-green-400'>Save Ksh {(originalPrice - price).toLocaleString()}</span>
            </span>
            <span className="">•</span>
            <span className="text-red-400">Limited offer</span>
          </div>
        ) }
      </div>
    </div>
  );
};

export default ProductPrice;