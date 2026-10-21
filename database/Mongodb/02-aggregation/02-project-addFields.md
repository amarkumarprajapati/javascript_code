# $project and $addFields / $set Stages

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


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
