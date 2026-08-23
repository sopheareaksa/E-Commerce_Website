<div align="center">

# ✨ Zodiac Store
### Modern Full-Stack E-Commerce Platform

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Laravel](https://img.shields.io/badge/Laravel-11%2F12-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/)
[![PHP](https://img.shields.io/badge/PHP-8.2%2B-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://www.php.net/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0%2B-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Sanctum](https://img.shields.io/badge/Laravel_Sanctum-Auth-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com/docs/sanctum)
[![Bakong KHQR](https://img.shields.io/badge/Bakong-KHQR_Payment-ED1C24?style=for-the-badge)](https://bakong.nbc.gov.kh/)

<br/>

<p align="center">
  A high-performance, full-stack e-commerce web application featuring a modern <b>React 19</b> frontend and a robust <b>Laravel API</b> backend. Built with real-world payment integrations (<b>Bakong KHQR</b> & <b>ABA PayWay</b>), instantaneous client-side product filtering, email OTP password recovery, Telegram order alerts, dark/light theme switching, and an administrative control panel.
</p>

</div>

---

## 📑 Table of Contents

- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📁 Project Structure](#-project-structure)
- [⚡ Quick Start Guide](#-quick-start-guide)
  - [Prerequisites](#prerequisites)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup (Laravel)](#2-backend-setup-laravel)
  - [3. Frontend Setup (React + Vite)](#3-frontend-setup-react--vite)
- [⚙️ Environment Configuration](#️-environment-configuration)
- [🔐 Default Demo Accounts](#-default-demo-accounts)
- [📡 API Reference](#-api-reference)
- [🚀 Production Build & Deployment](#-production-build--deployment)
- [📄 License & Credits](#-license--credits)

---

## ✨ Key Features

### 🛍️ Storefront & Shopping Experience
- **Instant Product Catalog**: Products are fetched once on initial mount and filtered in real-time on the client side with zero loading skeletons or lag.
- **Brand & Category Browsing**: Dedicated brand catalogs for Apple, Samsung, Sony, Panasonic, and Featured electronics.
- **Real-Time Search & Filters**: Live search input with instant matching across title, category, and price.
- **Rich Product Details**: Dynamic image gallery (multi-angle thumbnails), discount percentage badges, and instant "Add to Cart" or "Buy Now" triggers.

### 💳 Comprehensive Payment Integrations
- **Bakong KHQR**: Native Cambodian dynamic KHQR payment generator (`bakong-khqr` + `qrcode.react`), real-time MD5 transaction check, and instant simulation mode for development.
- **ABA PayWay Gateway**: Integrated checkout flow with signature hashing, webhook callbacks, and sandbox testing capabilities.
- **Cash on Delivery (COD)**: Seamless checkout option for offline payments.
- **Telegram Order Notifications**: Instant order confirmation dispatch to Telegram bot and admin channel.

### 🔐 User Authentication & Security
- **Modal-Based Auth**: Seamless Login, Registration, and Forgot Password modals without jarring page reloads.
- **Laravel Sanctum Auth**: Secure token-based API authentication with bearer tokens.
- **OTP Password Recovery**: 6-digit OTP verification sent via Gmail SMTP for safe password resetting.
- **User Account Center**: Manage profile details, update password, and view order history with status tracking and line-item details.

### 🛒 Hybrid Shopping Cart
- **Dual-Mode Persistence**: Guest cart operates via `localStorage`; authenticated user cart seamlessly synchronizes with the MySQL `cart_items` table.
- **Live Cart Summary**: Real-time tax, discount, subtotal, and grand total calculations.

### 📊 Admin Control Center
- **Overview Dashboard**: Real-time business analytics including total revenue, order count, customer volume, and sales trends.
- **Product Management**: Full CRUD capability (add, edit, delete, multi-image upload management).
- **Order Management**: Inspect order items, customer shipping details, payment transaction IDs, and update fulfillment statuses (`pending`, `processing`, `delivered`, `cancelled`).
- **User Management**: View registered customers and manage account roles.

### 🎨 UI/UX & Theming
- **Dark / Light Mode**: Instant theme toggle with persistent user preference.
- **Mobile-First Responsive Design**: Includes custom mobile bottom navigation (`MobileNav.jsx`) and accessible layout.
- **Interactive Feedback**: Polished toast alerts, confirmation dialogs, and loaders powered by **SweetAlert2** and **Lucide React**.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 19.2 + Vite 8.0 | High-performance SPA with fast HMR |
| **Styling** | Tailwind CSS v4 | Utility-first, modern responsive CSS |
| **Routing** | React Router DOM v7 | Client-side navigation & route guards |
| **Icons & UI** | Lucide React + SweetAlert2 | Sleek icons & interactive feedback modals |
| **Payment SDKs** | `bakong-khqr`, `qrcode.react` | Dynamic KHQR generation & scanning |
| **Backend Framework**| Laravel 11/12 (PHP 8.2+) | RESTful API architecture |
| **API Authentication** | Laravel Sanctum | Bearer token authentication |
| **Database** | MySQL 8.0+ / MariaDB | Relational database with foreign key constraints |
| **Email Services** | Gmail SMTP / PHPMailer | Secure OTP password reset dispatch |
| **Notifications** | Telegram Bot API | Automated real-time order alerts |

---

## 📁 Project Structure

```
E-Commerce-Website/
│
├── Backend/                         # Laravel API Backend
│   ├── app/
│   │   ├── Http/Controllers/        # API Controllers (Auth, Product, Cart, Order, Bakong, ABA, Admin)
│   │   ├── Models/                  # Eloquent Models (User, Product, Order, OrderItem, CartItem, Payment)
│   │   └── Notifications/           # Telegram & Email notifications
│   ├── config/                      # App, database, sanctum, and service configurations
│   ├── database/
│   │   ├── migrations/              # Database schema migrations
│   │   └── seeders/                 # Database seeders
│   ├── routes/
│   │   └── api.php                  # API endpoints definition
│   ├── .env.example                 # Backend environment template
│   └── composer.json
│
├── Frontend/                        # React + Vite Frontend
│   ├── public/
│   │   ├── favicon.svg              # App favicon
│   │   └── img/                     # Product images, brand logos, payment provider assets
│   ├── src/
│   │   ├── admin/                   # Admin pages (Dashboard, Products, Add/EditProduct, Orders, Users)
│   │   ├── api/                     # Axios client & Bakong KHQR helper modules
│   │   ├── components/              # Reusable UI (Navbar, Footer, Modals, ProductCard, MobileNav)
│   │   ├── context/                 # React Context (AuthContext, CartContext, ProductContext, ThemeContext)
│   │   ├── pages/                   # Storefront pages (Home, Shop, Category, Detail, Cart, Checkout, Payment, Account)
│   │   ├── App.jsx                  # Main router and global modal providers
│   │   ├── index.css                # Global Tailwind CSS v4 setup
│   │   └── main.jsx                 # Application entry point
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   └── zodiac_store.sql             # Complete database schema & sample datasets
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start Guide

### Prerequisites

Ensure the following tools are installed on your development machine:
- [PHP](https://www.php.net/) **>= 8.2**
- [Composer](https://getcomposer.org/)
- [Node.js](https://nodejs.org/) **>= 18.0** & **npm**
- [MySQL](https://www.mysql.com/) or a local stack such as **Laragon**, **XAMPP**, or **WampServer**

---

### 1. Database Setup

1. Launch your MySQL server (via Laragon / XAMPP / CLI).
2. Create a database named `e-commerce`:
   ```sql
   CREATE DATABASE `e-commerce` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Import the provided schema and sample data:
   - **Via MySQL CLI**:
     ```bash
     mysql -u root -p e-commerce < database/zodiac_store.sql
     ```
   - **Via phpMyAdmin**: Open phpMyAdmin -> Select `e-commerce` -> Go to **Import** tab -> Upload `database/zodiac_store.sql` -> Click **Go**.

---

### 2. Backend Setup (Laravel)

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd Backend
   ```
2. Install PHP dependencies:
   ```bash
   composer install
   ```
3. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
4. Configure your database credentials in `Backend/.env` (see [Environment Configuration](#️-environment-configuration)).
5. Generate the application encryption key:
   ```bash
   php artisan key:generate
   ```
6. *(Optional)* Run migrations if starting from a fresh database:
   ```bash
   php artisan migrate
   ```
7. Start the Laravel API development server:
   ```bash
   php artisan serve
   ```
   > The API will run at **`http://localhost:8000/api`**.

---

### 3. Frontend Setup (React + Vite)

1. Open a new terminal tab and navigate to the frontend directory:
   ```bash
   cd Frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open **`http://localhost:5173`** in your browser.

---

## ⚙️ Environment Configuration

### Backend Configuration (`Backend/.env`)

```ini
APP_NAME="Zodiac Store"
APP_ENV=local
APP_KEY=base64:...
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Database Settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=e-commerce
DB_USERNAME=root
DB_PASSWORD=

# Laravel Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173

# Gmail SMTP (For OTP Password Reset)
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD="your_gmail_app_password"
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your_email@gmail.com"
MAIL_FROM_NAME="${APP_NAME}"

# ABA PayWay (Sandbox Credentials)
ABA_PAYWAY_MERCHANT_ID=your_merchant_id
ABA_PAYWAY_API_KEY=your_api_key
ABA_PAYWAY_PURCHASE_URL=https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/purchase
ABA_PAYWAY_CHECK_URL=https://checkout-sandbox.payway.com.kh/api/payment-gateway/v1/payments/check-transaction-2
ABA_PAYWAY_RETURN_URL=http://localhost:8000/payway/callback
ABA_PAYWAY_CURRENCY=USD

# Bakong KHQR
BAKONG_ACCOUNT_ID=your_bakong_id@bkrt
BAKONG_ACCOUNT_TYPE=individual
BAKONG_MERCHANT_NAME="Zodiac Store"
BAKONG_MERCHANT_CITY="Phnom Penh"
BAKONG_API_URL=https://api-bakong.nbc.gov.kh
BAKONG_API_TOKEN=your_bakong_api_token

# Telegram Bot (For Instant Order Alerts)
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
TELEGRAM_CHAT_ID=your_telegram_chat_id
```

### Frontend Configuration (`Frontend/.env`)

Create a `.env` file in the `Frontend/` folder if you need custom API URLs:

```ini
VITE_API_URL=http://localhost:8000/api
```

---

## 🔐 Default Demo Accounts

The database comes pre-seeded with the following test credentials:

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Admin** | `admin123@gmail.com` | `admin123` | Full Admin Dashboard & Storefront Access |
| **Customer** | `john@example.com` | `password123` | Standard Storefront & Customer Account |
| **Customer** | `jane@example.com` | `password123` | Standard Storefront & Customer Account |
| **Customer** | `reaksa@gmail.com` | `password123` | Standard Storefront & Customer Account |

> 💡 **Note**: Admin privileges are controlled via the `is_admin` flag on the `users` table, secured via the Laravel `admin` middleware.

---

## 📡 API Reference

### Public Routes
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register` | Register a new user account |
| `POST` | `/api/login` | Log in and receive Sanctum bearer token |
| `POST` | `/api/forgot-password/send-otp` | Send 6-digit OTP to user's email |
| `POST` | `/api/forgot-password/verify-otp` | Verify the 6-digit OTP code |
| `POST` | `/api/forgot-password/reset` | Reset account password with validated OTP |
| `GET` | `/api/products` | Retrieve all products (cached/instant load) |
| `GET` | `/api/products/featured` | Retrieve featured products |
| `GET` | `/api/products/category/{slug}` | Retrieve products by category |
| `GET` | `/api/products/search?q={query}` | Search products by keyword |
| `GET` | `/api/products/{id}` | Get product details by ID |
| `POST` | `/api/bakong/generate-khqr` | Generate dynamic Bakong KHQR code |
| `POST` | `/api/bakong/check-payment` | Check Bakong payment status by MD5 |
| `POST` | `/api/bakong/simulate-payment` | Simulate Bakong payment confirmation |

### Authenticated Routes (`auth:sanctum`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/logout` | Revoke current user session/token |
| `GET` | `/api/me` | Fetch authenticated user profile |
| `PUT` | `/api/profile` | Update personal information |
| `PUT` | `/api/change-password` | Update current password |
| `GET` | `/api/cart` | Get current user's database cart |
| `POST` | `/api/cart` | Add product to cart |
| `PUT` | `/api/cart/{id}` | Update cart item quantity |
| `DELETE`| `/api/cart/{id}` | Remove item from cart |
| `DELETE`| `/api/cart` | Clear entire cart |
| `POST` | `/api/orders` | Place a new order |
| `GET` | `/api/orders` | List authenticated user's order history |
| `GET` | `/api/orders/{id}` | View detailed order info |
| `POST` | `/api/payments/aba/create` | Create ABA PayWay checkout session |
| `POST` | `/api/payments/aba/simulate/{order}`| Simulate ABA PayWay successful transaction |
| `POST` | `/api/contact` | Submit contact form message |

### Admin Routes (`auth:sanctum` + `admin`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/dashboard` | Fetch store stats, revenues, user counts |
| `GET` | `/api/admin/users` | List and manage all registered users |
| `GET` | `/api/admin/orders` | View all customer orders & status |
| `GET` | `/api/admin/products` | List all inventory products |
| `POST` | `/api/admin/products` | Create a new product (with images) |
| `PUT` | `/api/admin/products/{id}` | Update product information |
| `DELETE`| `/api/admin/products/{id}` | Delete a product from database |

---

## 🚀 Production Build & Deployment

1. **Build the Frontend Assets**:
   ```bash
   cd Frontend
   npm run build
   ```
   This generates optimized static production files inside `Frontend/dist/`.

2. **Serve with Web Server**:
   Configure your Nginx/Apache virtual host document root to point to `Frontend/dist/` for the web client, and `Backend/public/` for the API.

3. **Optimize Laravel Backend**:
   ```bash
   cd Backend
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

---

## 📄 License & Credits

- **Author**: **Pheak SopheaReaksa**
- **Purpose**: Academic Assignment & Portfolio Full-Stack Project.
- **License**: Released under the [MIT License](https://opensource.org/licenses/MIT).