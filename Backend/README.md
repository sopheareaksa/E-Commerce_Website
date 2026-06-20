# Zodiac Store — Laravel Backend API

## Requirements
- PHP 8.2+
- Composer
- MySQL/MariaDB

## Setup

1. **Install dependencies**
```bash
composer install
```

2. **Environment**
Copy `.env.example` to `.env` and set your database credentials:
```env
DB_DATABASE=e-commerce
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

ADMIN_EMAIL=admin123@gmail.com
ADMIN_PASSWORD=admin123
```

3. **Generate app key**
```bash
php artisan key:generate
```

4. **Run migrations & seeders**
```bash
php artisan migrate --seed
```

5. **Serve**
```bash
php artisan serve
```

API runs at `http://localhost:8000/api`

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/register | No | Register user |
| POST | /api/login | No | Login user |
| POST | /api/logout | Yes | Logout |
| GET | /api/me | Yes | Current user |
| PUT | /api/profile | Yes | Update profile |
| PUT | /api/change-password | Yes | Change password |
| GET | /api/products | No | All products |
| GET | /api/products/featured | No | Featured products |
| GET | /api/products/category/{slug} | No | By category |
| GET | /api/products/search?q= | No | Search |
| GET | /api/products/{id} | No | Single product |
| GET | /api/cart | Yes | View cart |
| POST | /api/cart | Yes | Add to cart |
| PUT | /api/cart/{id} | Yes | Update quantity |
| DELETE | /api/cart/{id} | Yes | Remove item |
| POST | /api/orders | Yes | Place order |
| GET | /api/orders | Yes | Order history |
| POST | /api/payments | Yes | Mock payment |
| POST | /api/contact | Yes | Submit contact |
| GET | /api/admin/dashboard | Admin | Dashboard stats |
| GET | /api/admin/users | Admin | All users |
| GET | /api/admin/orders | Admin | All orders |
| GET | /api/admin/products | Admin | All products (admin) |
| POST | /api/admin/products | Admin | Add product |
| PUT | /api/admin/products/{id} | Admin | Edit product |
| DELETE | /api/admin/products/{id} | Admin | Delete product |
