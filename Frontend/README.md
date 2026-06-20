# Zodiac Store — React Frontend

## Requirements
- Node.js 18+
- npm

## Setup

1. **Install dependencies**
```bash
npm install
```

2. **Start dev server**
```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

## Environment
The API base URL is configured in `src/api/axios.js`:
```js
baseURL: 'http://localhost:8000/api'
```

## Features
- Responsive storefront with Tailwind CSS
- Dark mode toggle
- Product browsing by category
- Search
- Shopping cart (localStorage for guests, API for logged-in users)
- Checkout & mock payment
- User authentication (login/register)
- Account page with order history
- Admin dashboard (products, orders, users)

## Routes
| Route | Page |
|-------|------|
| `/` | Home |
| `/shop` | All Products |
| `/category` | Categories |
| `/category/:slug` | Category Products |
| `/product/:id` | Product Detail |
| `/search?q=` | Search Results |
| `/cart` | Shopping Cart |
| `/checkout` | Checkout |
| `/payment` | Mock Payment |
| `/account` | My Account |
| `/login` | Login |
| `/register` | Register |
| `/contact` | Contact |
| `/faq` | FAQ |
| `/terms` | Terms |
| `/privacy` | Privacy |
| `/shipping` | Shipping |
| `/admin/dashboard` | Admin Dashboard |
| `/admin/products` | Manage Products |
| `/admin/products/add` | Add Product |
| `/admin/products/edit/:id` | Edit Product |
| `/admin/orders` | View Orders |
| `/admin/users` | View Users |
