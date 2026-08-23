<div align="center">

# ⚛️ Zodiac Store — React 19 Frontend

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)](https://reactrouter.com/)
[![Lucide](https://img.shields.io/badge/Lucide_React-Icons-F56565?style=for-the-badge)](https://lucide.dev/)
[![SweetAlert2](https://img.shields.io/badge/SweetAlert2-Alerts-8B5CF6?style=for-the-badge)](https://sweetalert2.github.io/)
[![Bakong KHQR](https://img.shields.io/badge/Bakong-KHQR_SDK-ED1C24?style=for-the-badge)](https://bakong.nbc.gov.kh/)

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Vercel_Storefront-000000?style=for-the-badge&logo=vercel)](https://frontend-e-commerce-rose-phi.vercel.app)

<br/><br/>

<p align="center">
  A modern, high-performance Single Page Application (SPA) built with <b>React 19</b>, <b>Vite</b>, and <b>Tailwind CSS v4</b>. Features instant client-side catalog filtering, integrated <b>Bakong KHQR</b> & <b>ABA PayWay</b> payment workflows, OTP password reset modals, dark/light theme switching, and an administrative control panel.
</p>

</div>


---

## 📑 Table of Contents

- [✨ Key Features & UX](#-key-features--ux)
- [🛠️ Tech Stack & Dependencies](#️-tech-stack--dependencies)
- [📁 Directory Structure](#-directory-structure)
- [⚡ Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation & Dev Server](#installation--dev-server)
- [⚙️ Environment Variables](#️-environment-variables)
- [🌐 State Management & React Contexts](#-state-management--react-contexts)
- [🗺️ Application Route Map](#️-application-route-map)
- [💳 Payment Integration Architecture](#-payment-integration-architecture)
- [🚀 Building for Production](#-building-for-production)
- [📄 License & Credits](#-license--credits)

---

## ✨ Key Features & UX

- **⚡ Instant Catalog Browsing**: Pre-fetches product datasets on mount to enable instantaneous client-side filtering by category, brand, and pricing without loading skeletons.
- **🇰🇭 Dynamic Bakong KHQR**: Generates National Bank of Cambodia compliant KHQR codes directly in-browser (`bakong-khqr` + `qrcode.react`) with automatic polling and sandbox payment simulation.
- **💳 ABA PayWay Checkout**: Integrated payment flow with status validation and payment simulation triggers.
- **🔐 Global Modal Authentication**: Seamless modal-based Login, Registration, and 6-digit OTP Forgot Password workflows without page reloading.
- **🛒 Synchronized Cart System**: Hybrid persistence using `localStorage` for guests and real-time backend API synchronization for authenticated customers.
- **🌗 Theme Customization**: Smooth Dark/Light mode toggle with persistence via `ThemeContext`.
- **📱 Responsive & Mobile-First**: Tailored mobile navigation bar (`MobileNav.jsx`) with fluid touch interactions and responsive grids.
- **📊 Dedicated Admin Suite**: Comprehensive admin interface with route guards for managing products, orders, inventory images, and customer users.

---

## 🛠️ Tech Stack & Dependencies

| Category | Package | Version | Purpose |
|---|---|---|---|
| **Core Framework** | `react`, `react-dom` | `^19.2.6` | Modern React UI engine |
| **Build Tool** | `vite` | `^8.0.12` | Lightning-fast development & bundling |
| **CSS Framework** | `tailwindcss`, `@tailwindcss/vite` | `^4.3.3` | Next-gen utility-first styling |
| **Client Routing** | `react-router-dom` | `^7.17.0` | Declarative client-side routing & navigation |
| **HTTP Client** | `axios` | `^1.17.0` | API communication with Bearer token interceptors |
| **KHQR Generator** | `bakong-khqr`, `qrcode.react` | `^1.0.20` / `^4.2.0` | Cambodian QR generation & canvas rendering |
| **Feedback & Icons**| `sweetalert2`, `lucide-react` | `^11.26.25` / `^1.17.0` | Interactive modals, toasts, and iconography |

---

## 📁 Directory Structure

```
Frontend/
├── public/
│   ├── favicon.svg                  # Application favicon
│   ├── icons.svg                    # SVG sprite definitions
│   └── img/                         # Product images, brand logos, payment badges
│
├── src/
│   ├── admin/                       # Admin Control Panel Views
│   │   ├── AddProduct.jsx           # Create new product with image uploads
│   │   ├── Dashboard.jsx            # Sales analytics, revenue & order statistics
│   │   ├── EditProduct.jsx          # Edit existing product metadata
│   │   ├── Orders.jsx               # Order list, status update, item breakdown
│   │   ├── Products.jsx             # Product inventory management table
│   │   └── Users.jsx                # Registered customer directory
│   │
│   ├── api/                         # API Client Layer
│   │   ├── axios.js                 # Axios instance with auth interceptor
│   │   └── bakong.js                # Bakong KHQR API client functions
│   │
│   ├── components/                  # Reusable UI Components
│   │   ├── AdminLayout.jsx          # Sidebar and header layout for admin views
│   │   ├── Footer.jsx               # Storefront footer with links & social
│   │   ├── ForgotPasswordModal.jsx  # 3-step OTP email verification modal
│   │   ├── LoginModal.jsx           # Global login modal
│   │   ├── MobileNav.jsx            # Mobile bottom navigation bar
│   │   ├── Navbar.jsx               # Responsive top navigation & cart indicator
│   │   ├── ProductCard.jsx          # Standardized product display card
│   │   ├── ProductSkeleton.jsx      # Placeholder loader skeleton
│   │   ├── RegisterModal.jsx        # Global user registration modal
│   │   └── ScrollToTop.jsx          # Auto-scrolls page to top on route transition
│   │
│   ├── context/                     # Global State Providers
│   │   ├── AuthContext.jsx          # Authentication state, login, register, modal controls
│   │   ├── CartContext.jsx          # Shopping cart items, sync, calculations
│   │   ├── ProductContext.jsx       # Global products fetch & category filtering
│   │   └── ThemeContext.jsx         # Dark / Light theme provider
│   │
│   ├── pages/                       # Storefront Page Views
│   │   ├── Account.jsx              # User profile, password management, order history
│   │   ├── Cart.jsx                 # Shopping cart inspection & modification
│   │   ├── Category.jsx             # Category index page
│   │   ├── CategoryProducts.jsx     # Filtered product listing by category
│   │   ├── Checkout.jsx             # Shipping address input & order placement
│   │   ├── Contact.jsx              # Customer support contact form
│   │   ├── FAQ.jsx                  # Frequently asked questions
│   │   ├── Home.jsx                 # Landing page with hero banner & featured items
│   │   ├── Payment.jsx              # KHQR generator, ABA checkout & COD selector
│   │   ├── Privacy.jsx              # Privacy policy documentation
│   │   ├── ProductDetail.jsx        # Multi-image product view with purchase CTA
│   │   ├── Search.jsx               # Keyword search results view
│   │   ├── Shipping.jsx             # Shipping terms & policy
│   │   ├── Shop.jsx                 # Complete store catalog
│   │   └── Terms.jsx                # Terms & conditions documentation
│   │
│   ├── App.jsx                      # Main router layout & modal injector
│   ├── index.css                    # Tailwind CSS v4 styling & theme utilities
│   └── main.jsx                     # Application bootstrap & Context wrappers
│
├── eslint.config.js
├── index.html
├── package.json
└── vite.config.js
```

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** >= `18.0.0`
- **npm** >= `9.0.0` (or `yarn` / `pnpm`)
- Running Laravel Backend API (default at `http://localhost:8000/api`)

### Installation & Dev Server

1. Navigate to the `Frontend` directory:
   ```bash
   cd Frontend
   ```

2. Install all dependencies:
   ```bash
   npm install
   ```

3. Start the development server with Hot Module Replacement (HMR):
   ```bash
   npm run dev
   ```

4. Open **`http://localhost:5173`** in your browser.

---

## ⚙️ Environment Variables

Create a `.env` file in `Frontend/` if you are connecting to a custom backend host:

```ini
# Base URL for Laravel Backend API
VITE_API_URL=http://localhost:8000/api
```

> If `VITE_API_URL` is omitted, the app defaults to `http://localhost:8000/api`.

---

## 🌐 State Management & React Contexts

The application utilizes modular React Contexts for predictable state management:

| Context | Hook | Responsibilities |
|---|---|---|
| **`AuthContext`** | `useAuth()` | Manages current user state, JWT Sanctum tokens, login/logout, and controls visibility for Login, Register, and Forgot Password modals. |
| **`CartContext`** | `useCart()` | Handles cart additions, quantity updates, item deletions, total price/discount math, and synchronizes guest `localStorage` with `/api/cart`. |
| **`ProductContext`** | `useProducts()` | Fetches products once on initial render and provides client-side category/brand filtering methods. |
| **`ThemeContext`** | `useTheme()` | Manages `dark` / `light` class toggling on the `<html>` document with `localStorage` persistence. |

---

## 🗺️ Application Route Map

### Storefront Routes
| Path | Component | Description |
|---|---|---|
| `/` | `Home` | Hero banner, categories, featured and special offer products |
| `/shop` | `Shop` | Complete product catalog with real-time brand & price filters |
| `/category` | `Category` | Category directory overview |
| `/category/:category` | `CategoryProducts` | Products filtered by brand (e.g. `apples`, `samsungs`, `sonys`) |
| `/product/:id` | `ProductDetail` | Detailed single product view with multi-image gallery |
| `/search` | `Search` | Live keyword search query results |
| `/cart` | `Cart` | Shopping cart review and quantity adjustments |
| `/checkout` | `Checkout` | Shipping address form & order submission |
| `/payment` | `Payment` | Payment gateway interface (Bakong KHQR, ABA PayWay, COD) |
| `/account` | `Account` | Personal profile edit, password update, and order tracking |
| `/contact` | `Contact` | Customer message submission form |
| `/faq` | `FAQ` | Store FAQs |
| `/shipping` | `Shipping` | Delivery & shipping information |
| `/terms` | `Terms` | Terms of service |
| `/privacy` | `Privacy` | Privacy policy |

### Admin Dashboard Routes (`/admin/*`)
| Path | Component | Description |
|---|---|---|
| `/admin/dashboard` | `Dashboard` | Analytics metrics (Total Revenue, Orders, Products, Users) |
| `/admin/products` | `Products` | Inventory management table with search & delete actions |
| `/admin/products/add` | `AddProduct` | Form to upload and publish new products |
| `/admin/products/edit/:id` | `EditProduct` | Form to modify product details, pricing, and images |
| `/admin/orders` | `Orders` | Customer order list with status changer & detailed invoice view |
| `/admin/users` | `Users` | Registered user management table |

---

## 💳 Payment Integration Architecture

The payment system (`src/pages/Payment.jsx` + `src/api/bakong.js`) supports 3 streamlined options:

1. **Bakong KHQR**:
   - Generates an EMVCo-compliant KHQR payload from order details.
   - Renders QR code canvas dynamically using `qrcode.react`.
   - Periodically polls `/api/bakong/check-payment` by MD5 hash.
   - Provides a simulated payment button for testing without requiring a live mobile banking app.
2. **ABA PayWay**:
   - Initiates secure checkout transaction and redirects or polls verification status.
3. **Cash on Delivery (COD)**:
   - Confirms order instantly with on-delivery payment instructions.

---

## 🚀 Building for Production

To create an optimized production build:

```bash
# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

The output bundle will be generated in `Frontend/dist/` ready for deployment on Nginx, Apache, Vercel, or Netlify.

---

## 📄 License & Credits

- **Author**: **Pheak SopheaReaksa**
- **Project**: Zodiac Store E-Commerce SPA
- **License**: Released under the [MIT License](https://opensource.org/licenses/MIT).