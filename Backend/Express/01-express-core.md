# Express.js Core

Minimal, unopinionated web framework for Node — routing + middleware.

## Basic server
```js
const express = require("express");
const app = express();

app.use(express.json()); // parse JSON body

app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id, q: req.query, body: req.body });
});

app.listen(3000, () => console.log("on 3000"));
```

## Middleware (the heart of Express)
A function `(req, res, next)` that runs in order during the request lifecycle.
```js
// custom logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass control to the next middleware (or end response)
});
```
Types:
- **Application-level** — `app.use(fn)`.
- **Router-level** — on a `Router()`.
- **Built-in** — `express.json()`, `express.static()`.
- **Third-party** — `cors`, `helmet`, `morgan`.
- **Error-handling** — 4 args `(err, req, res, next)`.

> **Order matters** — middleware runs top-to-bottom. Define error handlers **last**.

## Routing & Router
```js
const router = express.Router();
router.get("/", listUsers);
router.post("/", createUser);
app.use("/users", router);
```

## req / res essentials
- `req.params`, `req.query`, `req.body`, `req.headers`, `req.cookies`.
- `res.status(201).json({})`, `res.send()`, `res.redirect()`, `res.set()`.

## Error handling
```js
// async wrapper to avoid try/catch everywhere
const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

app.get("/x", asyncH(async (req, res) => {
  const data = await mayThrow();
  res.json(data);
}));

// centralized error middleware (LAST)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
```

## Common production middleware
```js
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

app.use(helmet());                 // security headers
app.use(cors({ origin: "https://app.com" }));
app.use(rateLimit({ windowMs: 60_000, max: 100 })); // throttle
```

## REST best practices
- Nouns for resources: `/users`, `/users/:id/orders`.
- Verbs via HTTP methods: GET/POST/PUT/PATCH/DELETE.
- Status codes: 200 OK, 201 Created, 204 No Content, 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 500 Server Error.
- Versioning: `/api/v1/...`.
- Consistent error shape, pagination (`?page=&limit=`).

---

## Common interview questions
1. **What is middleware?** → fn with `(req,res,next)` running in the request pipeline.
2. **How does Express handle errors?** → error middleware with 4 args, placed last.
3. **app.use vs app.get?** → use = all methods/middleware; get = route for GET.
4. **next() purpose?** → pass control; `next(err)` jumps to error handler.
5. **Where do you put auth?** → middleware before protected routes.
6. **PUT vs PATCH?** → full replace vs partial update.
