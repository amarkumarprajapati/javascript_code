# 06 - Working with Nested Arrays & Objects

This file focuses only on deep nested data.

---

## 6.1 Query Nested Objects

```js
// 1. Simple nested field
db.users.find({ "address.city": "Bangalore" })

// 2. Deeper nesting
db.users.find({ "preferences.notifications.email": true })

// 3. Nested object comparison
db.products.find({ "specs.dimensions.height": { $lt: 5 } })
```

---

## 6.2 Update Nested Objects

```js
// 4. Update a nested field
db.users.updateOne(
  { _id: 1 },
  { $set: { "address.pincode": "400002" } }
)

// 5. Update deeper nested field
db.users.updateOne(
  { _id: 2 },
  { $set: { "preferences.notifications.sms": false } }
)

// 6. Replace entire nested object
db.users.updateOne(
  { _id: 4 },
  {
    $set: {
      address: {
        city: "Warangal",
        state: "Telangana",
        pincode: "506001",
        coordinates: { lat: 17.9689, lng: 79.5941 }
      }
    }
  }
)
```

---

## 6.3 Query Arrays of Objects

```js
// 7. Any element matches
db.products.find({ "variants.color": "Black" })

// 8. Multiple conditions on same element → use $elemMatch
db.products.find({
  variants: {
    $elemMatch: {
      color: "Black",
      stock: { $gte: 20 }
    }
  }
})

// 9. Array index position
db.users.find({ "paymentMethods.0.type": "card" })  // first payment method is card
```

---

## 6.4 Update Arrays of Objects

```js
// 10. Update specific array element using $
db.users.updateOne(
  { _id: 1, "paymentMethods.type": "upi" },
  { $set: { "paymentMethods.$.provider": "BHIM" } }
)

// 11. Update all matching array elements (MongoDB 3.6+)
db.products.updateOne(
  { _id: 1 },
  { $set: { "variants.$[elem].stock": 25 } },
  { arrayFilters: [{ "elem.color": "Natural Titanium" }] }
)

// 12. Add new element to array
db.products.updateOne(
  { _id: 3 },
  {
    $push: {
      variants: {
        sku: "NAM-11-GRN",
        color: "Green",
        size: "11",
        price: 9499,
        stock: 20
      }
    }
  }
)

// 13. Remove element from array
db.products.updateOne(
  { _id: 3 },
  { $pull: { variants: { size: "11" } } }
)

// 14. Add only if not already present
db.products.updateOne(
  { _id: 1 },
  { $addToSet: { tags: "flagship" } }
)
```

---

## 6.5 Aggregation on Nested Data

```js
// 15. $unwind nested array
db.orders.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.productId",
      totalSold: { $sum: "$items.quantity" }
    }
  }
])

// 16. $filter inside projection
db.products.aggregate([
  {
    $project: {
      name: 1,
      expensiveVariants: {
        $filter: {
          input: "$variants",
          as: "variant",
          cond: { $gte: ["$$variant.price", 50000] }
        }
      }
    }
  }
])

// 17. $map to transform array
db.products.aggregate([
  {
    $project: {
      name: 1,
      variantColors: {
        $map: {
          input: "$variants",
          as: "v",
          in: "$$v.color"
        }
      }
    }
  }
])

// 18. $size of nested array
db.orders.aggregate([
  {
    $project: {
      _id: 1,
      userId: 1,
      numberOfItems: { $size: "$items" },
      totalAmount: 1
    }
  },
  { $match: { numberOfItems: { $gte: 2 } } }
])
```

---

## 6.6 Nested Array inside Nested Array (Deep)

```js
// 19. Unwind reviews replies
db.reviews.aggregate([
  { $unwind: "$replies" },
  {
    $match: { "replies.isSeller": true }
  },
  {
    $project: {
      productId: 1,
      originalRating: "$rating",
      sellerReply: "$replies.comment"
    }
  }
])

// 20. Count how many replies each review has
db.reviews.aggregate([
  {
    $project: {
      productId: 1,
      rating: 1,
      replyCount: { $size: "$replies" }
    }
  },
  { $sort: { replyCount: -1 } }
])
```

---

## Practice Challenges

1. Find all products that have a variant with `stock = 0`.
2. Add a new payment method (type: `"wallet"`, provider: `"Amazon Pay"`) to user `_id: 10`.
3. Update the stock of the variant with sku `"IP15P-256-NAT"` to 18.
4. Using aggregation, show each product with only the variants that have stock > 30.
5. Find users who have more than 1 payment method.
6. Pull (remove) the tag `"new"` from product `_id: 1` if it exists.
7. Using `$map`, create an array of all variant skus for every product.
