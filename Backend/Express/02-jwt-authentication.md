# JWT Authentication in Express — Full Workflow & All Conditions

## Authentication vs Authorization
- **Authentication** — who are you? (login) → 401 if failed
- **Authorization** — what can you do? (roles) → 403 if failed

## Password hashing (never store plaintext)
```js
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash(password, 10);
const ok = await bcrypt.compare(password, hash);
```

---

## What is JWT?

**JSON Web Token** — a signed string the client sends on each request. Server verifies signature without looking up a session (stateless).

```
header.payload.signature   (3 base64url parts, dot-separated)
```

| Part | Contains |
| --- | --- |
| **Header** | alg (`HS256`), typ (`JWT`) |
| **Payload** | claims: `id`, `role`, `iat`, `exp` |
| **Signature** | HMAC or RSA sign — proves token wasn't tampered |

> Payload is **not encrypted** — only base64. Never put passwords/secrets in it.

---

## Two Approaches — Pick One

| | **Approach 1: Stateless (no DB)** | **Approach 2: With DB** |
| --- | --- | --- |
| Store token on server? | ❌ No | ✅ Refresh token in DB/Redis |
| Verify how? | `jwt.verify()` only | `jwt.verify()` + DB lookup on refresh |
| Logout | Client deletes token; server can't invalidate | Delete refresh from DB → session dead |
| Revoke access? | Wait until `exp` | Instant on refresh token delete |
| Best for | APIs, microservices | Apps needing real logout |

---

## Approach 1 — Stateless JWT (no DB)

Server **never stores the token**. Sign on login, verify on every request.

### Workflow
```
Login
  POST /auth/login {email, pwd} → bcrypt ok → jwt.sign({ id, role }, secret, { expiresIn: "1h" })
  Response: { token } → client stores it

Protected request
  GET /api/profile + Authorization: Bearer <token> → jwt.verify() → req.user → 200

Expired
  jwt.verify throws TokenExpiredError → 401 → client must LOGIN AGAIN

Logout
  Client deletes token → server does NOTHING → token still valid until exp ⚠️
```

```js
const jwt = require("jsonwebtoken");

app.post("/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
});

function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token" });

  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") return res.status(401).json({ msg: "Token expired" });
    return res.status(401).json({ msg: "Invalid token" });
  }
}

app.post("/auth/logout", (req, res) => {
  res.json({ msg: "Delete token on client" }); // server can't invalidate!
});
```

### All conditions — Stateless

| Condition | Server check | HTTP | Client action |
| --- | --- | --- | --- |
| ✅ Valid token | `jwt.verify` ok | 200 | continue |
| ❌ No token | header missing | 401 | login |
| ❌ Malformed token | not 3 parts / bad base64 | 401 | login |
| ❌ Tampered token | signature mismatch | 401 | login |
| ❌ Wrong secret | verify fails | 401 | login |
| ⏰ Expired token | `TokenExpiredError` | 401 | **login again** |
| 🚪 Logged out | token still valid crypto | 200 ⚠️ | server can't stop until exp |
| 🚫 User banned/deleted | token still valid | 200 ⚠️ | add optional DB check in middleware |
| 🔒 Wrong role | auth ok, authorize fails | 403 | show forbidden |

---

## Approach 2 — JWT with DB (refresh token stored)

Access token = stateless (fast). Refresh token = **saved in DB** for revocation.

### Workflow
```
Login
  POST /auth/login → sign access (15m) + refresh (7d)
  RefreshToken.create({ userId, token })  ← DB
  Response: { accessToken } + refreshToken in httpOnly cookie

Protected request
  Bearer accessToken → jwt.verify() only (no DB) → 200 or 401

Access token expired
  POST /auth/refresh (cookie) → jwt.verify(refresh) + RefreshToken.findOne(DB)
  Found → new accessToken | Not found → 401 revoked

Logout
  RefreshToken.deleteMany({ userId })  ← DB
  clearCookie → refresh dead → must login again
  (access token works ~15m more — that's why it's short)
```

```js
app.post("/auth/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ msg: "Invalid credentials" });

  const accessToken = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_SECRET, { expiresIn: "7d" });

  await RefreshToken.create({ userId: user._id, token: refreshToken });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 86400000,
  });
  res.json({ accessToken });
});

app.post("/auth/refresh", async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ msg: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);
    const stored = await RefreshToken.findOne({ userId: payload.id, token });
    if (!stored) return res.status(401).json({ msg: "Revoked" });

    const accessToken = jwt.sign({ id: payload.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "15m" });
    res.json({ accessToken });
  } catch {
    return res.status(401).json({ msg: "Invalid refresh token" });
  }
});

app.post("/auth/logout", auth, async (req, res) => {
  await RefreshToken.deleteMany({ userId: req.user.id });
  res.clearCookie("refreshToken");
  res.json({ msg: "Logged out" });
});
```

