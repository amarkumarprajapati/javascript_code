# Projection (Field Selection)

**Database:** `practice_db`  
**Collections:** `users`, `products`, `orders`, `reviews`, `categories`

---


```js
// 16. Show only firstName, lastName and email of all users
db.users.find({}, { firstName: 1, lastName: 1, email: 1 })

// 17. Show product name, price and rating (exclude _id)
db.products.find({}, { name: 1, price: 1, rating: 1, _id: 0 })

// 18. Show only the city from address of users
db.users.find({}, { "address.city": 1, firstName: 1 })
```

---
