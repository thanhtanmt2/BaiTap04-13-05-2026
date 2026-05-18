# 🛍️ Shop Feature Guide

## Overview
A complete e-commerce shop system has been added to the user profile with product browsing, filtering, searching, and pagination.

## ✨ Features

### 1. **Product Display**
- Grid layout showing 12 products per page
- Each product displays:
  - Product image
  - Name, category, size, color
  - Price (in red for emphasis)
  - Stock quantity
  - Rating with review count
  - Sales statistics (total sold, week, day)
  - Hot badge for trending items

### 2. **Search Functionality**
- Real-time search by product name
- Case-insensitive matching
- Instant results update

### 3. **Advanced Filters**
- **Category Filter**: Shirt, Pants, Dress, Jacket, Skirt, Shorts, Hoodie, Sweater, Coat, Accessories
- **Size Filter**: XS, S, M, L, XL, XXL
- **Color Filter**: Search by color name
- **Price Range**: Slider from $0 to $200
- **Clear All Filters**: One-click reset

### 4. **Sorting Options**
- Newest (default)
- Price: Low to High
- Price: High to Low
- Highest Rated
- Best Sellers
- Trending (based on weekly sales)

### 5. **Pagination**
- 12 products per page
- Previous/Next buttons
- Current page indicator
- Total pages display

## 📊 Product Information

Each product includes:
```
{
  id: number,
  name: string,
  category: enum (shirt|pants|dress|jacket|skirt|shorts|hoodie|sweater|coat|accessories),
  price: decimal,
  color: string,
  size: enum (XS|S|M|L|XL|XXL),
  quantity_stock: number,        // Available quantity
  quantity_sold: number,         // Total sold
  quantity_sold_month: number,   // Sold this month
  quantity_sold_week: number,    // Sold this week
  quantity_sold_day: number,     // Sold today
  rating: decimal (0-5),
  rating_count: number,
  image_url: string,
  is_active: boolean
}
```

## 🔌 API Endpoints

### Get Products with Filters
```bash
GET /api/products?search=shirt&category=shirt&size=M&color=blue&priceMin=10&priceMax=50&sort=price_low&page=1&limit=12
```

**Query Parameters:**
- `search`: Search by product name
- `category`: Filter by category
- `size`: Filter by size
- `color`: Filter by color
- `priceMin`: Minimum price
- `priceMax`: Maximum price
- `sort`: Sorting method (newest, price_low, price_high, rating, best_seller, trending)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12)

### Get Single Product
```bash
GET /api/products/:id
```

### Get Categories
```bash
GET /api/products/categories/list
```
Returns all available categories with product counts.

### Get Sizes
```bash
GET /api/products/sizes/list
```
Returns all available sizes with product counts.

### Get Trending Products
```bash
GET /api/products/trending
```
Returns top 8 products based on weekly sales.

### Get Best Sellers
```bash
GET /api/products/best-sellers
```
Returns top 8 products based on total sales.

## 🎨 Frontend Components

### Shop Component (`src/pages/Shop.jsx`)
Main shop interface with:
- Product grid
- Sidebar with filters
- Search bar
- Sort dropdown
- Pagination controls

### UserDashboard Component (`src/pages/user/UserDashboard.jsx`)
Wrapper component with tabs:
- **Profile Tab**: User profile management
- **Shop Tab**: Product shopping

### Styling (`src/pages/Shop.css`)
- Responsive design (mobile, tablet, desktop)
- Hover effects on product cards
- Animated loading spinner
- Filter UI with active states

## 📱 Responsive Design

| Breakpoint | Layout |
|-----------|--------|
| Desktop (1024px+) | Sidebar (250px) + Grid (12 cols) |
| Tablet (768px-1023px) | Sidebar (200px) + Grid (4-5 cols) |
| Mobile (480px-767px) | Full width + Stack filters |
| Small Mobile (<480px) | Single column layout |

## 🔄 Sample Data

12 sample products are automatically seeded:
1. Classic White T-Shirt
2. Black Slim Jeans
3. Summer Floral Dress
4. Leather Jacket
5. Blue Casual Hoodie
6. Red Athletic Shorts
7. Gray Wool Sweater
8. Beige Cotton Skirt
9. Winter Puffer Coat
10. Striped T-Shirt
11. Khaki Chinos
12. Denim Jacket

## 🚀 How to Use

### Access the Shop
1. Login to user account
2. Go to `/user/profile`
3. Click "🛍️ Shop" tab at the top

### Search Products
1. Type in the search box
2. Results update in real-time

### Filter Products
1. Select category from category buttons
2. Choose size from size options
3. Enter color name
4. Adjust price slider
5. Click "Clear All" to reset filters

### Sort Products
1. Use "Sort By" dropdown
2. Choose from: Newest, Price (low-high), Rating, Best Sellers, Trending

### Browse Pages
1. Use "Previous" and "Next" buttons
2. View current page indicator
3. Click buttons to navigate

## 📈 View Products via API

### View all products in dev interface:
```bash
curl http://localhost:3000/api/dev/database/products
```

### View products from frontend:
```bash
curl http://localhost:3000/api/products
```

## 🔧 Database Schema

### Products Table
```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  category ENUM(...) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  color VARCHAR(50) NOT NULL,
  size ENUM('XS', 'S', 'M', 'L', 'XL', 'XXL') NOT NULL,
  quantity_stock INT DEFAULT 0,
  quantity_sold INT DEFAULT 0,
  quantity_sold_month INT DEFAULT 0,
  quantity_sold_week INT DEFAULT 0,
  quantity_sold_day INT DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  image_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

## 🎯 Future Enhancements

- [ ] Add to cart functionality
- [ ] Wishlist feature
- [ ] Product reviews and ratings
- [ ] Order history
- [ ] Payment integration
- [ ] Product detail page
- [ ] Image gallery
- [ ] Stock notifications
- [ ] Related products
- [ ] Admin product management

## ✅ Testing

### Test Search
```bash
curl "http://localhost:3000/api/products?search=shirt"
```

### Test Filter
```bash
curl "http://localhost:3000/api/products?category=shirt&size=M"
```

### Test Sorting
```bash
curl "http://localhost:3000/api/products?sort=price_low"
```

### Test Pagination
```bash
curl "http://localhost:3000/api/products?page=2&limit=12"
```

---

**Note**: "Add to Cart" button is UI placeholder for future implementation.
