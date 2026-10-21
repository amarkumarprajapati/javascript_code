# $group Stage

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 7. Average rating of all products
db.products.aggregate([
  {
    $group: {
      _id: null,
      averageRating: { $avg: "$rating" },
      totalProducts: { $sum: 1 }
    }
  }
])

// 8. Total sales by status
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      totalSales: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  }
])

// 9. Average product price by category
db.products.aggregate([
  {
    $group: {
      _id: "$categoryId",
      avgPrice: { $avg: "$price" },
      maxPrice: { $max: "$price" },
      minPrice: { $min: "$price" },
      count: { $sum: 1 }
    }
  }
])

// 10. How many users per city
db.users.aggregate([
  {
    $group: {
      _id: "$address.city",
      userCount: { $sum: 1 }
    }
  },
  { $sort: { userCount: -1 } }
])
```

---
