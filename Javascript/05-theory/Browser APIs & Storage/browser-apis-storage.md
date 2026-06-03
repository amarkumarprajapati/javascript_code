# Browser APIs & Storage

> 📅 **Day 16** · ~12 min read · browser-only · what JS gets for free from the browser

## Mental model — storage options at a glance

```
                          STORAGE OPTIONS
                                │
        ┌───────────────────────┼────────────────────────────────┐
        ▼                       ▼                                ▼
   localStorage          sessionStorage                     IndexedDB
   ─────────────         ──────────────                    ──────────
   persistent            cleared on tab close              persistent
   ~5 MB                 ~5 MB                              ~50 MB+ (per origin)
   strings only          strings only                       structured (objects)
   sync API              sync API                           async API
   shared across tabs    per-tab                            shared across tabs

                            cookies
                            ───────
                            ~4 KB
                            sent on EVERY request to server
                            for auth, server-readable
```

---

## 1. localStorage & sessionStorage

Same API, different lifetime.

```js
// SET — keys + values are STRINGS only
localStorage.setItem('theme', 'dark');
localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Sam' }));

// GET
localStorage.getItem('theme');                              // 'dark'
const user = JSON.parse(localStorage.getItem('user'));      // {id:1,name:'Sam'}

// REMOVE
localStorage.removeItem('theme');
localStorage.clear();                                       // wipe everything

// LIST
localStorage.length;
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  console.log(key, localStorage.getItem(key));
}
```

### When to choose which

| Need | Use |
|------|-----|
| User preferences (theme, lang) | `localStorage` |
| Multi-step form draft (clear on close) | `sessionStorage` |
| Auth tokens (server-readable) | cookie (HttpOnly + Secure) |
| Large structured data, offline app | `IndexedDB` |
| Tiny temp data | in-memory (`let cache = {}`) |

### Listen to storage changes (cross-tab sync)
```js
window.addEventListener('storage', (e) => {
  console.log(e.key, e.oldValue, '→', e.newValue);
  // fires in OTHER tabs when localStorage changes
});
```

### Wrapper for non-string values
```js
const store = {
  set: (k, v) => localStorage.setItem(k, JSON.stringify(v)),
  get: (k, fallback = null) => {
    const raw = localStorage.getItem(k);
    if (raw === null) return fallback;
    try { return JSON.parse(raw); } catch { return raw; }
  },
  del: (k) => localStorage.removeItem(k),
};
store.set('user', { id: 1 });
store.get('user');                  // { id: 1 }
```

---

## 2. JSON — serialize / deserialize

```js
// stringify — JS value → string
JSON.stringify({ a: 1, b: 'x' });             // '{"a":1,"b":"x"}'
JSON.stringify(obj, null, 2);                 // pretty (2-space indent)
JSON.stringify(obj, ['a', 'b']);              // allow-list of keys
JSON.stringify(obj, (k, v) =>                 // replacer fn
  typeof v === 'bigint' ? v.toString() : v
);

// parse — string → JS value
JSON.parse('{"a":1}');                        // { a: 1 }
JSON.parse(str, (k, v) =>                     // reviver fn
  typeof v === 'string' && /^\d{4}-/.test(v) ? new Date(v) : v
);
```

### What JSON drops / mangles

| Input | After stringify |
|-------|-----------------|
| `function() {}` | dropped |
| `undefined` (in object) | dropped |
| `undefined` (in array) | `null` |
| `NaN`, `Infinity` | `null` |
| `Date` | ISO string ("2025-01-01T…") |
| `Map`, `Set` | `{}` (no entries!) |
| `BigInt` | **throws** (use replacer) |
| circular ref | **throws** |

```js
JSON.stringify({ a: undefined, b: 1, c: () => 1, d: NaN });
// → '{"b":1,"d":null}'
```

---

## 3. Timers

```
                  ┌──────────────┐
   setTimeout    │ fire ONCE    │  after delay ms
                  └──────────────┘
                  ┌──────────────┐
   setInterval   │ fire AGAIN   │  every period ms (until cleared)
                  └──────────────┘
                  ┌──────────────┐
   requestAnimationFrame │ fire BEFORE the next paint │  ~60fps
                  └──────────────┘
```

### setTimeout / clearTimeout
```js
const id = setTimeout(() => console.log('later'), 1000);
clearTimeout(id);                          // cancel before it fires

// args after delay are passed to the callback
setTimeout((name) => console.log('hi', name), 500, 'Sam');
```

### setInterval / clearInterval
```js
const id = setInterval(() => tick(), 1000);
clearInterval(id);

// ⚠️ if the callback takes >1s, intervals can pile up
// safer: chain setTimeout
function loop() {
  doWork();
  setTimeout(loop, 1000);
}
loop();
```

### `setTimeout(fn, 0)` ≠ "immediately"
It schedules the callback after **all current sync code + microtasks**.
```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
console.log('D');
// A, D, C, B
```
See `02-async/01-event-loop.md` for the why.

### requestAnimationFrame — for animations
```js
function animate(timestamp) {
  draw(timestamp);
  if (!done) requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```
Better than `setInterval(16ms)` because the browser syncs it to the display refresh.

---

## 4. Fetch API (the modern XHR)

```js
const res = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Sam' }),
});

if (!res.ok) throw new Error(`HTTP ${res.status}`);
const data = await res.json();
```

Cancelling:
```js
const ctrl = new AbortController();
fetch(url, { signal: ctrl.signal })
  .catch(e => e.name === 'AbortError' && console.log('cancelled'));
setTimeout(() => ctrl.abort(), 2000);
```

---

## 5. Other useful browser APIs (quick mention)

| API | Use |
|-----|-----|
| `navigator.clipboard` | read/write clipboard |
| `navigator.geolocation` | user location |
| `Notification` | desktop notifications |
| `IntersectionObserver` | lazy-load images, infinite scroll |
| `ResizeObserver` | element size changes |
| `MutationObserver` | DOM changes |
| `WebSocket` | bi-directional realtime |
| `EventSource` | server-sent events (one-way) |
| `Web Workers` | run JS off the main thread |
| `Service Worker` | offline / PWA / push |
| `history` | `pushState`, `replaceState`, SPA routing |
| `crypto.randomUUID()` | generate UUID v4 |

---

## Common interview questions

1. **localStorage vs sessionStorage vs cookies?** → see table above (lifetime, size, server access).
2. **Can localStorage store objects?** → No, strings only — `JSON.stringify` first.
3. **What does `setTimeout(fn, 0)` do?** → schedules fn after current sync + microtasks finish.
4. **setInterval vs setTimeout-recursion?** → recursion guarantees gap between executions; setInterval can pile up.
5. **JSON.stringify limitations?** → drops functions/undefined; Date→string; throws on circular/BigInt.
6. **How to cancel a fetch?** → `AbortController`.
