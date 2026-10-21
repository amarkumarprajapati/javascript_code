# Multi-Stage Pipelines & Practice Challenges

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---

## Combining Multiple Stages


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


---

## Practice Challenges


1. Find the total revenue generated from all **delivered** orders.
2. Show each category with the number of products in it.
3. Find the user who has spent the most money (sum of totalAmount of their orders).
4. List all tags with how many products have that tag.
5. Show products that have more than 2 variants.
6. Calculate average order value by payment method.
7. Find top 3 cities by number of orders.
