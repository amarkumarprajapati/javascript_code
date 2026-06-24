# Express.js — Interview Questions & Answers

---

## General Questions

### 1. What is Express.js?

**Answer:** Express.js is a minimal, unopinionated, open-source **backend web framework** for Node.js. It simplifies building REST APIs, web servers, and microservices by providing routing, middleware, and HTTP utilities on top of Node's low-level `http` module.

Used for:
- REST APIs
- SPA backends
- Microservices
- Full-stack apps (with template engines like EJS, Pug)

```js
const express = require("express");
const app = express();
app.get("/", (req, res) => res.json({ msg: "Hello" }));
app.listen(3000);
```

---

### 2. What is the difference between Node.js and Express.js?

**Answer:**

| Node.js | Express.js |
| --- | --- |
| JavaScript **runtime** | **Framework** built on Node |
| Provides core APIs (`http`, `fs`, `path`) | Provides routing, middleware, req/res helpers |
| Low-level — you write everything | High-level — less boilerplate |
| No built-in routing | Built-in routing system |

Node.js lets JavaScript run on the server. Express sits on top and makes web development faster and cleaner.

---

### 3. Why do engineers use Express.js?

**Answer:** Express reduces boilerplate and speeds up API development. Instead of manually parsing URLs and bodies with the raw `http` module, Express gives you:
- Simple routing (`app.get`, `app.post`)
- Middleware pipeline
- JSON body parsing
- Static file serving
- Large ecosystem (cors, helmet, multer, etc.)

It's flexible — you choose your own DB, auth, and validation libraries.

---

### 4. Is Express.js used in frontend or backend development?

**Answer:** **Backend only.** Express runs on Node.js server and handles HTTP requests from clients (browsers, mobile apps, other services).

---

### 5. What are the key features of Express.js?

**Answer:**
- **Middleware support** — functions that run during request lifecycle
- **Routing** — map HTTP methods + URLs to handlers
- **Template engines** — EJS, Pug, Handlebars for server-rendered HTML
- **Static file serving** — serve CSS, JS, images from a folder
- **Error handling** — centralized error middleware
- **REST API development** — easy JSON APIs with `express.json()`
- **Router** — modular route files for large apps
- **Database agnostic** — works with MongoDB, MySQL, PostgreSQL, SQLite, etc.

---

### 6. Does Express.js support template engines?

**Answer:** Yes. Express supports any template engine that conforms to the `(path, options, callback)` signature.

Popular engines: **EJS**, **Pug**, **Handlebars**, **Mustache**.

```js
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index", { title: "Home" }));
```

---

### 7. Which databases work with Express.js?

**Answer:** Express is database-agnostic — it doesn't include a DB layer. You connect via drivers or ORMs:

- **NoSQL:** MongoDB (Mongoose), Cassandra
- **SQL:** MySQL, PostgreSQL, SQLite (Sequelize, Prisma, raw `pg`/`mysql2`)
- **Cache:** Redis

---

### 8. How do you install Express.js?

**Answer:** Express runs on Node.js — no extra runtime needed.

```bash
npm init -y
npm install express
```

```js
const express = require("express");
const app = express();
app.listen(3000, () => console.log("Server running on 3000"));
```

---

### 9. Which file extension is used for Express programs?

**Answer:** `.js` (JavaScript) or `.ts` (TypeScript with additional setup).

---

### 10. How do you create an HTTP server with Express?

**Answer:**

```js
const express = require("express");
const app = express();

app.get("/users", (req, res) => res.json([]));

app.listen(3000, () => console.log("Listening on port 3000"));
```

`express()` creates the app. `app.listen(port)` starts the HTTP server.

---

## Middleware Questions

### 11. What is middleware in Express.js?

