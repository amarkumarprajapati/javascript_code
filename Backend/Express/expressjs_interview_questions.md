# Express.js Interview Questions & Answers

> Source adapted from the uploaded PDF and enhanced with additional practical interview questions.

## What is Express.js?

Express.js is a minimal and flexible web application framework for Node.js used to build:
- REST APIs
- Backend services
- Single Page Application backends
- Microservices
- Full-stack web applications

---

# General Express.js Interview Questions

## 1. What is Express.js?
**Answer:** Express.js is an open-source backend framework built on top of Node.js that simplifies web server and API development.

## 2. What are the key features of Express.js?
**Answer:**
- Middleware support
- Routing
- Template engines
- REST API development
- Static file serving
- Error handling

## 3. Is Express.js frontend or backend?
**Answer:** Backend framework.

## 4. Why use Express.js?
**Answer:** It reduces boilerplate code and speeds up API development.

## 5. Difference between Node.js and Express.js?
**Answer:**

| Node.js | Express.js |
|----------|------------|
| Runtime Environment | Framework |
| Provides core APIs | Provides web features |
| Lower level | Higher level |

## 6. Does Express.js support template engines?
**Answer:** Yes. EJS, Pug, Handlebars and others.

## 7. What databases work with Express.js?
**Answer:**
- MongoDB
- MySQL
- PostgreSQL
- SQLite
- Cassandra

---

# Middleware Interview Questions

## 8. What is Middleware?
Middleware functions execute between request and response.

```js
app.use((req, res, next) => {
  console.log("Request received");
  next();
});
```

## 9. Types of Middleware

### Application Middleware
```js
app.use((req,res,next)=>{
  next();
});
```

### Router Middleware
```js
router.use((req,res,next)=>{
  next();
});
```

### Error Middleware
```js
app.use((err,req,res,next)=>{
  res.status(500).send(err.message);
});
```

### Built-in Middleware
```js
app.use(express.json());
```

### Third Party Middleware
```js
app.use(cors());
```

---

# Routing Interview Questions

## 10. What is Routing?
Routing determines how an application responds to client requests.

```js
app.get("/users", (req,res)=>{
  res.send("Users");
});
```

## 11. What is Dynamic Routing?

```js
app.get("/user/:id", (req,res)=>{
  res.send(req.params.id);
});
```

---

# Error Handling Questions

## 12. How do you handle errors in Express?

```js
app.use((err, req, res, next) => {
  res.status(500).json({
    success:false,
    message:err.message
  });
});
```

## 13. What happens if next(err) is called?
Control moves directly to error-handling middleware.

---

# Process Based Questions

## 14. How do you install Express?

```bash
npm install express
```

## 15. How do you serve static files?

```js
app.use(express.static("public"));
```

## 16. How do you render HTML?

```js
res.sendFile(__dirname + "/index.html");
```

## 17. What is app.use()?
Used to register middleware.

## 18. How do you enable CORS?

```bash
npm install cors
```

```js
const cors = require("cors");
app.use(cors());
```

---

# Advanced Express.js Interview Questions

## 19. Difference between app.get() and app.use()?

**app.get()**
- Specific GET route

**app.use()**
- Middleware
- Works for all HTTP methods

---

## 20. What is express.Router()?

```js
const router = express.Router();

router.get("/", (req,res)=>{
  res.send("Users");
});

module.exports = router;
```

---

## 21. What are Route Parameters?

```js
app.get("/product/:id", (req,res)=>{
  res.send(req.params.id);
});
```

---

## 22. What are Query Parameters?

```js
GET /users?page=1&limit=10
```

```js
req.query.page
```

---

## 23. Difference between req.params and req.query?

| req.params | req.query |
|------------|-----------|
| Route values | URL query values |
| Mandatory routes | Optional filters |

---

## 24. What is req.body?

Contains request payload.

```js
app.use(express.json());
```

---

## 25. What is REST API?

REST API follows:
- GET
- POST
- PUT
- PATCH
- DELETE

---

## 26. Difference between PUT and PATCH?

| PUT | PATCH |
|------|------|
| Full Update | Partial Update |

---

## 27. How do you create a REST API?

```js
app.get("/users", getUsers);
app.post("/users", createUser);
app.put("/users/:id", updateUser);
app.delete("/users/:id", deleteUser);
```

---

## 28. What is JWT Authentication?

JWT is used for stateless authentication.

```js
jwt.sign(payload, secret);
jwt.verify(token, secret);
```

---

## 29. What is Authentication vs Authorization?

| Authentication | Authorization |
|---------------|---------------|
| Who are you? | What can you access? |

---

## 30. How do you upload files in Express?

Using Multer.

```bash
npm install multer
```

---

## 31. What is Helmet?

Security middleware.

```bash
npm install helmet
```

---

## 32. What is Rate Limiting?

Protects APIs from abuse.

```js
express-rate-limit
```

---

## 33. What is Morgan?

Request logging middleware.

```bash
npm install morgan
```

---

## 34. How do you connect MongoDB with Express?

```js
mongoose.connect(process.env.MONGO_URI);
```

---

# Frequently Asked Interview Questions (3-5 Years Experience)

## Q1. Explain Express Request Lifecycle.

Client → Middleware → Route Handler → Response

## Q2. How would you structure a production Express project?

```text
src/
├── controllers
├── routes
├── services
├── middleware
├── models
├── utils
└── app.js
```

## Q3. How do you handle async errors?

```js
try {
  const users = await User.find();
} catch(err){
  next(err);
}
```

## Q4. How do you secure Express APIs?

- Helmet
- JWT
- Rate Limiting
- Validation
- HTTPS
- CORS

## Q5. What are common performance optimizations?

- Caching
- Compression
- Database indexing
- Pagination
- Load balancing

---

# Quick Revision

- Express = Backend Framework
- Middleware = Request processing layer
- Router = Route management
- app.use() = Middleware registration
- express.json() = Parse JSON body
- JWT = Authentication
- Multer = File Upload
- Helmet = Security
- Morgan = Logging
- CORS = Cross-Origin Requests
