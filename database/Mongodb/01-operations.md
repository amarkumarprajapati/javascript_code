# 01 - Basic Operations (CRUD)

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---

## 1.1 Read Operations (Find)

### Easy
```js
// 1. Find all users
db.users.find()

// 2. Find one user by _id
db.users.findOne({ _id: 1 })

// 3. Find all products with rating greater than 4.5
db.products.find({ rating: { $gt: 4.5 } })

// 4. Find users who live in Mumbai
db.users.find({ "address.city": "Mumbai" })

// 5. Find products that have the tag "bestseller"
db.products.find({ tags: "bestseller" })
```

### Medium
```js
// 6. Find users who have at least one payment method of type "upi"
db.users.find({ "paymentMethods.type": "upi" })

// 7. Find products that have variants (variants array is not empty)
db.products.find({ variants: { $ne: [] } })
// or
db.products.find({ "variants.0": { $exists: true } })

// 8. Find orders with status "delivered" and totalAmount > 10000
db.orders.find({
  status: "delivered",
  totalAmount: { $gt: 10000 }
})

// 9. Find users whose favoriteCategories includes category 1
db.users.find({ "preferences.favoriteCategories": 1 })

// 10. Find products where stock is less than 50
db.products.find({ stock: { $lt: 50 } })
```

### Hard
```js
// 11. Find users who have a default payment method of type "card"
db.users.find({
  paymentMethods: {
    $elemMatch: { type: "card", isDefault: true }
  }
})

// 12. Find products that have a variant with storage "512GB"
db.products.find({ "variants.storage": "512GB" })

// 13. Find orders that contain productId 1 inside items array
db.orders.find({ "items.productId": 1 })

// 14. Find reviews that have at least one reply
db.reviews.find({ "replies.0": { $exists: true } })

// 15. Find users who have notifications.email = true AND notifications.push = true
db.users.find({
  "preferences.notifications.email": true,
  "preferences.notifications.push": true
})
```

---

## 1.2 Projection (Select only needed fields)

```js
// 16. Show only firstName, lastName and email of all users
db.users.find({}, { firstName: 1, lastName: 1, email: 1 })

// 17. Show product name, price and rating (exclude _id)
db.products.find({}, { name: 1, price: 1, rating: 1, _id: 0 })

// 18. Show only the city from address of users
db.users.find({}, { "address.city": 1, firstName: 1 })
```

---

## 1.3 Sorting, Limit, Skip

```js
// 19. Top 5 highest rated products
db.products.find().sort({ rating: -1 }).limit(5)

// 20. Cheapest 3 products
db.products.find().sort({ price: 1 }).limit(3)

// 21. Latest 5 orders
db.orders.find().sort({ orderDate: -1 }).limit(5)

// 22. Skip first 5 users and show next 5
db.users.find().skip(5).limit(5)
```

---

## 1.4 Counting & Distinct

```js
// 23. How many users are active?
db.users.countDocuments({ isActive: true })

// 24. How many products belong to category 1?
db.products.countDocuments({ categoryId: 1 })

// 25. Distinct cities of users
db.users.distinct("address.city")

// 26. Distinct brands of products
db.products.distinct("brand")

// 27. Distinct status values in orders
db.orders.distinct("status")
```

---

## 1.5 Create (Insert)

```js
// 28. Insert one new user
db.users.insertOne({
  _id: 13,
  firstName: "Test",
  lastName: "User",
  email: "test@email.com",
  isActive: true,
  address: {
    city: "Noida",
    state: "Uttar Pradesh",
    pincode: "201301",
    coordinates: { lat: 28.5355, lng: 77.3910 }
  },
  preferences: {
    language: "en",
    notifications: { email: true, sms: false, push: true },
    favoriteCategories: [1]
  },
  paymentMethods: [
    { type: "upi", last4: null, provider: "GPay", isDefault: true }
  ]
})

// 29. Insert multiple products
db.products.insertMany([
  {
    _id: 13,
    name: "Test Product 1",
    categoryId: 1,
    brand: "TestBrand",
    price: 1999,
    stock: 100,
    rating: 4.0,
    tags: ["new"],
    specs: { weight: "100g", color: "Black" },
    variants: []
  },
  {
    _id: 14,
    name: "Test Product 2",
    categoryId: 2,
    brand: "TestBrand",
    price: 999,
    stock: 50,
    rating: 3.8,
    tags: ["budget"],
    specs: { weight: "200g", color: "Blue" },
    variants: []
  }
])
```

---

## 1.6 Update

```js
// 30. Update one field
db.users.updateOne(
  { _id: 1 },
  { $set: { "address.city": "Thane" } }
)

// 31. Increase stock of a product by 10
db.products.updateOne(
  { _id: 1 },
  { $inc: { stock: 10 } }
)

// 32. Add a new tag to a product
db.products.updateOne(
  { _id: 3 },
  { $addToSet: { tags: "comfortable" } }
)

// 33. Update nested field inside array (change default payment)
db.users.updateOne(
  { _id: 1, "paymentMethods.isDefault": true },
  { $set: { "paymentMethods.$.isDefault": false } }
)

// 34. Add a new payment method to a user
db.users.updateOne(
  { _id: 4 },
  {
    $push: {
      paymentMethods: {
        type: "card",
        last4: "8888",
        provider: "Visa",
        isDefault: true
      }
    }
  }
)

// 35. Update many documents
db.products.updateMany(
  { stock: { $lt: 50 } },
  { $set: { lowStock: true } }
)
```

---

## 1.7 Delete

```js
// 36. Delete one document
db.users.deleteOne({ _id: 13 })

// 37. Delete many documents
db.products.deleteMany({ brand: "TestBrand" })

// 38. Delete all reviews with rating 1 (be careful!)
// db.reviews.deleteMany({ rating: 1 })
```

---

## Practice Challenges

1. Find all users who live in Maharashtra and are active.
2. Find products that have both tags `"bestseller"` and `"premium"`.
3. Find orders that have more than 1 item.
4. Add a new reply to review `_id: 2`.
5. Decrease the stock of product `_id: 11` by 5.
6. Find users who have no payment methods.
7. Change the status of order 1015 to `"processing"`.
