# Cityshine Frontend

A modern, responsive e-commerce admin and customer frontend for the **Cityshine** platform — built with React and Tailwind CSS.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Integration](#api-integration)
- [Order Lifecycle](#order-lifecycle)
- [State Management](#state-management)
- [Styling & Theming](#styling--theming)
- [Available Scripts](#available-scripts)
- [Known Patterns & Conventions](#known-patterns--conventions)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## Overview

Cityshine is a full-featured e-commerce platform that supports product browsing, shopping cart management, checkout with M-Pesa payment integration, and a complete admin dashboard for managing products, categories, and orders.

This repository contains the **frontend** application, which communicates with the Cityshine Spring Boot backend via REST APIs secured with JWT authentication.

### Application Roles

| Role | Description |
|------|-------------|
| **Customer** | Browse products, manage cart, place orders, track orders |
| **Admin** | Manage products, categories, orders, users, view dashboard stats |

---

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Framework** | React 18+ |
| **Styling** | Tailwind CSS (with dark mode support) |
| **Icons** | React Icons (`react-icons/fa`) |
| **Routing** | React Router DOM |
| **HTTP Client** | Axios (via custom `apiCall` wrapper) |
| **State Management** | React Context + local state |
| **Authentication** | JWT (Bearer token) |
| **Notifications** | Inline alerts / custom modals |

---

## Features

### 🛍️ Customer Features
- User registration, login, and email verification
- Product browsing with categories and filters
- Search products by name, brand, or category
- Product details with variants (color, condition) and stock
- Shopping cart and wishlist
- Checkout with M-Pesa / Cash on Delivery
- Order history and tracking
- Address management (Kenyan counties, wards, and constituencies)

### 🛠️ Admin Features
- **Dashboard** with real-time stats (total orders, pending, processing, delivered, unpaid)
- **Order Management**
  - View all orders with pagination
  - Search by order ID, customer name, email, or phone
  - Filter by order status
  - Update order status (`PENDING → CONFIRMED → PROCESSING → DELIVERED`)
  - Cancel orders (before delivery)
  - View order details, items, addresses, and payment info
- **Product Management**
  - Create, edit, delete products
  - Manage variants, categories, and resources (images)
  - Feature products and set new arrivals
- **User Management**
- **Category Management**

### 🎨 UI/UX Features
- Fully responsive (mobile-first)
- Dark mode support across all pages
- Loading states and skeleton screens
- Error boundaries and graceful error handling
- Pagination with server-side fetching
- Search & filter with debouncing (recommended)
- Accessible form inputs and buttons

---

## Getting Started

### Prerequisites

- **Node.js** `>= 18.x`
- **npm** `>= 9.x` or **yarn** `>= 1.22.x`
  

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourorg/cityshine-frontend.git
cd cityshine-frontend

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Configure environment variables (see below)

# 5. Start the development server
npm run dev
```

The app will be available at **`http://localhost:5173`** (Vite) or **`http://localhost:3000`** (CRA).

---

## Project Structure

```
cityshine-frontend/
├── public/
├── src/
│   ├── api/                    # API service modules
│   │   ├── apiClient.js        # Axios instance + apiCall wrapper
│   │   ├── order.js            # Order-related endpoints
│   │   ├── product.js          # Product endpoints
│   │   ├── auth.js             # Authentication endpoints
│   │   └── ...
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   ├── components/             # Reusable UI components
│   │   ├── layouts/
│   │   │   ├── OrderStatusBadge.jsx
│   │   │   ├── Navbar.jsx
│   │   │   └── Footer.jsx
│   │   ├── Table.jsx           # Generic table w/ pagination & sorting
│   │   ├── Modal.jsx
│   │   ├── Loader.jsx
│   │   └── ...
│   ├── context/                # React Context providers
│   │   ├── AuthContext.jsx
│   │   ├── CartContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/                   # Static config & column defs
│   │   ├── ordersColumns.js
│   │   └── productColumns.js
│   ├── pages/                  # Route-level components
│   │   ├── admin/
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── shop/
│   │   │   ├── Home.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   └── Checkout.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   └── ...
│   ├── routes/                 # Route configuration
│   │   ├── ProtectedRoute.jsx
│   │   └── index.jsx
│   ├── utils/                  # Helper functions
│   │   ├── formatCurrency.js
│   │   ├── formatDate.js
│   │   └── validators.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API base URL
VITE_API_BASE_URL=http://localhost:8080

# App configuration
VITE_APP_NAME=Cityshine
VITE_APP_ENV=development

# Feature flags
VITE_ENABLE_MPESA=true
VITE_ENABLE_DARK_MODE=true
```

> **Note:** Vite requires variables to be prefixed with `VITE_` to be exposed to the client. If using Create React App, prefix with `REACT_APP_` instead.

---

## API Integration

All backend calls go through the `apiCall` wrapper in `src/api/apiClient.js`:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach JWT on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export const apiCall = async (method, url, data, params, requiresAuth = false) => {
  const response = await api.request({
    method,
    url,
    data,
    params,
    headers: requiresAuth
      ? { Authorization: `Bearer ${localStorage.getItem("token")}` }
      : {},
  });
  return response.data;
};
```

### Available API Modules

| Module | Endpoints |
|--------|-----------|
| `auth.js` | `/api/auth/login`, `/api/auth/register`, `/api/auth/verify`, `/api/auth/refresh` |
| `order.js` | `/api/orders`, `/api/orders/:id/confirmed`, `/api/orders/:id/processing`, `/api/orders/:id/delivered`, `/api/orders/:id/cancel` |
| `product.js` | `/api/products`, `/api/products/:id`, `/api/products/search` |
| `category.js` | `/api/categories` |
| `payment.js` | `/api/payments/mpesa`, `/api/payments/cod` |

---

## Order Lifecycle

Orders follow a **strictly linear state machine** enforced on both frontend and backend:

```
PENDING ──► CONFIRMED ──► PROCESSING ──► DELIVERED
   │            │
   └────► CANCELLED ◄────┘
```

### Valid Transitions

| From | To (allowed) |
|------|--------------|
| `PENDING` | `CONFIRMED`, `CANCELLED` |
| `CONFIRMED` | `PROCESSING`, `CANCELLED` |
| `PROCESSING` | `DELIVERED` |
| `DELIVERED` | *(terminal)* |
| `CANCELLED` | *(terminal)* |

### Frontend Rules

- **Disable buttons** when the action isn't valid for the current status
- **Hide/disable** status actions for terminal states (`DELIVERED`, `CANCELLED`)
- Backend rejects invalid or repeated transitions — the UI should pre-empt these to avoid confusion

> 💡 **Tip:** Always check `order.orderStatus` before rendering an action button. See `src/data/ordersColumns.js`.

---

## State Management

| Concern | Where it lives |
|---------|---------------|
| Authentication (user, token) | `AuthContext` + `localStorage` |
| Shopping cart | `CartContext` + `localStorage` |
| Theme (light/dark) | `ThemeContext` + `localStorage` |
| Page-level data | Local `useState` in each page |
| Server cache | Fresh fetch on mount (no global cache) |

### Custom Hooks

- `useOrderStatus()` — returns helpers like `isFinalStatus(status)` and `getStatusColor(status)`
- `useAuth()` — access current user and auth actions
- `useCart()` — access cart items and mutations

---

## Styling & Theming

The project uses **Tailwind CSS** with dark mode enabled via class strategy.

```javascript
// tailwind.config.js
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
};
```

### Design Tokens

| Token | Value |
|-------|-------|
| Primary | `blue-600` |
| Success | `green-500` |
| Warning | `yellow-500` |
| Danger | `red-500` |
| Surface | `white` / `gray-800` (dark) |
| Background | `gray-50` / `gray-900` (dark) |
| Border | `gray-200` / `gray-700` (dark) |

### Responsive Breakpoints

| Breakpoint | Width |
|-----------|-------|
| `sm` | ≥ 640px |
| `md` | ≥ 768px |
| `lg` | ≥ 1024px |
| `xl` | ≥ 1280px |

---

## Available Scripts

```bash
# Start dev server with HMR
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview

# Run ESLint
npm run lint

# Run unit tests (Vitest)
npm run test

# Run tests with coverage
npm run test:coverage
```

---

## Known Patterns & Conventions

### 📦 Data Fetching Pattern

```javascript
const [data, setData] = useState(initialState);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState(null);

const fetchData = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await someAPI(params);
    setData(response);
  } catch (err) {
    setError(err.message || "Something went wrong");
  } finally {
    setIsLoading(false);
  }
}, [params]);

useEffect(() => {
  fetchData();
}, [fetchData]);
```

### 🎨 Component Naming

- **Pages**: `PascalCase.jsx` in `src/pages/`
- **Components**: `PascalCase.jsx` in `src/components/`
- **Utilities**: `camelCase.js` in `src/utils/`
- **Column definitions**: `camelCaseColumns.js` in `src/data/`

### 🔒 Protected Routes

```jsx
<Route
  path="/admin/orders"
  element={
    <ProtectedRoute requiredRole="ADMIN">
      <AdminOrders />
    </ProtectedRoute>
  }
/>
```

### ⚠️ Error Handling

- All async calls wrapped in `try/catch`
- User-facing errors via `alert()` or a modal (consider migrating to a toast library)
- Console errors preserved for debugging

### 🚦 Order Status Buttons — Recommended Pattern

```jsx
const canUpdateStatus = (order, targetStatus) => {
  if (order.orderStatus === targetStatus) return false;
  if (order.orderStatus === "DELIVERED") return false;
  if (order.orderStatus === "CANCELLED") return false;
  return true;
};

<button
  disabled={!canUpdateStatus(order, "DELIVERED")}
  onClick={() => handleStatusUpdate(order.id, "DELIVERED")}
  className="..."
>
  Mark as Delivered
</button>
```

---

## Troubleshooting

### 🔴 `IllegalStateException: Cannot change order status from X to X`

**Cause:** You clicked a status button for an order already in that status.
**Fix:**
1. Ensure the button is **disabled** when `order.orderStatus === targetStatus`
2. Backend should also be idempotent (return success without state change)

### 🔴 401 Unauthorized on API calls

- Verify `localStorage.token` is set after login
- Check token expiration; the response interceptor redirects to `/login` on 401
- Ensure the backend CORS config allows your frontend origin

### 🔴 `Network Error` on checkout

- Confirm the backend is running on the URL in `.env`
- Verify M-Pesa sandbox credentials are set on the backend

### 🔴 Dark mode not applying

- Ensure `dark` class is toggled on `<html>` element (via `ThemeContext`)
- Confirm `darkMode: "class"` is set in `tailwind.config.js`

### 🔴 Slow initial load

- The backend has N+1 query issues on product endpoints — expect latency for large lists
- Consider caching product lists client-side or asking the backend team to use `JOIN FETCH`

---

## Contributing

### Branch Naming

```
feature/<short-description>
fix/<short-description>
chore/<short-description>
```

### Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(orders): add bulk cancel action
fix(products): prevent double submit on create
chore(deps): bump tailwindcss to 3.4.1
```

### Pull Request Checklist

- [ ] Code passes `npm run lint`
- [ ] No console errors in browser
- [ ] Tested on mobile (≤ 640px) and desktop (≥ 1280px)
- [ ] Tested in both light and dark modes
- [ ] Backend contracts (request/response shapes) verified
- [ ] Screenshots attached for UI changes

---

## Contact

- **Frontend Lead:** [name@cityshine.co.ke](mailto:name@cityshine.co.ke)
- **Backend Repo:** [cityshine-backend](https://github.com/yourorg/cityshine-backend)
- **Staging:** `https://staging.cityshine.co.ke`
- **Production:** `https://cityshine.co.ke`

---

## License

© 2026 Cityshine. All rights reserved. Proprietary and confidential.