**Answer:** Middleware is a function with signature `(req, res, next)` that runs **between** receiving a request and sending a response. It can execute code, modify req/res objects, end the cycle, or call `next()` to pass control to the next middleware.

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next(); // pass to next middleware
});
```

---

### 12. What are the types of middleware in Express?

**Answer:**

| Type | Example | Purpose |
| --- | --- | --- |
| **Application-level** | `app.use(logger)` | Runs on all/matched routes |
| **Router-level** | `router.use(auth)` | Runs on routes in that router |
| **Built-in** | `express.json()`, `express.static()` | Parse body, serve files |
| **Third-party** | `cors`, `helmet`, `morgan` | Security, logging, CORS |
| **Error-handling** | `(err, req, res, next)` — 4 args | Catch errors; must be **last** |

---

### 13. What does `next()` do?

**Answer:** Passes control to the **next middleware** in the stack. If you don't call `next()` and don't send a response, the request hangs forever.

```js
app.use((req, res, next) => {
  console.log("Before");
  next();
  console.log("After"); // runs after downstream middleware
});
```

---

### 14. What happens when you call `next(err)`?

**Answer:** Skips all remaining regular middleware and jumps directly to the **error-handling middleware** (the one with 4 parameters).

```js
app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err); // jumps to error handler below
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message });
});
```

---

### 15. What is the difference between `app.use()` and `app.get()`?

**Answer:**

| | `app.use()` | `app.get()` / `.post()` etc. |
| --- | --- | --- |
| HTTP methods | All methods | Specific method only |
| Purpose | Register middleware, static files | Route handler |
| Path matching | Prefix match (`/api` matches `/api/users`) | Exact route match |

```js
app.use("/api", router);   // all methods under /api
app.get("/users", handler); // only GET /users
```

---

### 16. When would you use `app.use()`?

**Answer:** To register middleware that applies to multiple routes:
- Body parsing: `app.use(express.json())`
- Logging: `app.use(morgan("dev"))`
- Security: `app.use(helmet())`
- Static files: `app.use(express.static("public"))`
- Mount routers: `app.use("/api/v1/users", usersRouter)`

---

## Routing Questions

### 17. What is routing in Express?

**Answer:** Routing determines how the application responds to a client request to a particular endpoint (URI) and HTTP method (GET, POST, etc.).

```js
app.get("/users", getAllUsers);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
```

---

### 18. What is dynamic routing in Express?

**Answer:** Dynamic routing uses **route parameters** in the URL. The value is extracted via `req.params`.

```js
app.get("/users/:id", (req, res) => {
  res.json({ id: req.params.id }); // GET /users/42 → id = "42"
});

app.get("/users/:userId/orders/:orderId", (req, res) => {
  const { userId, orderId } = req.params;
});
```

---

### 19. What is the difference between `req.params` and `req.query`?

**Answer:**

| | `req.params` | `req.query` |
| --- | --- | --- |
| Source | URL path — `/users/:id` | Query string — `?key=value` |
| Required? | Part of route definition | Optional filters |
| Example | `/users/5` → `{ id: "5" }` | `/users?page=2&limit=10` → `{ page: "2", limit: "10" }` |

```js
// GET /users/5?page=2
req.params.id  // "5"
req.query.page // "2"
```

---

### 20. What is `req.body`?

**Answer:** Contains the parsed **request payload** (POST/PUT/PATCH body). Requires body-parser middleware:

```js
app.use(express.json());       // parse JSON
app.use(express.urlencoded({ extended: true })); // parse form data

app.post("/users", (req, res) => {
  console.log(req.body); // { name: "John", email: "john@mail.com" }
});
```

---

### 21. What is `express.Router()`?

**Answer:** A mini Express app — creates modular, mountable route handlers. Keeps code organized in large applications.

```js
// routes/users.js
const router = express.Router();
router.get("/", listUsers);
router.post("/", createUser);
module.exports = router;

// app.js
app.use("/api/v1/users", require("./routes/users"));
```

---

## REST API Questions

### 22. What is a REST API?

**Answer:** REST (Representational State Transfer) is an architectural style for APIs that uses HTTP methods to perform CRUD operations on resources:

| Method | Action | Example |
| --- | --- | --- |
| GET | Read | `GET /users` |
| POST | Create | `POST /users` |
| PUT | Full update | `PUT /users/1` |
| PATCH | Partial update | `PATCH /users/1` |
| DELETE | Delete | `DELETE /users/1` |

Use **nouns** for resources (`/users`), not verbs (`/getUsers`).

---

### 23. What is the difference between PUT and PATCH?

**Answer:**

| PUT | PATCH |
| --- | --- |
| **Replaces** entire resource | **Updates** only sent fields |
| Client sends complete object | Client sends partial object |
| `{ name, email, age }` all required | `{ name }` only updates name |

```js
// PUT — replace entire user
app.put("/users/:id", (req, res) => User.findByIdAndReplace(req.params.id, req.body));

// PATCH — update only provided fields
app.patch("/users/:id", (req, res) => User.findByIdAndUpdate(req.params.id, req.body));
```

---

### 24. Explain the Express request lifecycle.

**Answer:**

```
Client Request
    ↓
Global Middleware (cors, helmet, express.json, logger)
    ↓
Route Matching (app.get, router.post)
    ↓
Route-specific Middleware (auth, validation)
    ↓
Route Handler (business logic)
    ↓
Response (res.json, res.send, res.status)
    ↓
(if error) → Error Middleware (4 args) → error response
```

---

## Error Handling Questions

### 25. How do you handle errors in Express?

**Answer:** Use error-handling middleware with **4 parameters** `(err, req, res, next)` placed **after** all routes.

```js
// async wrapper — avoids try/catch in every route
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/users", asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json(users);
}));

