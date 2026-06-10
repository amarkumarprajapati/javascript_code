# JWT (JSON Web Token)

## Definition
**JWT (JSON Web Token)** is an open standard (RFC 7519) that defines a compact, self-contained way to securely transmit information between parties as a JSON object. It is commonly used for **authentication** and **information exchange**.

---

## Structure of a JWT

A JWT consists of **three parts** separated by dots (`.`):

```
header.payload.signature
```

### Example
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

---

## 1. Header

### Definition
Contains metadata about the token, including the signing algorithm and token type.

```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

| Field | Description |
|-------|-------------|
| `alg` | Algorithm used to sign (e.g., HS256, RS256) |
| `typ` | Token type (always "JWT") |

---

## 2. Payload

### Definition
Contains the **claims** — statements about the user and additional data.

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true,
  "iat": 1516239022,
  "exp": 1516242622
}
```

### Standard Claims

| Claim | Description |
|-------|-------------|
| `iss` | Issuer |
| `sub` | Subject (user ID) |
| `aud` | Audience |
| `exp` | Expiration time (Unix timestamp) |
| `nbf` | Not Before |
| `iat` | Issued At |
| `jti` | JWT ID |

### Custom Claims
You can add any custom data:
```json
{
  "userId": "42",
  "role": "admin",
  "department": "engineering"
}
```

---

## 3. Signature

### Definition
The signature ensures the token hasn't been tampered with. It is created by:

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret
)
```

### Purpose
- **Verify** the sender is who they say they are.
- **Ensure** the message hasn't been altered.

---

## How JWT Works in Authentication

```
┌─────────────┐                    ┌─────────────┐
│   Client    │ ──1. Login──────>  │   Server    │
│  (Browser)  │   {email, pass}    │             │
│             │ <─2. JWT Token────  │  Validates  │
│             │                    │  credentials│
│             │ ──3. API Request──>│             │
│             │   Authorization:     │  Verifies   │
│             │   Bearer <token>   │  signature  │
│             │ <─4. Response─────  │             │
└─────────────┘                    └─────────────┘
```

### Step-by-Step Flow
1. **User logs in** with credentials.
2. **Server verifies** credentials and generates a JWT.
3. **Client stores** the JWT (localStorage, cookie, or memory).
4. **Client sends** JWT in the `Authorization` header for subsequent requests.
5. **Server verifies** the JWT signature and processes the request.

---

## JWT in JavaScript

### Generating a JWT (Node.js with `jsonwebtoken`)
```js
const jwt = require('jsonwebtoken');

const payload = { userId: 42, role: 'admin' };
const secret = 'your-secret-key';

const token = jwt.sign(payload, secret, { expiresIn: '1h' });
console.log(token);
```

### Verifying a JWT
```js
try {
  const decoded = jwt.verify(token, secret);
  console.log(decoded); // { userId: 42, role: 'admin', iat: ..., exp: ... }
} catch (err) {
  console.error('Invalid token:', err.message);
}
```

### Decoding Without Verification (Client-side)
```js
const base64Url = token.split('.')[1];
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
const jsonPayload = decodeURIComponent(
  atob(base64)
    .split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
);

const payload = JSON.parse(jsonPayload);
console.log(payload);
```

---

## Storing JWTs

| Storage | Pros | Cons |
|---------|------|------|
| `localStorage` | Persistent, easy to access | Vulnerable to XSS attacks |
| `sessionStorage` | Survives page refresh, tab-only | Vulnerable to XSS |
| `HttpOnly Cookie` | Secure from XSS | Vulnerable to CSRF (use CSRF tokens) |
| Memory | Most secure | Lost on page refresh |

### Best Practice: HttpOnly Cookie (Server-side)
```js
res.cookie('token', jwtToken, {
  httpOnly: true,   // Cannot be accessed by JavaScript
  secure: true,     // Only sent over HTTPS
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000   // 1 hour
});
```

---

## JWT vs Session

| Feature | JWT | Session (Server-side) |
|---------|-----|----------------------|
| Storage | Client (token) | Server (session ID) |
| Scalability | Easy (stateless) | Needs session store |
| Revocation | Hard (token valid until expiry) | Easy (delete session) |
| Size | Larger (contains data) | Small (just session ID) |
| Security | Signatures prevent tampering | Server controls validity |

---

## Security Best Practices

1. **Always use HTTPS** — prevents token interception.
2. **Keep secrets safe** — never expose signing secrets in client code.
3. **Set short expiry** — use refresh tokens for long sessions.
4. **Validate `exp` claim** — reject expired tokens server-side.
5. **Don't put sensitive data** in the payload — it's only Base64 encoded, not encrypted.

---

## Refresh Token Pattern

```js
// Access token (short-lived: 15 min)
const accessToken = jwt.sign({ userId: 42 }, secret, { expiresIn: '15m' });

// Refresh token (long-lived: 7 days)
const refreshToken = jwt.sign({ userId: 42 }, refreshSecret, { expiresIn: '7d' });

// When access token expires, client sends refresh token to get a new one
```

---

## Key Takeaways
- JWT is **self-contained** — all info is in the token.
- The **signature** ensures integrity — don't trust unsigned tokens.
- Store in **HttpOnly cookies** for best security.
- JWTs are **not encrypted** by default — don't put secrets in the payload.
- Use **short-lived access tokens** + **long-lived refresh tokens** for security.
