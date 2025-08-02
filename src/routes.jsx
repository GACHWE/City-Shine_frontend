// import { createBrowserRouter } from "react-router-dom";
// import Shop from "./Shop";
// import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
// import ProductListPage from "./pages/ProductListPage/ProductListPage";
// import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
// import { loadProductBySlug } from "./routes/products";
// import AuthenticationWrapper from "./pages/AuthenticationWrapper";
// import Login from "./pages/Login/Login";
// import Register from "./pages/Register/Register";
// import OAuth2LoginCallback from "./pages/OAuth2LoginCallback";
// import Cart from "./pages/Cart/Cart";
// import Account from "./pages/Account/Account";
// import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
// import Checkout from "./pages/Checkout/Checkout";
// import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
// import Profile from "./pages/Account/Profile";
// import Orders from "./pages/Account/Orders";
// import Settings from "./pages/Account/Settings";
// import { AdminPanel } from "./pages/AdminPanel/AdminPanel";

// export const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <ShopApplicationWrapper />,
//     children: [
//       {
//         path: "/",
//         element: <Shop />,
//       },
//       {
//         path: "/:categoryType",  // ✅ Dynamic category route
//         element: <ProductListPage />,
//       },
//       {
//         path: "/product/:slug",
//         loader: loadProductBySlug,
//         element: <ProductDetails />,
//       },
//       {
//         path: "/cart-items",
//         element: <Cart />,
//       },
//       {
//         path: "/account-details/",
//         element: <ProtectedRoute><Account /></ProtectedRoute>,
//         children: [
//           {
//             path: "profile",
//             element: <ProtectedRoute><Profile /></ProtectedRoute>,
//           },
//           {
//             path: "orders",
//             element: <ProtectedRoute><Orders /></ProtectedRoute>,
//           },
//           {
//             path: "settings",
//             element: <ProtectedRoute><Settings /></ProtectedRoute>,
//           },
//         ],
//       },
//       {
//         path: "/checkout",
//         element: <ProtectedRoute><Checkout /></ProtectedRoute>,
//       },
//       {
//         path: "/orderConfirmed",
//         element: <OrderConfirmed />,
//       },
//     ],
//   },
//   {
//     path: "/v1/",
//     element: <AuthenticationWrapper />,
//     children: [
//       {
//         path: "login",
//         element: <Login />,
//       },
//       {
//         path: "register",
//         element: <Register />,
//       },
//     ],
//   },
//   {
//     path: "/oauth2/callback",
//     element: <OAuth2LoginCallback />,
//   },
//   {
//     path: "/admin/*",
//     element: <ProtectedRoute><AdminPanel /></ProtectedRoute>,
//   },
// ]);

import { createBrowserRouter, redirect } from "react-router-dom";
import Shop from "./Shop";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products"; // Import the slug-based loader
import AuthenticationWrapper from "./pages/AuthenticationWrapper";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import OAuth2LoginCallback from "./pages/OAuth2LoginCallback";
import Cart from "./pages/Cart/Cart";
import Account from "./pages/Account/Account";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import Checkout from "./pages/Checkout/Checkout";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
import Profile from "./pages/Account/Profile";
import Orders from "./pages/Account/Orders";
import Settings from "./pages/Account/Settings";

// Import the new AdminLayout and all the admin pages
import AdminLayout from "./components/layouts/AdminLayout";
import {
    Dashboard,
    Setting,
    Products,
    AddProduct,
    // SingleProduct,
    Categories,
    // Customers,
    // SingleCustomer,
    // SalesAnalytics,
    // ProductSales,
    // OrderTemplate,
    // SingleOrder,
    // Suppliers,
    // Transactions,
    // Brands,
} from './pages/adminPanel';

export const router = createBrowserRouter([
    {
        path: "/",
        element: <ShopApplicationWrapper />,
        children: [
            {
                path: "/",
                element: <Shop />,
            },
            {
                path: "/:categoryType",
                element: <ProductListPage />,
            },
            {
                // The path is now configured to expect a slug
                path: "/product/:slug",
                // We use the slug-based loader to fetch the product data
                loader: loadProductBySlug,
                element: <ProductDetails />,
            },
            {
                path: "/cart-items",
                element: <Cart />,
            },
            {
                path: "/account-details/",
                element: <ProtectedRoute><Account /></ProtectedRoute>,
                children: [
                    {
                        path: "profile",
                        element: <ProtectedRoute><Profile /></ProtectedRoute>,
                    },
                    {
                        path: "orders",
                        element: <ProtectedRoute><Orders /></ProtectedRoute>,
                    },
                    {
                        path: "settings",
                        element: <ProtectedRoute><Settings /></ProtectedRoute>,
                    },
                ],
            },
            {
                path: "/checkout",
                element: <ProtectedRoute><Checkout /></ProtectedRoute>,
            },
            {
                path: "/orderConfirmed",
                element: <OrderConfirmed />,
            },
        ],
    },
    {
        path: "/v1/",
        element: <AuthenticationWrapper />,
        children: [
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
        ],
    },
    {
        path: "/oauth2/callback",
        element: <OAuth2LoginCallback />,
    },
    {
        path: "/admin",
        element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "products",
                element: <Products />,
            },
            {
                path: "products/add",
                element: <ProtectedRoute><AddProduct /></ProtectedRoute>,
            },
            {
                path: "categories",
                element: <ProtectedRoute><Categories /></ProtectedRoute>,
            },
            {
                path: "settings",
                element: <ProtectedRoute><Setting /></ProtectedRoute>,
            },
        ],
    },
]);
