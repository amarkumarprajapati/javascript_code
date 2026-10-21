# $unwind Stage

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


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