// centralized error handler (LAST)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Server error",
  });
});
```

---

### 26. How do you handle async errors in Express?

**Answer:** Three approaches:

```js
// 1. try/catch + next(err)
app.get("/users", async (req, res, next) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// 2. async wrapper (recommended)
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app.get("/users", asyncHandler(async (req, res) => {
  res.json(await User.find());
}));
```

Without `next(err)`, unhandled promise rejections crash the server or hang the request.

---

## Security & Production Questions

### 27. What is the difference between Authentication and Authorization?

**Answer:**

| | Authentication | Authorization |
| --- | --- | --- |
| Question | Who are you? | What can you do? |
| How | Login, JWT, session | Roles, permissions |
| HTTP code | **401** Unauthorized | **403** Forbidden |

```js
app.delete("/users/:id", auth, authorize("admin"), deleteUser);
// auth = verify identity → 401 if no token
// authorize = check role → 403 if not admin
```

---

### 28. Where do you put authentication middleware?

**Answer:** Before protected routes — as middleware in the route chain or router level.

```js
// single route
app.get("/profile", auth, getProfile);

// all routes in router
router.use(auth);
router.get("/profile", getProfile);
router.get("/settings", getSettings);
```

---

### 29. What is Helmet?

**Answer:** Security middleware that sets HTTP headers to protect against common web vulnerabilities (XSS, clickjacking, etc.).

```bash
npm install helmet
```

```js
const helmet = require("helmet");
app.use(helmet());
```

Sets headers like `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security`.

---

### 30. What is CORS and how do you enable it?

**Answer:** **Cross-Origin Resource Sharing** — browsers block requests from one origin (e.g. `localhost:3000`) to another (`localhost:5000`) unless the server explicitly allows it.

```bash
npm install cors
```

```js
const cors = require("cors");
app.use(cors({ origin: "https://frontend.com", credentials: true }));
```

Without CORS, frontend JavaScript cannot call your API on a different domain/port.

---

### 31. What is Morgan?

**Answer:** HTTP request **logger** middleware. Logs every incoming request (method, URL, status, response time).

```bash
npm install morgan
```

```js
const morgan = require("morgan");
app.use(morgan("dev")); // GET /users 200 12ms
```

---

### 32. What is rate limiting?

**Answer:** Limits the number of requests a client can make in a time window — protects against brute force and abuse.

```bash
npm install express-rate-limit
```

```js
const rateLimit = require("express-rate-limit");
app.use(rateLimit({ windowMs: 60_000, max: 100 })); // 100 req/min
app.use("/auth/login", rateLimit({ windowMs: 60_000, max: 5 })); // strict on login
```

---

### 33. How do you secure Express APIs?

**Answer:**
- **Helmet** — secure HTTP headers
- **JWT / sessions** — authentication
- **Rate limiting** — prevent brute force
- **Input validation** — Joi/Zod to prevent injection
- **CORS** — restrict allowed origins
- **HTTPS** — encrypt data in transit
- **bcrypt** — hash passwords
- **Parameterized queries** — prevent SQL/NoSQL injection
- **Env variables** — never hardcode secrets

---

## Static Files & HTML Questions

### 34. How do you serve static files in Express?

**Answer:**

```js
app.use(express.static("public"));
// public/style.css  →  GET /style.css
// public/images/logo.png  →  GET /images/logo.png
```

---

### 35. How do you render plain HTML in Express?

**Answer:**

```js
// send a specific HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// or with template engine
app.set("view engine", "ejs");
app.get("/", (req, res) => res.render("index", { title: "Home" }));
```

---

## Project Structure Questions

### 36. How would you structure a production Express project?

**Answer:**

```
src/
├── config/        # env, db connection
├── controllers/   # req/res logic
├── routes/        # route definitions
├── services/      # business logic
├── middleware/    # auth, validation, error
├── models/        # DB schemas
├── utils/         # helpers
└── app.js         # express setup
```

**Separation:** Routes → Controllers → Services → Models. Routes should not contain business logic in large apps.

---

### 37. What is scaffolding in Express?

**Answer:** Scaffolding auto-generates a project skeleton (folders, routes, views) so you start coding faster.

```bash
npx express-generator my-app
# creates: routes/, public/, views/, app.js, bin/www
```

---

### 38. How do you enable debugging for Express?

**Answer:**

```bash
# Linux / Mac
DEBUG=express:* node app.js

# Windows
set DEBUG=express:* && node app.js
```

Shows internal Express routing and middleware logs.

---

## Quick Revision

```
Express        = Backend framework on Node.js
Middleware     = (req, res, next) pipeline
Router         = Modular routes
app.use()      = Register middleware (all methods)
app.get()      = GET route handler
express.json() = Parse JSON body
next(err)      = Jump to error handler
helmet         = Security headers
cors           = Cross-origin access
morgan         = Request logging
rate-limit     = Abuse protection
401            = Not authenticated
403            = Not authorized
PUT            = Full replace
PATCH          = Partial update
```