**RefreshToken model:**
```js
const refreshTokenSchema = new Schema({
  userId: { type: ObjectId, ref: "User", required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 604800 }, // TTL 7 days
});
```

### All conditions — With DB

| Condition | Server check | HTTP | Client action |
| --- | --- | --- | --- |
| ✅ Valid access token | `jwt.verify` ok | 200 | continue |
| ❌ No access token | header missing | 401 | login or refresh |
| ⏰ Expired access token | `TokenExpiredError` | 401 | call `/auth/refresh` |
| ✅ Valid refresh + in DB | verify + findOne ok | 200 `{ accessToken }` | retry failed request |
| ❌ No refresh cookie | cookie missing | 401 | login |
| ⏰ Expired refresh token | verify fails | 401 | login |
| 🚪 Logged out | refresh deleted from DB | 401 `"Revoked"` | login |
| 🔄 Refresh token reuse | old token after rotation | 401 | possible theft → login |
| 🚫 User banned | all RefreshTokens deleted | 401 on refresh | login |
| 🔒 Wrong role | auth ok, authorize fails | 403 | show forbidden |

---

## Logout comparison

```
Stateless (no DB):
  Client deletes token → Server: token still valid until exp

With DB:
  DELETE refresh from DB → can't get new access token → effectively logged out
  Old access token: works until its 15m expiry (short window)
```

---

## Where to store tokens (client)

| Storage | Access token | Refresh token |
| --- | --- | --- |
| **Memory** | ✅ best | ❌ |
| **httpOnly cookie** | ⚠️ ok | ✅ best (DB approach) |
| **localStorage** | ⚠️ risky | ❌ never — XSS can steal |

**SPA pattern (DB approach):** access in memory + refresh in httpOnly cookie + axios interceptor auto-refreshes on 401.

```js
// axios interceptor example
axios.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401 && !err.config._retry) {
      err.config._retry = true;
      const { data } = await axios.post("/auth/refresh");
      axios.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
      return axios(err.config);
    }
    return Promise.reject(err);
  }
);
```

---

## Role-based authorization
```js
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ msg: "Forbidden" });

app.delete("/users/:id", auth, authorize("admin"), deleteUser);
```

---

## Sessions vs JWT

| | Sessions | JWT |
| --- | --- | --- |
| State | server stores session | stateless (access token) |
| Scaling | needs Redis for multi-server | easy horizontal scale |
| Revoke | easy — delete session | hard — use short expiry + DB refresh |
| Cookie | session ID in cookie | token in header or cookie |

---

## Revocation strategies

| Strategy | Needs DB? | How |
| --- | --- | --- |
| Short access expiry | ❌ | 15m window max |
| Refresh token in DB | ✅ | delete on logout |
| Token blacklist (Redis) | ✅ | store `jti` until `exp` |
| Refresh rotation | ✅ | new refresh each use; reuse = breach |
| `tokenVersion` on user | ✅ | bump on password change → reject old tokens |

---

## Security checklist

- Hash passwords with bcrypt/argon2
- Use separate secrets for access vs refresh tokens
- `httpOnly + secure + sameSite` on refresh cookie
- Never log tokens or passwords
- Validate input (zod/joi) — prevent NoSQL injection
- Rate limit login endpoint
- HTTPS only in production

---

## Interview Q&A

| Question | Answer |
| --- | --- |
| JWT vs session? | JWT = stateless, scales easy; session = server state, easy revoke |
| Why refresh tokens? | Short access (15m) limits leak damage; long refresh in DB = revocable |
| JWT with DB vs without? | Without = no server logout; With = store refresh, real logout |
| How revoke JWT? | Stateless: wait for exp. With DB: delete refresh token |
| Where store on client? | Access in memory; refresh in httpOnly cookie |
| Access vs refresh? | Access = every request; Refresh = only at `/auth/refresh` |
| 401 vs 403? | 401 = not authenticated; 403 = authenticated but not allowed |
| What if token stolen? | Short expiry limits damage; rotation detects reuse; blacklist if needed |
