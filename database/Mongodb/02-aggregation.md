# 02 - Aggregation Pipeline

**Database:** `practice_db`

Aggregation is the most powerful feature of MongoDB. Practice these stages step by step.

---

## 2.1 $match (Filter)

```js
// 1. Only delivered orders
db.orders.aggregate([
  { $match: { status: "delivered" } }
])

// 2. Products with rating >= 4.5 and price < 10000
db.products.aggregate([
  {
    $match: {
      rating: { $gte: 4.5 },
      price: { $lt: 10000 }
    }
  }
])

// 3. Users from Mumbai or Delhi
db.users.aggregate([
  {
    $match: {
      "address.city": { $in: ["Mumbai", "Delhi"] }
    }
  }
])
```

---

## 2.2 $project (Shape the output)

```js
// 4. Show only name and final price after 10% discount
db.products.aggregate([
  {
    $project: {
      name: 1,
      originalPrice: "$price",
      discountedPrice: { $multiply: ["$price", 0.9] }
    }
  }
])

// 5. Full name of users
db.users.aggregate([
  {
    $project: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      city: "$address.city",
      email: 1
    }
  }
])

// 6. Calculate line count of items in each order
db.orders.aggregate([
  {
    $project: {
      _id: 1,
      userId: 1,
      status: 1,
      itemCount: { $size: "$items" },
      totalAmount: 1
    }
  }
])
```

---

## 2.3 $group (Aggregation)

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

## 2.4 $unwind (Flatten arrays)

```js
// 11. Unwind tags of products
db.products.aggregate([
  { $unwind: "$tags" },
  {
    $group: {
      _id: "$tags",
      productCount: { $sum: 1 }
    }
  }
])

// 12. Unwind order items and calculate total quantity sold per product
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQuantitySold: { $sum: "$items.quantity" },
      totalRevenue: { $sum: "$items.lineTotal" }
    }
  },
  { $sort: { totalRevenue: -1 } }
])

// 13. Unwind paymentMethods and count how many users use each type
db.users.aggregate([
  { $unwind: "$paymentMethods" },
  {
    $group: {
      _id: "$paymentMethods.type",
      userCount: { $sum: 1 }
    }
  }
])

// 14. Unwind replies inside reviews
db.reviews.aggregate([
  { $unwind: "$replies" },
  {
    $project: {
      productId: 1,
      originalComment: "$comment",
      reply: "$replies.comment",
      isSellerReply: "$replies.isSeller"
    }
  }
])
```

---

## 2.5 $sort + $limit

```js
// 15. Top 3 most expensive products
db.products.aggregate([
  { $sort: { price: -1 } },
  { $limit: 3 },
  { $project: { name: 1, price: 1, brand: 1 } }
])

// 16. Top 5 orders by totalAmount
db.orders.aggregate([
  { $sort: { totalAmount: -1 } },
  { $limit: 5 }
])
```

---

## 2.6 $lookup (Join)

```js
// 17. Join products with their category name
db.products.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "category"
    }
  },
  { $unwind: "$category" },
  {
    $project: {
      name: 1,
      price: 1,
      categoryName: "$category.name"
    }
  }
])

// 18. Orders with user details
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $project: {
      orderId: "$_id",
      status: 1,
      totalAmount: 1,
      customerName: { $concat: ["$user.firstName", " ", "$user.lastName"] },
      city: "$user.address.city"
    }
  }
])

// 19. Reviews with product name and user name
db.reviews.aggregate([
  {
    $lookup: {
      from: "products",
      localField: "productId",
      foreignField: "_id",
      as: "product"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$product" },
  { $unwind: "$user" },
  {
    $project: {
      rating: 1,
      title: 1,
      productName: "$product.name",
      reviewer: { $concat: ["$user.firstName", " ", "$user.lastName"] }
    }
  }
])
```

---

## 2.7 Combining Multiple Stages

```js
// 20. Total revenue by city (advanced)
db.orders.aggregate([
  { $match: { status: { $in: ["delivered", "shipped"] } } },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "user"
    }
  },
  { $unwind: "$user" },
  {
    $group: {
      _id: "$user.address.city",
      totalRevenue: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  { $sort: { totalRevenue: -1 } }
])

// 21. Average rating per product with product name
db.reviews.aggregate([
  {
    $group: {
      _id: "$productId",
      avgRating: { $avg: "$rating" },
      reviewCount: { $sum: 1 }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      productName: "$product.name",
      avgRating: { $round: ["$avgRating", 1] },
      reviewCount: 1
    }
  },
  { $sort: { avgRating: -1 } }
])

// 22. Most sold products (by quantity)
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalQty: { $sum: "$items.quantity" },
      revenue: { $sum: "$items.lineTotal" }
    }
  },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      name: "$product.name",
      totalQty: 1,
      revenue: 1
    }
  },
  { $sort: { totalQty: -1 } }
])
```

---

## 2.8 $addFields / $set

```js
// 23. Add a new field "priceRange"
db.products.aggregate([
  {
    $addFields: {
      priceRange: {
        $switch: {
          branches: [
            { case: { $lt: ["$price", 1000] }, then: "Budget" },
            { case: { $lt: ["$price", 10000] }, then: "Mid-range" },
            { case: { $lt: ["$price", 50000] }, then: "Premium" }
          ],
          default: "Luxury"
        }
      }
    }
  },
  { $project: { name: 1, price: 1, priceRange: 1 } }
])
```

---

## Practice Challenges

1. Find the total revenue generated from all **delivered** orders.
2. Show each category with the number of products in it.
3. Find the user who has spent the most money (sum of totalAmount of their orders).
4. List all tags with how many products have that tag.
5. Show products that have more than 2 variants.
6. Calculate average order value by payment method.
7. Find top 3 cities by number of orders.
