-- Zodiac Store Database Schema
-- Run this in phpMyAdmin or MySQL CLI to create the database and tables

CREATE DATABASE IF NOT EXISTS `e-commerce-project` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `e-commerce-project`;

-- Users table
CREATE TABLE IF NOT EXISTS `users` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_name` VARCHAR(255) NOT NULL,
    `user_email` VARCHAR(255) NOT NULL UNIQUE,
    `user_password` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Products table
CREATE TABLE IF NOT EXISTS `products` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `product_name` VARCHAR(255) NOT NULL,
    `product_category` VARCHAR(100) NOT NULL,
    `product_price` DECIMAL(10,2) NOT NULL,
    `product_discount` DECIMAL(10,2) DEFAULT 0,
    `product_special_offer` INT DEFAULT NULL,
    `product_image` VARCHAR(255) DEFAULT NULL,
    `product_image2` VARCHAR(255) DEFAULT NULL,
    `product_image3` VARCHAR(255) DEFAULT NULL,
    `product_image4` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Orders table
CREATE TABLE IF NOT EXISTS `orders` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_cost` DECIMAL(10,2) NOT NULL,
    `order_status` VARCHAR(50) NOT NULL DEFAULT 'on_hold',
    `user_id` INT NOT NULL,
    `user_phone` VARCHAR(50) DEFAULT NULL,
    `user_city` VARCHAR(100) DEFAULT NULL,
    `user_address` TEXT DEFAULT NULL,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Order items table
