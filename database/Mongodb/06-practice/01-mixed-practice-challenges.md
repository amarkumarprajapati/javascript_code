# 20 - Mixed Practice Questions

Solve these without looking at previous files first.

---

## Level 1 – Basics

1. Find all active users who live in Maharashtra.
2. Find products with rating ≥ 4.7.
3. Count how many orders have status `"delivered"`.
4. Show the names of all distinct brands.
5. Find the cheapest product.

---

## Level 2 – Nested & Arrays

6. Find users who have `"upi"` as one of their payment methods.
7. Find products that have more than 2 variants.
8. Find orders that contain productId `1`.
9. Find reviews that have at least one reply from the seller (`isSeller: true`).
10. Find users whose favoriteCategories include both 1 and 3.

---

## Level 3 – Aggregation

11. Calculate total revenue from all delivered orders.
12. Show average product price per category (with category name).
13. Find the top 3 products by total quantity sold.
14. Show number of orders per city.
15. Calculate average rating for each product (show product name too).

---

## Level 4 – Complex

16. Find users who have never placed an order.
17. Show each order with customer full name and list of product names they bought.
18. Find products that are tagged `"bestseller"` and have average review rating ≥ 4.5.
19. Using `$filter`, show only in-stock variants for every product.
20. Create a report: City → Total Revenue → Number of Orders → Average Order Value.

---

## Level 5 – Updates & Indexing

21. Create the most efficient index for this query:  
    `db.orders.find({ status: "delivered", orderDate: { $gte: ISODate("2025-01-01") } }).sort({ orderDate: -1 })`

22. Give 10% discount to all products in category `"Electronics"` (categoryId: 1).

23. Add a new reply to review `_id: 6` from a seller.

24. Decrease stock of all variants of product `_id: 3` that have size `"9"` by 5.

25. Using `explain("executionStats")`, prove that your index for question 21 is being used.

---

## Bonus Challenges

26. Write an aggregation that returns the most popular payment method.
27. Find the user who spent the maximum amount in total.
28. Show products that have never been reviewed.
29. Create a text index and search for products related to “pro” or “max”.
30. Using one aggregation, produce this shape for every user:

```js
{
  fullName: "Aarav Sharma",
  city: "Mumbai",
  totalOrders: 2,
  totalSpent: 167889,
  favoriteCategories: [1, 3]
}
```
