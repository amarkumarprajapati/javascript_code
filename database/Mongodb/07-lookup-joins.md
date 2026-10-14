# 07 - $lookup (Joins) & Related Data

MongoDB is not relational, but `$lookup` lets us join collections.

---

## 7.1 Basic $lookup

```js
// 1. Products with category name
db.products.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "categoryInfo"
    }
  }
])

// 2. Clean version (unwind the array)
db.products.aggregate([
  {
    $lookup: {
      from: "categories",
      localField: "categoryId",
      foreignField: "_id",
      as: "categoryInfo"
    }
  },
  { $unwind: "$categoryInfo" },
  {
    $project: {
      name: 1,
      price: 1,
      category: "$categoryInfo.name"
    }
  }
])
```

---

## 7.2 Multiple Lookups

```js
// 3. Orders → User + (later we can join products)
db.orders.aggregate([
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "_id",
      as: "customer"
    }
  },
  { $unwind: "$customer" },
  {
    $project: {
      orderId: "$_id",
      status: 1,
      totalAmount: 1,
      customerName: { $concat: ["$customer.firstName", " ", "$customer.lastName"] },
      customerCity: "$customer.address.city"
    }
  }
])
```

---

## 7.3 Lookup + Unwind Nested Array

```js
// 4. Expand order items and join product details
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $lookup: {
      from: "products",
      localField: "items.productId",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      orderId: "$_id",
      productName: "$product.name",
      quantity: "$items.quantity",
      lineTotal: "$items.lineTotal",
      brand: "$product.brand"
    }
  }
])
```

---

## 7.4 Lookup with Pipeline (Advanced)

```js
// 5. Only join delivered orders of a user
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      let: { userId: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$userId", "$$userId"] },
                { $eq: ["$status", "delivered"] }
              ]
            }
          }
        },
        { $project: { totalAmount: 1, orderDate: 1, status: 1 } }
      ],
      as: "deliveredOrders"
    }
  },
  {
    $project: {
      fullName: { $concat: ["$firstName", " ", "$lastName"] },
      deliveredOrders: 1,
      orderCount: { $size: "$deliveredOrders" }
    }
  }
])
```

---

## 7.5 Reviews with Product & User

```js
// 6. Full review details
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
      as: "reviewer"
    }
  },
  { $unwind: "$product" },
  { $unwind: "$reviewer" },
  {
    $project: {
      rating: 1,
      title: 1,
      comment: 1,
      productName: "$product.name",
      reviewerName: { $concat: ["$reviewer.firstName", " ", "$reviewer.lastName"] },
      helpfulVotes: 1
    }
  }
])
```

---

## 7.6 Left Join Behavior

```js
// 7. Users who never placed an order
db.users.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "userId",
      as: "orders"
    }
  },
  {
    $match: { orders: { $size: 0 } }
  },
  {
    $project: {
      firstName: 1,
      lastName: 1,
      email: 1
    }
  }
])
```

---

## Practice Challenges

1. Show every product with its category name.
2. Show every order with customer full name and city.
3. Create a report: Product Name → Total Quantity Sold → Total Revenue.
4. List all users with the count of their orders.
5. Show reviews that have seller replies, along with product name.
6. Find products that have never been ordered.
