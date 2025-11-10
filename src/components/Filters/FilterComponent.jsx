// components/Filters/FilterComponent/index.jsx
import React, { useMemo, useState } from "react";
import { FiX, FiFilter, FiChevronDown, FiChevronUp } from "react-icons/fi";

const FilterComponent = ({
  products,
  filters,
  onFilterChange,
  // New props for mobile responsiveness
  isMobile = false,
  onClose = null,
  showHeader = true,
}) => {
  const [openSections, setOpenSections] = useState({
    price: true,
    brands: true,
    colors: true,
    conditions: true,
    features: true,
  });

  // Ensure filters has all required properties with defaults
  const safeFilters = {
    brands: filters?.brands || [],
    colors: filters?.colors || [],
    conditions: filters?.conditions || [],
    minPrice: filters?.minPrice ?? null,
    maxPrice: filters?.maxPrice ?? null,
    newArrival: filters?.newArrival ?? false,
    search: filters?.search || "",
  };

  // Compute filter options from products
  const { availableBrands, availableColors, availableConditions, priceRange } =
    useMemo(() => {
      const brands = new Set();
      const colors = new Set();
      const conditions = new Set();
      let minPrice = Infinity;
      let maxPrice = -Infinity;

      products?.forEach((product) => {
        // Brand filter
        if (product.brand) brands.add(product.brand);

        // Color and condition filters from variants
        product.variants?.forEach((variant) => {
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
          max: maxPrice === -Infinity ? 1000 : Math.ceil(maxPrice),
        },
      };
    }, [products]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCheckbox = (type, value) => {
    onFilterChange((prev) => {
      const currentFilters = { ...prev };
      const currentArray = currentFilters[type] || [];
      const currentSet = new Set(currentArray);

      if (currentSet.has(value)) {
        currentSet.delete(value);
      } else {
        currentSet.add(value);
      }

      return { ...prev, [type]: Array.from(currentSet) };
    });
  };

  const handlePriceChange = (field, value) => {
    onFilterChange((prev) => ({
      ...prev,
      [field]: value === "" ? null : Number(value),
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
      search: "",
    });
  };

  const hasActiveFilters =
    safeFilters.brands.length > 0 ||
    safeFilters.colors.length > 0 ||
    safeFilters.conditions.length > 0 ||
    safeFilters.minPrice !== null ||
    safeFilters.maxPrice !== null ||
    safeFilters.newArrival ||
    safeFilters.search !== "";

  // Filter section component for consistent styling
  const FilterSection = ({ title, count, sectionKey, children }) => (
    <div className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
      <button
        onClick={() => toggleSection(sectionKey)}
        className="flex justify-between items-center w-full py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
      >
        <span>
          {title} {count !== undefined && `(${count})`}
        </span>
        {openSections[sectionKey] ? <FiChevronUp /> : <FiChevronDown />}
      </button>

      {openSections[sectionKey] && <div className="mt-2">{children}</div>}
    </div>
  );

  return (
    <div
      className={`text-gray-800 dark:text-gray-100 ${
        isMobile ? "h-full flex flex-col" : ""
      }`}
    >
      {/* Header */}
      {showHeader && (
        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Filters</h2>
            <div className="flex items-center gap-3">
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
              {isMobile && onClose && (
                <button
                  onClick={onClose}
                  className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FiX className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {products?.length || 0} products available
          </p>
        </div>
      )}

      {/* Filter Content */}
      <div className={isMobile ? "flex-1 overflow-y-auto" : "space-y-4"}>
        {/* Price Range */}
        <FilterSection title="Price Range" sectionKey="price">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium  text-gray-600 dark:text-gray-400 mb-1">
                  Min Price
                </label>
                <input
                  type="number"
                  placeholder={priceRange.min.toString()}
                  value={safeFilters.minPrice ?? ""}
                  onChange={(e) =>
                    handlePriceChange("minPrice", e.target.value)
                  }
                  min={priceRange.min}
                  max={priceRange.max}
                  className="w-full border dark:bg-gray-700  rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                  Max Price
                </label>
                <input
                  type="number"
                  placeholder={priceRange.max.toString()}
                  value={safeFilters.maxPrice ?? ""}
                  onChange={(e) =>
                    handlePriceChange("maxPrice", e.target.value)
                  }
                  min={priceRange.min}
                  max={priceRange.max}
                  className="w-full border rounded-lg dark:bg-gray-700  px-3 py-2 text-sm"
                />
              </div>
            </div>
            <div className="text-center text-xs text-gray-500">
              Range: Ksh {priceRange.min.toLocaleString()} - Ksh{" "}
              {priceRange.max.toLocaleString()}
            </div>
          </div>
        </FilterSection>

        {/* New Arrival */}
        <FilterSection title="Features" sectionKey="features">
          <label className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800">
            <input
              type="checkbox"
              checked={safeFilters.newArrival}
              onChange={(e) =>
                onFilterChange((prev) => ({
                  ...prev,
                  newArrival: e.target.checked,
                }))
              }
              className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
            />
            <span className="text-sm">New Arrivals Only</span>
          </label>
        </FilterSection>

        {/* Brands */}
        {availableBrands.length > 0 && (
          <FilterSection
            title="Brands"
            count={availableBrands.length}
            sectionKey="brands"
          >
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {availableBrands.map((brand) => (
                <label
                  key={brand}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
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
          </FilterSection>
        )}

        {/* Colors */}
        {availableColors.length > 0 && (
          <FilterSection
            title="Colors"
            count={availableColors.length}
            sectionKey="colors"
          >
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {availableColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleCheckbox("colors", color)}
                  className={`px-3 py-2 rounded-lg border transition-all text-sm font-medium ${
                    safeFilters.colors.includes(color)
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </FilterSection>
        )}

        {/* Condition Status */}
        {availableConditions.length > 0 && (
          <FilterSection
            title="Condition"
            count={availableConditions.length}
            sectionKey="conditions"
          >
            <div className="space-y-1">
              {availableConditions.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <input
                    type="checkbox"
                    checked={safeFilters.conditions.includes(condition)}
                    onChange={() => handleCheckbox("conditions", condition)}
                    className="w-4 h-4 accent-blue-600 dark:accent-blue-400"
                  />
                  <span className="text-sm capitalize">
                    {condition.toLowerCase()}
                  </span>
                </label>
              ))}
            </div>
          </FilterSection>
        )}
      </div>

      {/* Mobile Apply Button */}
      {isMobile && onClose && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
          <button
            onClick={onClose}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
