# Create (Insert Operations)

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


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
