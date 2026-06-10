# Polyfills in JavaScript

## Definition
A **Polyfill** is a piece of code that provides modern functionality to older browsers or environments that do not natively support it. It "fills in" the missing feature, allowing developers to use newer APIs while maintaining backward compatibility.

---

## Why Polyfills?

- Browsers implement new JavaScript features at different speeds.
- Older browsers (e.g., IE11) may never support modern APIs.
- Polyfills let you write modern code that works everywhere.

---

## How Polyfills Work

```js
// Check if the feature exists
if (!Array.prototype.map) {
  // If not, define it
  Array.prototype.map = function(callback, thisArg) {
    // Implementation here
  };
}
```

**Rule**: Only add the polyfill if the native method doesn't exist.

---

## Common Polyfills

### 1. `Array.prototype.map()`

#### Definition
Creates a new array by applying a function to every element.

```js
if (!Array.prototype.map) {
  Array.prototype.map = function(callback, thisArg) {
    if (this == null) throw new TypeError('this is null or undefined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const result = [];
    const array = Object(this);
    const len = array.length >>> 0;

    for (let i = 0; i < len; i++) {
      if (i in array) {
        result[i] = callback.call(thisArg, array[i], i, array);
      }
    }
    return result;
  };
}
```

---

### 2. `Array.prototype.filter()`

#### Definition
Creates a new array with elements that pass the test.

```js
if (!Array.prototype.filter) {
  Array.prototype.filter = function(callback, thisArg) {
    if (this == null) throw new TypeError('this is null or undefined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const result = [];
    const array = Object(this);
    const len = array.length >>> 0;

    for (let i = 0; i < len; i++) {
      if (i in array && callback.call(thisArg, array[i], i, array)) {
        result.push(array[i]);
      }
    }
    return result;
  };
}
```

---

### 3. `Array.prototype.reduce()`

#### Definition
Reduces an array to a single value by applying a function to each element.

```js
if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(callback, initialValue) {
    if (this == null) throw new TypeError('this is null or undefined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const array = Object(this);
    const len = array.length >>> 0;
    let i = 0;
    let accumulator;

    if (arguments.length >= 2) {
      accumulator = initialValue;
    } else {
      if (len === 0) throw new TypeError('Reduce of empty array with no initial value');
      accumulator = array[i++];
    }

    while (i < len) {
      if (i in array) {
        accumulator = callback(accumulator, array[i], i, array);
      }
      i++;
    }

    return accumulator;
  };
}
```

---

### 4. `Array.prototype.forEach()`

#### Definition
Executes a function once for each array element.

```js
if (!Array.prototype.forEach) {
  Array.prototype.forEach = function(callback, thisArg) {
    if (this == null) throw new TypeError('this is null or undefined');
    if (typeof callback !== 'function') throw new TypeError(callback + ' is not a function');

    const array = Object(this);
    const len = array.length >>> 0;

    for (let i = 0; i < len; i++) {
      if (i in array) {
        callback.call(thisArg, array[i], i, array);
      }
    }
  };
}
```

---

### 5. `Function.prototype.bind()`

#### Definition
Creates a new function with `this` permanently bound.

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(thisArg) {
    if (typeof this !== 'function') throw new TypeError(this + ' is not callable');

    const fn = this;
    const boundArgs = Array.prototype.slice.call(arguments, 1);

    function BoundFunction() {
      const args = boundArgs.concat(Array.prototype.slice.call(arguments));
      if (this instanceof BoundFunction) {
        return fn.apply(this, args);
      }
      return fn.apply(thisArg, args);
    }

    if (fn.prototype) {
      BoundFunction.prototype = Object.create(fn.prototype);
    }

    return BoundFunction;
  };
}
```

---

### 6. `Object.assign()`

#### Definition
Copies enumerable own properties from source objects to a target object.

```js
if (!Object.assign) {
  Object.assign = function(target) {
    if (target == null) throw new TypeError('Cannot convert undefined or null to object');

    const to = Object(target);

    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      if (source == null) continue;

      for (const key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          to[key] = source[key];
        }
      }
    }

    return to;
  };
}
```

---

### 7. `Promise` (Basic Polyfill)

#### Definition
A Promise represents a value that may not exist yet but will be resolved in the future.

```js
if (typeof Promise === 'undefined') {
  function Promise(executor) {
    const self = this;
    self.state = 'pending';
    self.value = undefined;
    self.handlers = [];

    function resolve(value) {
      if (self.state === 'pending') {
        self.state = 'fulfilled';
        self.value = value;
        self.handlers.forEach(handle);
        self.handlers = null;
      }
    }

    function reject(reason) {
      if (self.state === 'pending') {
        self.state = 'rejected';
        self.value = reason;
        self.handlers.forEach(handle);
        self.handlers = null;
      }
    }

    function handle(handler) {
      if (self.state === 'pending') {
        self.handlers.push(handler);
      } else {
        if (self.state === 'fulfilled' && typeof handler.onFulfilled === 'function') {
          handler.onFulfilled(self.value);
        }
        if (self.state === 'rejected' && typeof handler.onRejected === 'function') {
          handler.onRejected(self.value);
        }
      }
    }

    this.then = function(onFulfilled, onRejected) {
      return new Promise(function(resolve, reject) {
        handle({
          onFulfilled: function(value) {
            try { resolve(onFulfilled ? onFulfilled(value) : value); }
            catch (ex) { reject(ex); }
          },
          onRejected: function(reason) {
            try { resolve(onRejected ? onRejected(reason) : reason); }
            catch (ex) { reject(ex); }
          }
        });
      });
    };

    executor(resolve, reject);
  }
}
```

---

### 8. `String.prototype.trim()`

#### Definition
Removes whitespace from both ends of a string.

```js
if (!String.prototype.trim) {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, '');
  };
}
```

---

## Polyfill vs Shim

| Polyfill | Shim |
|----------|------|
| Implements a **missing API** exactly as the spec defines | A broader term for any code that intercepts or modifies behavior |
| `Array.prototype.map` in old IE | jQuery normalizing `fetch` behavior |

---

## Using Polyfill Libraries

Instead of writing your own, use well-tested libraries:

```html
<!-- core-js: comprehensive polyfill library -->
<script src="https://cdn.jsdelivr.net/npm/core-js-bundle@3/minified.js"></script>

<!-- polyfill.io: serves only what the browser needs -->
<script src="https://polyfill.io/v3/polyfill.min.js?features=Promise,fetch,Array.prototype.includes"></script>
```

Or with npm:
```bash
npm install core-js
```

```js
import 'core-js/features/promise';
import 'core-js/features/array/find';
```

---

## Key Takeaways
- Polyfills add **modern features** to **older environments**.
- Always check `if (!Feature)` before defining a polyfill.
- Follow the **ECMAScript specification** for correct behavior.
- Prefer libraries like **core-js** or **polyfill.io** in production.
- Polyfills add code size — only include what you need.
