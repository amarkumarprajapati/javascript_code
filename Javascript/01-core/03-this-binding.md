# The `this` Keyword

## Decision tree — "what is `this`?"

```
                       Was the function called with `new`?
                                    │
                       ┌────────────┴────────────┐
                      YES                        NO
                       │                          │
              `this` = new instance        Arrow function?
                                                  │
                                     ┌────────────┴────────────┐
                                    YES                        NO
                                     │                          │
                       `this` = lexical (outer) `this`   Called with .call/.apply/.bind?
                                                                │
                                                  ┌─────────────┴─────────────┐
                                                 YES                          NO
                                                  │                            │
                                          `this` = ctx arg         Called as obj.method()?
                                                                              │
                                                              ┌───────────────┴───────────────┐
                                                             YES                              NO
                                                              │                                │
                                                       `this` = obj           strict → undefined / sloppy → globalThis
```

**Rule of thumb:** look at the **call site** (left of the dot, or `new`, or `.call`). Arrow functions ignore all this — they inherit.

`this` refers to the object that is **executing the current function**. Its value is decided at **call time**, not definition time (except arrow functions).

## The 4 binding rules (in priority order)

### 1. `new` binding (highest)
```js
function User(name) { this.name = name; }
const u = new User("Amar"); // this = the new object
```

### 2. Explicit binding — call / apply / bind
```js
function greet() { console.log(this.name); }
const obj = { name: "Amar" };

greet.call(obj);        // "Amar"  (args comma-separated)
greet.apply(obj);       // "Amar"  (args as array)
const bound = greet.bind(obj);
bound();                // "Amar"  (returns new fn, call later)
```

### 3. Implicit binding — called as a method
```js
const obj = {
  name: "Amar",
  greet() { console.log(this.name); },
};
obj.greet(); // "Amar"  → this = obj (left of the dot)
```
**Lost binding trap:**
```js
const fn = obj.greet;
fn(); // undefined → called standalone, this = global/undefined
```

### 4. Default binding (lowest)
```js
function show() { console.log(this); }
show(); // global object (non-strict) or undefined (strict mode)
```

## Arrow functions — NO own `this`
Arrow functions inherit `this` from their **enclosing lexical scope**. `call/apply/bind` cannot change it.

```js
const obj = {
  name: "Amar",
  regular() { setTimeout(function () { console.log(this.name); }, 0); }, // undefined
  arrow()   { setTimeout(() => console.log(this.name), 0); },             // "Amar"
};
```
> This is why arrow functions are preferred in callbacks inside methods/React.

## call vs apply vs bind

| Method | Invokes now? | Args format |
| --- | --- | --- |
| `call` | yes | comma-separated |
| `apply` | yes | array |
| `bind` | no (returns fn) | comma-separated |

```js
function sum(a, b) { return a + b; }
sum.call(null, 1, 2);  // 3
sum.apply(null, [1, 2]); // 3
const add = sum.bind(null, 1);
add(2); // 3 (partial application)
```

## Polyfills — build call/apply/bind from scratch

```js
// myCall — invoke with given `this` and args
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx ?? globalThis;
  const key = Symbol();          // unique to avoid collision
  ctx[key] = this;               // attach fn temporarily
  const result = ctx[key](...args);
  delete ctx[key];
  return result;
};

// myApply — same but array of args
Function.prototype.myApply = function (ctx, args = []) {
  return this.myCall(ctx, ...args);
};

// myBind — returns a NEW function, doesn't invoke
Function.prototype.myBind = function (ctx, ...preset) {
  const fn = this;
  return function (...rest) {
    return fn.myCall(ctx, ...preset, ...rest);
  };
};
```

---

## Common interview questions
1. **How is `this` determined?** → 4 rules: new > explicit > implicit > default.
2. **Arrow vs regular function `this`?** → Arrow inherits lexically; regular depends on call site.
3. **Difference call/apply/bind?** → bind returns a new function; apply takes array.
4. **Why is `this` undefined in a detached method?** → lost implicit binding.
