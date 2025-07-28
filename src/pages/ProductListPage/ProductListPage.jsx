import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import FilterIcon from '../../components/common/FilterIcon';
import Categories from '../../components/Filters/Categories';
import PriceFilter from '../../components/Filters/PriceFilter';
import ColorsFilter from '../../components/Filters/ColorsFilter';
import SizeFilter from '../../components/Filters/SizeFilter';
import ProductCard from './ProductCard';

import { getAllProducts } from '../../api/fetchProducts';
import { setLoading } from '../../store/features/common';

const ProductListPage = () => {
  const { categoryType } = useParams(); // <-- Get categoryType from URL
  const categoryData = useSelector((state) => state?.categoryState?.categories);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  const category = useMemo(() => {
    return categoryData?.find((cat) => cat?.code === categoryType);
  }, [categoryData, categoryType]);

  useEffect(() => {
    if (!category?.id) return;

    dispatch(setLoading(true));
    getAllProducts(category.id)
      .then((res) => setProducts(res))
      .catch((err) => console.error('Failed to fetch products:', err))
      .finally(() => dispatch(setLoading(false)));
  }, [category?.id, dispatch]);

  if (!category) {
    return <div className="p-10">Loading category...</div>;
  }

  return (
    <div className="flex">
      {/* Filters */}
      <div className="w-[20%] p-[10px] border rounded-lg m-[20px]">
        <div className="flex justify-between">
          <p className="text-[16px] text-gray-600">Filter</p>
          <FilterIcon />
        </div>
        <p className="text-[16px] text-black mt-5">Categories</p>
        <Categories types={category?.types ?? []} />
        <hr />
        <PriceFilter />
        <hr />
        <ColorsFilter colors={category?.meta_data?.colors ?? []} />
        <hr />
        <SizeFilter sizes={category?.meta_data?.sizes ?? []} />
      </div>

      {/* Products */}
      <div className="p-[15px]">
        <p className="text-black text-lg">{category?.description}</p>
        <div className="pt-4 grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 px-2">
          {products?.length ? (
            products.map((item, index) => (
              <ProductCard key={item?.id + '_' + index} {...item} title={item?.name} />
            ))
          ) : (
            <p className="text-gray-500">No products found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;
