# Authentication & Security (Node/Express)

## Authentication vs Authorization
- **Authentication** — who are you? (login)
- **Authorization** — what can you do? (roles/permissions)

## Password hashing — bcrypt
Never store plaintext passwords.
```js
const bcrypt = require("bcrypt");
const hash = await bcrypt.hash(password, 10);   // salt rounds
const ok = await bcrypt.compare(password, hash);
```

## JWT (JSON Web Token)
Stateless auth. Token = `header.payload.signature` (base64), signed with a secret.
```js
const jwt = require("jsonwebtoken");

// issue on login
const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
  expiresIn: "15m",
});

// verify middleware
function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ msg: "No token" });
  try {
    req.user = jwt.verify(header.split(" ")[1], process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ msg: "Invalid/expired token" });
  }
}
```

## Access + Refresh tokens
- **Access token** — short-lived (15m), sent on each request.
- **Refresh token** — long-lived (7d), stored httpOnly cookie / DB, used to get new access tokens.
- Why? Limits damage if access token leaks; lets you revoke sessions.

## Sessions vs JWT
| | Sessions | JWT |
| --- | --- | --- |
| State | server stores session | stateless |
| Scaling | needs shared store (Redis) | easy horizontal scale |
| Revoke | easy (delete session) | hard (use short expiry + blacklist) |

## Role-based authorization
```js
const authorize = (...roles) => (req, res, next) =>
  roles.includes(req.user.role) ? next() : res.status(403).json({ msg: "Forbidden" });

app.delete("/users/:id", auth, authorize("admin"), deleteUser);
```

## Security checklist (mention in interviews)
- Hash passwords (bcrypt/argon2), never log them.
- `helmet` for secure headers.
- Validate/sanitize input (Joi/zod) → prevent injection.
- Parameterized queries / Mongoose → prevent SQL/NoSQL injection.
- `cors` with explicit origins.
- Rate limiting + account lockout → brute force.
- HTTPS only; secrets in env vars, never in code.
- httpOnly + secure + sameSite cookies → mitigate XSS/CSRF.
- Keep deps updated (`npm audit`).

## Common attacks
- **XSS** — inject scripts → sanitize output, CSP.
- **CSRF** — forged requests → sameSite cookies / CSRF tokens.
- **SQL/NoSQL injection** → parameterize, validate.
- **Brute force** → rate limit.

---

## Common interview questions
1. **JWT vs session auth?** → stateless vs server-stored; scaling/revocation tradeoffs.
2. **Why refresh tokens?** → short access token + revocable long-lived refresh.
3. **How store passwords?** → bcrypt hash + salt, never plaintext.
4. **Prevent NoSQL injection?** → validate input, avoid raw user objects in queries.
5. **Where store JWT on client?** → httpOnly cookie (safer) vs memory; avoid localStorage for sensitive tokens.
