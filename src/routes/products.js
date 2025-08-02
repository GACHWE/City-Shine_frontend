// import { getProductBySlug } from '../api/fetchProducts';
// import { setLoading } from '../store/features/common';
// import store from '../store/store';

// export const loadProductBySlug = async ({params}) =>{
//     try{
//         store.dispatch(setLoading(true));
//         const product = await getProductBySlug(params?.slug);
//         store.dispatch(setLoading(false));
//         return {product};
//     }
//     catch(err){

//     }
// }
// src/loaders/loadProductBySlug.js
import { getProductBySlug } from '../api/fetchProducts';
import { setLoading } from '../store/features/common';
import store from '../store/store';

export const loadProductBySlug = async ({ params }) => {
  try {
    store.dispatch(setLoading(true));
    const product = await getProductBySlug(params?.slug);
    store.dispatch(setLoading(false));

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    return { product };
  } catch (err) {
    console.error("Error loading product by slug:", err);
    store.dispatch(setLoading(false));

    throw new Response("Failed to load product", { status: 500 });
  }
};