import { createBrowserRouter, redirect } from "react-router-dom";
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
import AdminRoute from "./components/ProtectedRoute/AdminRoute";
import Checkout from "./pages/Checkout/Checkout";
import PaymentPending from "./pages/PaymentPage/PaymentPending";
import OrderConfirmed from "./pages/OrderConfirmed/OrderConfirmed";
import Profile from "./pages/Account/Profile";
import CustomerOrders from "./pages/Account/CustomerOrders";
import Settings from "./pages/Account/Settings";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import CategoryListing from "./pages/Categories/CategoryListing";
import AdminLayout from "./components/layouts/AdminLayout";
import { Setting,  Products,  AdminOrders,  Categories, FeatureProductForm} from "./pages/Admin/index";
import PrivacyPolicy from "./pages/Policies/PrivacyPolicy";
import ReturnPolicy from "./pages/Policies/ReturnPolicy";
import HelpFAQ from "./pages/Policies/HelpFAQ";
import About from "./pages/Policies/About";

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
        path: "/categories",
        element: <CategoriesPage />,
      },

      {
        path: "/products/:id",
        element: <CategoryListing />,
      },
      {
        path: "/products/:categoryId",
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
        path: "privacy-policy",
        element: <PrivacyPolicy />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/return-policy",
        element: <ReturnPolicy />,
      },
      {
        path: "/help-faq",
        element: <HelpFAQ />,
      },
      {
        path: "/account-details/",
        element: (
          <ProtectedRoute>
            <Account />
          </ProtectedRoute>
        ),
        children: [
          {
            path: "profile",
            element: (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            ),
          },
          {
            path: "orders",
            element: (
              <ProtectedRoute>
                <CustomerOrders />
              </ProtectedRoute>
            ),
          },
          {
            path: "settings",
            element: (
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      
      {
        path: "/payment-pending",
        element: (
          <ProtectedRoute>
            <PaymentPending />
          </ProtectedRoute>
        ),
      },
      {
        path: "/order-confirmed",
        element: (
          <ProtectedRoute>
            <OrderConfirmed />
          </ProtectedRoute>
        ),
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
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      
      {
        index: true,
        path: "products",
        element: <Products />,
      },
      {
        path: "feature-product",
        element: <FeatureProductForm />,
      },
      {
        path: "categories",
        element: (
          <AdminRoute>
            <Categories />
          </AdminRoute>
        ),
      },
      {
        path: "orders",
        element: (
          <AdminRoute>
            <AdminOrders />
          </AdminRoute>
        ),
      },
      {
        path: "settings",
        element: (
          <AdminRoute>
            <Setting />
          </AdminRoute>
        ),
      },
    ],
  },
]);