CREATE TABLE IF NOT EXISTS `order_items` (
    `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `product_image` VARCHAR(255) DEFAULT NULL,
    `product_price` DECIMAL(10,2) NOT NULL,
    `product_quantity` INT NOT NULL DEFAULT 1,
    `user_id` INT NOT NULL,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Payments table
CREATE TABLE IF NOT EXISTS `payments` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `transaction_id` VARCHAR(255) NOT NULL,
    `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Contacts table (for contact form submissions)
CREATE TABLE IF NOT EXISTS `contacts` (
    `contact_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(50) DEFAULT NULL,
    `message` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert sample users
-- Passwords are MD5 hashed. Plaintext passwords shown in comments.
INSERT INTO `users` (`user_name`, `user_email`, `user_password`) VALUES
('Admin User', 'admin123@gmail.com', MD5('admin123')),        -- password: admin123
('John Doe', 'john@example.com', MD5('password123')),         -- password: password123
('Jane Smith', 'jane@example.com', MD5('password123')),       -- password: password123
('Reaksa', 'reaksa@gmail.com', MD5('password123'));           -- password: password123

-- Insert sample products (referencing existing images in img/)
-- Featured / General
INSERT INTO `products` (`product_name`, `product_category`, `product_price`, `product_discount`, `product_special_offer`, `product_image`, `product_image2`, `product_image3`, `product_image4`) VALUES
('Beats Solo Wireless Headphone', 'featured', 299.00, 249.00, 17, 'Headphone.png', 'Headphone.avif', 'Headphone2.avif', 'Headphone3.avif'),
('Wireless Gaming Controller', 'featured', 80.00, 65.00, 19, 'Controller.png', 'Controller2.webp', 'Controller3.webp', 'Controller4.webp'),
('AirPods Pro Gen 2', 'featured', 249.00, 175.00, 30, 'airpods.png', 'ipad.png', 'ipadp2.webp', 'ipadp3.webp'),
('Gaming Mouse Pro', 'featured', 59.00, 45.00, 24, 'mouse.png', 'mouse.png', 'mouse.png', 'mouse.png'),
('27-inch 4K Monitor', 'featured', 499.00, 399.00, 20, 'monitor.png', 'monitor.png', 'monitor.png', 'monitor.png'),
('Mechanical Keyboard RGB', 'featured', 129.00, 99.00, 23, 'keyboard.png', 'keyboard.png', 'keyboard.png', 'keyboard.png');

-- Apple products
INSERT INTO `products` (`product_name`, `product_category`, `product_price`, `product_discount`, `product_special_offer`, `product_image`, `product_image2`, `product_image3`, `product_image4`) VALUES
('iPhone 17 Pro Max', 'apples', 1199.00, 1099.00, 8, 'ip17.png', 'ip17pm2.jpg', 'ip17pm3.jpg', 'ip17pm4.jpg'),
('iPhone 17', 'apples', 899.00, 849.00, 6, 'iphone17.png', 'ip17pm2.jpg', 'ip17pm3.jpg', 'ip17pm4.avif'),
('MacBook Air M3', 'apples', 1299.00, 1199.00, 8, 'MacBook.png', 'macbook_pro.png', 'macbook_pro.png', 'macbook_pro.png'),
('MacBook Pro 16"', 'apples', 2499.00, 2299.00, 8, 'macbook_pro.png', 'MacBook.png', 'macbook_pro.png', 'macbook_pro.png'),
('Apple Watch Series 10', 'apples', 399.00, 349.00, 13, 'watch.png', 'ice_watch.png', 'ice_watch.png', 'ice_watch.png'),
('iPad Pro 12.9"', 'apples', 1099.00, 999.00, 9, 'ipad_screen.png', 'ipad.png', 'ipadp2.jpg', 'ipad4.jpg');

-- Samsung products
INSERT INTO `products` (`product_name`, `product_category`, `product_price`, `product_discount`, `product_special_offer`, `product_image`, `product_image2`, `product_image3`, `product_image4`) VALUES
('Samsung Galaxy A56', 'samsungs', 499.00, 449.00, 10, 'A56.png', 'A56.png', 'A56.png', 'A56.png'),
('Samsung Galaxy Book4', 'samsungs', 899.00, 799.00, 11, 'GalaxyBook.png', 'GalaxyBook.png', 'GalaxyBook.png', 'GalaxyBook.png'),
('Samsung Galaxy Tab S6', 'samsungs', 649.00, 549.00, 15, 'TabS6.png', 'TabS6.png', 'TabS6.png', 'TabS6.png'),
('Samsung Smart Watch', 'samsungs', 299.00, 249.00, 17, 'samsung_watch.png', 'samsung_watch.png', 'samsung_watch.png', 'samsung_watch.png'),
('Samsung Neo TV', 'samsungs', 1299.00, 1099.00, 15, 'Neo.png', 'Neo.png', 'Neo.png', 'Neo.png'),
('Samsung Refrigerator', 'samsungs', 1899.00, 1699.00, 11, 'Refrigerator.png', 'Refrigerator.png', 'Refrigerator.png', 'Refrigerator.png');

-- Sony products
INSERT INTO `products` (`product_name`, `product_category`, `product_price`, `product_discount`, `product_special_offer`, `product_image`, `product_image2`, `product_image3`, `product_image4`) VALUES
('Sony PlayStation 5 Console', 'sony', 499.00, 449.00, 10, 'PS5.png', 'ps5 console2.webp', 'ps5 console3.webp', 'ps5 console4.webp'),
('Sony PS5 DualSense Controller', 'sony', 79.00, 69.00, 13, 'Controller.png', 'Controller2.webp', 'Controller3.webp', 'Controller4.webp'),
('Sony Bravia XR TV', 'sony', 1499.00, 1299.00, 13, 'Sony_TV.png', 'TV.png', 'TV.png', 'TV.png'),
('Sony WH-1000XM5 Headphones', 'sony', 349.00, 299.00, 14, 'Sony_Headphone.png', 'Headphone.png', 'Headphone.avif', 'Headphone2.avif'),
('Sony Alpha Camera', 'sony', 1999.00, 1799.00, 10, 'Sony_Camera.png', 'camera.png', 'camera.png', 'camera.png'),
('Sony PlayStation 2 Classic', 'sony', 199.00, 149.00, 25, 'PS2.png', 'PS5.png', 'PS5.png', 'PS5.png');

-- Panasonic products
INSERT INTO `products` (`product_name`, `product_category`, `product_price`, `product_discount`, `product_special_offer`, `product_image`, `product_image2`, `product_image3`, `product_image4`) VALUES
('Panasonic Inverter Refrigerator', 'panasonics', 1599.00, 1399.00, 13, 'Panasonic_Refri.png', 'Refrigerator.png', 'Refrigerator.png', 'Refrigerator.png'),
('Panasonic Air Conditioner', 'panasonics', 899.00, 799.00, 11, 'AC.png', 'AC.png', 'AC.png', 'AC.png'),
('Panasonic Hair Dryer', 'panasonics', 129.00, 99.00, 23, 'Dryer.png', 'Dryer.png', 'Dryer.png', 'Dryer.png'),
('Panasonic Audio Speaker', 'panasonics', 199.00, 169.00, 15, 'Audio.png', 'speaker.png', 'speaker2.png', 'speaker3.png'),
('Panasonic Lumix Camera', 'panasonics', 899.00, 799.00, 11, 'camera.png', 'camera.png', 'camera.png', 'camera.png'),
('Panasonic Home Speaker', 'panasonics', 249.00, 199.00, 20, 'speaker4.png', 'speaker.png', 'speaker2.png', 'speaker3.png');
