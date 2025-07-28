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

// src/routes/routes.jsx

import { createBrowserRouter } from "react-router-dom";
import Shop from "./Shop";
import ShopApplicationWrapper from "./pages/ShopApplicationWrapper";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetails from "./pages/ProductDetailPage/ProductDetails";
import { loadProductBySlug } from "./routes/products";
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
        path: "/product/:slug",
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
    path: "/admin", // Changed from "/admin/*" to a single path
    element: <ProtectedRoute><AdminLayout /></ProtectedRoute>,
    children: [
      {
        index: true, // This makes the Dashboard the default page for /admin
        element: <Dashboard />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "products/add",
        element: <AddProduct />,
      },
      // {
      //   path: "products/:id",
      //   element: <SingleProduct />,
      // },
      {
        path: "categories",
        element: <Categories />,
      },
      // {
      //   path: "customers",
      //   element: <Customers />,
      // },
      // {
      //   path: "customers/:id",
      //   element: <SingleCustomer />,
      // },
      // {
      //   path: "sales-analytics",
      //   element: <SalesAnalytics />,
      // },
      // {
      //   path: "product-sales",
      //   element: <ProductSales />,
      // },
      // {
      //   path: "orders",
      //   element: <Orders />,
      // },
      // {
      //   path: "orders-template",
      //   element: <OrderTemplate />,
      // },
      // {
      //   path: "orders/:id",
      //   element: <SingleOrder />,
      // },
      // {
      //   path: "suppliers",
      //   element: <Suppliers />,
      // },
      // {
      //   path: "transactions",
      //   element: <Transactions />,
      // },
      // {
      //   path: "brands",
      //   element: <Brands />,
      // },
      // {
      //   path: "reviews",
      //   element: <Reviews />,
      // },
      {
        path: "settings",
        element: <Setting />,
      },
     
    ],
  },
]);