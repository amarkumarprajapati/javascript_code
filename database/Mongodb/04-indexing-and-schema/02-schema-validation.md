# 16 - Schema Validation (Optional but Important)

Even though MongoDB is flexible, you can enforce rules.

---

## 9.1 Create Collection with Validation

```js
// Example: stricter users collection
db.createCollection("users_validated", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["firstName", "lastName", "email", "isActive"],
      properties: {
        firstName: { bsonType: "string" },
        lastName: { bsonType: "string" },
        email: {
          bsonType: "string",
          pattern: "^.+@.+$"
        },
        isActive: { bsonType: "bool" },
        address: {
          bsonType: "object",
          required: ["city", "state"],
          properties: {
            city: { bsonType: "string" },
            state: { bsonType: "string" },
            pincode: { bsonType: "string" }
          }
        },
        paymentMethods: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["type", "isDefault"],
            properties: {
              type: { enum: ["card", "upi", "wallet", "cod"] },
              isDefault: { bsonType: "bool" }
            }
          }
        }
      }
    }
  },
  validationLevel: "moderate",     // or "strict"
  validationAction: "error"        // or "warn"
})
```

---

## 9.2 Add Validation to Existing Collection

```js
db.runCommand({
  collMod: "products",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["name", "price", "categoryId"],
      properties: {
        name: { bsonType: "string" },
        price: { bsonType: "number", minimum: 0 },
        categoryId: { bsonType: "number" },
        rating: { bsonType: "number", minimum: 0, maximum: 5 },
        stock: { bsonType: "number", minimum: 0 }
      }
    }
  },
  validationLevel: "moderate"
})
```

---

## 9.3 Test Validation

```js
// This should fail
db.products.insertOne({
  name: "Invalid Product",
  price: -100,          // negative price not allowed
  categoryId: 1
})
```

---

## Practice

1. Add validation to the `orders` collection so that:
   - `status` must be one of: pending, processing, shipped, delivered, cancelled, returned
   - `totalAmount` must be ≥ 0
   - `items` must be an array with at least 1 element

2. Try inserting an invalid document and observe the error.
