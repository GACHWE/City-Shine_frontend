import React, { useMemo } from "react";

export default function FilterComponent({ products, filters, onFilterChange }) {
  // Ensure filters has all required properties with defaults
  const safeFilters = {
    brands: filters?.brands || [],
    colors: filters?.colors || [],
    conditions: filters?.conditions || [],
    minPrice: filters?.minPrice ?? null,
    maxPrice: filters?.maxPrice ?? null,
    newArrival: filters?.newArrival ?? false,
    search: filters?.search || ''
  };

  // Compute filter options from products with new field names
  const { availableBrands, availableColors, availableConditions, priceRange } = useMemo(() => {
    const brands = new Set();
    const colors = new Set();
    const conditions = new Set();
    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products?.forEach(product => {
      // Brand filter
      if (product.brand) brands.add(product.brand);
      
      // Color and condition filters from productVariants
      product.productVariants?.forEach(variant => {
        if (variant.color) colors.add(variant.color);
        if (variant.conditionStatus) conditions.add(variant.conditionStatus);
      });
      
      // Price range
      if (product.price !== undefined && product.price !== null) {
        if (product.price < minPrice) minPrice = product.price;
        if (product.price > maxPrice) maxPrice = product.price;
      }
    });

    return {
      availableBrands: Array.from(brands).sort(),
      availableColors: Array.from(colors).sort(),
      availableConditions: Array.from(conditions).sort(),
      priceRange: {
        min: minPrice === Infinity ? 0 : Math.floor(minPrice),
        max: maxPrice === -Infinity ? 1000 : Math.ceil(maxPrice)
      }
    };
  }, [products]);

  const handleCheckbox = (type, value) => {
    onFilterChange(prev => {
      const currentFilters = { ...prev };
      const currentArray = currentFilters[type] || [];
      const currentSet = new Set(currentArray);
      
      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }
      
      return { ...currentFilters, [type]: Array.from(currentSet) };
    });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange(prev => ({
      ...prev,
      [field]: value === '' ? null : Number(value)
    }));
  };

  const clearAllFilters = () => {
    onFilterChange({
      brands: [],
      colors: [],
      conditions: [],
      minPrice: null,
      maxPrice: null,
      newArrival: false,
      search: ''
    });
  };

  const hasActiveFilters = 
    safeFilters.brands.length > 0 ||
    safeFilters.colors.length > 0 ||
    safeFilters.conditions.length > 0 ||
    safeFilters.minPrice !== null ||
    safeFilters.maxPrice !== null ||
    safeFilters.newArrival ||
    safeFilters.search !== '';

  return (
    <div className="space-y-6 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Filters</h2>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {products?.length || 0} products available
        </p>
      </div>

      {/* Search */}
      <div>
        <h3 className="text-lg font-medium mb-3">Search</h3>
        <input
          type="text"
          placeholder="Search products..."
          value={safeFilters.search}
          onChange={(e) => onFilterChange(prev => ({ ...prev, search: e.target.value }))}
          className="w-full border rounded-lg px-3 py-2 
                     bg-white dark:bg-gray-800 
                     border-gray-300 dark:border-gray-600
                     text-gray-900 dark:text-gray-100
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-lg font-medium mb-3">Price Range (Ksh)</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Min Price
              </label>
              <input
                type="number"
                placeholder={priceRange.min.toString()}
                value={safeFilters.minPrice ?? ''}
                onChange={(e) => handlePriceChange("minPrice", e.target.value)}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full border rounded-lg px-3 py-2 
                           bg-white dark:bg-gray-800 
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                Max Price
              </label>
              <input
                type="number"
                placeholder={priceRange.max.toString()}
                value={safeFilters.maxPrice ?? ''}
                onChange={(e) => handlePriceChange("maxPrice", e.target.value)}
                min={priceRange.min}
                max={priceRange.max}
                className="w-full border rounded-lg px-3 py-2 
                           bg-white dark:bg-gray-800 
                           border-gray-300 dark:border-gray-600
                           text-gray-900 dark:text-gray-100
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="text-center text-sm text-gray-500">
            Range: Ksh {priceRange.min} - Ksh {priceRange.max}
          </div>
        </div>
      </div>

      {/* New Arrival */}
      <div>
        <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
          <input
            type="checkbox"
            checked={safeFilters.newArrival}
            onChange={(e) => onFilterChange(prev => ({ ...prev, newArrival: e.target.checked }))}
            className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
          />
          <span className="font-medium">New Arrivals Only</span>
        </label>
      </div>

      {/* Brands */}
      {availableBrands.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Brands ({availableBrands.length})</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {availableBrands.map(brand => (
              <label key={brand} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  checked={safeFilters.brands.includes(brand)}
                  onChange={() => handleCheckbox("brands", brand)}
                  className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                />
                <span className="text-sm">{brand}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Colors */}
      {availableColors.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Colors ({availableColors.length})</h3>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {availableColors.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => handleCheckbox("colors", color)}
                className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                  safeFilters.colors.includes(color)
                    ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500 shadow-md"
                    : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Condition Status */}
      {availableConditions.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3">Condition ({availableConditions.length})</h3>
          <div className="space-y-2">
            {availableConditions.map(condition => (
              <label key={condition} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
                <input
                  type="checkbox"
                  checked={safeFilters.conditions.includes(condition)}
                  onChange={() => handleCheckbox("conditions", condition)}
                  className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                />
                <span className="text-sm capitalize">{condition.toLowerCase()}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Active filters:</strong>
            <div className="mt-2 space-y-1">
              {safeFilters.search && (
                <div>Search: "{safeFilters.search}"</div>
              )}
              {safeFilters.minPrice !== null && (
                <div>Min price: Ksh {safeFilters.minPrice}</div>
              )}
              {safeFilters.maxPrice !== null && (
                <div>Max price: Ksh {safeFilters.maxPrice}</div>
              )}
              {safeFilters.newArrival && <div>New arrivals only</div>}
              {safeFilters.brands.length > 0 && (
                <div>Brands: {safeFilters.brands.join(', ')}</div>
              )}
              {safeFilters.colors.length > 0 && (
                <div>Colors: {safeFilters.colors.join(', ')}</div>
              )}
              {safeFilters.conditions.length > 0 && (
                <div>Conditions: {safeFilters.conditions.join(', ')}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// import React, { useMemo } from "react";

// export default function FilterComponent({ products, filters, onFilterChange }) {
//   // Ensure filters has all required properties with defaults
//   const safeFilters = {
//     brands: filters?.brands || [],
//     colors: filters?.colors || [],
//     conditions: filters?.conditions || [],
//     minPrice: filters?.minPrice ?? null,
//     maxPrice: filters?.maxPrice ?? null,
//     newArrival: filters?.newArrival ?? false
//   };

//   // Compute filter options from products
//   const { availableBrands, availableColors, availableConditions, minPrice, maxPrice } = useMemo(() => {
//     const brands = new Set();
//     const colors = new Set();
//     const conditions = new Set();
//     let min = Infinity;
//     let max = -Infinity;

//     products?.forEach(p => {
//       if (p.brand) brands.add(p.brand);
//       p.variants?.forEach(v => {
//         if (v.color) colors.add(v.color);
//         if (v.conditionStatus) conditions.add(v.conditionStatus);
//       });
//       if (p.price < min) min = p.price;
//       if (p.price > max) max = p.price;
//     });

//     return {
//       availableBrands: [...brands],
//       availableColors: [...colors],
//       availableConditions: [...conditions],
//       minPrice: min === Infinity ? 0 : min,
//       maxPrice: max === -Infinity ? 0 : max,
//     };
//   }, [products]);

//   const handleCheckbox = (type, value) => {
//     onFilterChange(prev => {
//       const currentFilters = prev || {};
//       const currentArray = currentFilters[type] || [];
//       const currentSet = new Set(currentArray);
      
//       if (currentSet.has(value)) {
//         currentSet.delete(value);
//       } else {
//         currentSet.add(value);
//       }
      
//       return { ...currentFilters, [type]: Array.from(currentSet) };
//     });
//   };

//   return (
//     <div className="space-y-6 text-gray-800 dark:text-gray-100">
//       {/* Header */}
//       <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
//         <h2 className="text-xl font-semibold">Filters</h2>
//         <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//           {products?.length || 0} products
//         </p>
//       </div>

//       {/* Price Range */}
//       <div>
//         <h3 className="text-lg font-medium mb-3">Price Range</h3>
//         <div className="space-y-3">
//           <div className="flex items-center gap-3">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Min
//               </label>
//               <input
//                 type="number"
//                 placeholder={`$${minPrice}`}
//                 value={safeFilters.minPrice ?? ""}
//                 onChange={e =>
//                   onFilterChange(prev => ({
//                     ...prev,
//                     minPrice: e.target.value ? +e.target.value : null,
//                   }))
//                 }
//                 className="w-full border rounded-lg px-3 py-2 
//                            bg-white dark:bg-gray-800 
//                            border-gray-300 dark:border-gray-600
//                            text-gray-900 dark:text-gray-100
//                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
//                 Max
//               </label>
//               <input
//                 type="number"
//                 placeholder={`$${maxPrice}`}
//                 value={safeFilters.maxPrice ?? ""}
//                 onChange={e =>
//                   onFilterChange(prev => ({
//                     ...prev,
//                     maxPrice: e.target.value ? +e.target.value : null,
//                   }))
//                 }
//                 className="w-full border rounded-lg px-3 py-2 
//                            bg-white dark:bg-gray-800 
//                            border-gray-300 dark:border-gray-600
//                            text-gray-900 dark:text-gray-100
//                            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Brands */}
//       {availableBrands.length > 0 && (
//         <div>
//           <h3 className="text-lg font-medium mb-3">Brands</h3>
//           <div className="space-y-2 max-h-40 overflow-y-auto">
//             {availableBrands.map(brand => (
//               <label key={brand} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={safeFilters.brands.includes(brand)}
//                   onChange={() => handleCheckbox("brands", brand)}
//                   className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
//                 />
//                 <span className="text-sm">{brand}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Colors */}
//       {availableColors.length > 0 && (
//         <div>
//           <h3 className="text-lg font-medium mb-3">Colors</h3>
//           <div className="grid grid-cols-2 gap-2">
//             {availableColors.map(color => (
//               <button
//                 key={color}
//                 type="button"
//                 onClick={() => handleCheckbox("colors", color)}
//                 className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
//                   safeFilters.colors.includes(color)
//                     ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-500 dark:border-blue-500 shadow-md"
//                     : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//                 }`}
//               >
//                 {color}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Condition Status */}
//       {availableConditions.length > 0 && (
//         <div>
//           <h3 className="text-lg font-medium mb-3">Condition</h3>
//           <div className="space-y-2">
//             {availableConditions.map(condition => (
//               <label key={condition} className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//                 <input
//                   type="checkbox"
//                   checked={safeFilters.conditions.includes(condition)}
//                   onChange={() => handleCheckbox("conditions", condition)}
//                   className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
//                 />
//                 <span className="text-sm capitalize">{condition.toLowerCase()}</span>
//               </label>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* New Arrival */}
//       <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//         <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
//           <input
//             type="checkbox"
//             checked={safeFilters.newArrival}
//             onChange={e =>
//               onFilterChange(prev => ({ ...prev, newArrival: e.target.checked }))
//             }
//             className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
//           />
//           <span className="font-medium">New Arrivals Only</span>
//         </label>
//       </div>

//       {/* Clear Filters Button */}
//       <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
//         <button
//           type="button"
//           onClick={() => onFilterChange({
//             brands: [],
//             colors: [],
//             conditions: [],
//             minPrice: null,
//             maxPrice: null,
//             newArrival: false
//           })}
//           className="w-full py-2 px-4 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors font-medium"
//         >
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   );
// }