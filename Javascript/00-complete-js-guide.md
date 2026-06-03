# 🟨 Complete JavaScript Guide

> One scrollable reference. Every section: **diagram → definition → code → "without the method" → when to use**.

## Table of Contents
1. [How JS Runs](#1-how-js-runs)
2. [Variables & Data Types](#2-variables--data-types)
3. [Operators](#3-operators)
4. [Control Flow](#4-control-flow)
5. [Loops](#5-loops)
6. [Functions](#6-functions)
7. [Scope, Hoisting, Closures](#7-scope-hoisting-closures)
8. [`this`, call/apply/bind](#8-this-callapplybind)
9. [Objects & Prototypes](#9-objects--prototypes)
10. [Classes & OOP](#10-classes--oop)
11. [Arrays & Methods](#11-arrays--methods)
12. [Strings](#12-strings)
13. [Numbers, Math, BigInt, Date](#13-numbers-math-bigint-date)
14. [Map, Set, WeakMap, WeakSet](#14-map-set-weakmap-weakset)
15. [Iterators & Generators](#15-iterators--generators)
16. [Symbols](#16-symbols)
17. [JSON](#17-json)
18. [Error Handling](#18-error-handling)
19. [Async — Callbacks, Promises, async/await](#19-async)
20. [Event Loop Deep Dive](#20-event-loop)
21. [Modules](#21-modules)
22. [Proxy & Reflect](#22-proxy--reflect)
23. [DOM & Events (Browser)](#23-dom--events)
24. [Storage & Network (Browser)](#24-storage--network)
25. [Functional Patterns](#25-functional-patterns)
26. [Common Polyfills](#26-common-polyfills)
27. [Design Patterns](#27-design-patterns)
28. [Performance & Memory](#28-performance--memory)

---

## 1. How JS Runs

```
   .js file ──▶ Parser ──▶ AST ──▶ Bytecode (Ignition)
                                         │
                       hot code ─────────┘──▶ Optimized machine code (TurboFan)
                                         │
                                         ▼
                            ┌──────────────────────────┐
                            │  CALL STACK   │   HEAP   │   ← single-threaded
                            └──────┬────────┴──────────┘
                                   │ async work
                            ┌──────▼──────────────────┐
                            │  Runtime (Web/Node APIs)│
                            │  + Event Loop + Queues  │
                            └─────────────────────────┘
```

**Definition.** JavaScript is a single-threaded, interpreted (then JIT-compiled), dynamically-typed, prototype-based language. The engine runs sync code on one call stack; async work is delegated to the host runtime and resumed via the event loop.

---

## 2. Variables & Data Types

### Declarations
```
       │ scope      │ hoisted │ TDZ │ re-assign │ re-declare │
  var  │ function   │  yes    │ no  │   yes     │   yes      │
  let  │ block      │  yes    │ yes │   yes     │   no       │
  const│ block      │  yes    │ yes │   no      │   no       │
```

```js
var x = 1;        // function-scoped, avoid
let y = 2;        // block-scoped, mutable
const z = 3;      // block-scoped, immutable binding (object contents still mutable)
```

### Types (8 total)
```
PRIMITIVES (immutable, copied by value)        REFERENCE (copied by reference)
──────────────────────────────────────         ───────────────────────────────
string   "hi"                                  object   { a: 1 }
number   42, 3.14, NaN, Infinity               array    [1,2,3]   (special object)
bigint   9007199254740993n                     function (...)=>{} (special object)
boolean  true / false                          Date, RegExp, Map, Set ...
undefined  (no value assigned)
null       (explicit "nothing")
symbol   Symbol('id')   (unique)
```

### Type checks
```js
typeof "hi"         // "string"
typeof 1            // "number"
typeof undefined    // "undefined"
typeof null         // "object"   ← historical bug
typeof []           // "object"
typeof function(){} // "function"

Array.isArray([])              // true
Object.prototype.toString.call(new Date()) // "[object Date]"  ← most reliable
```

### Falsy values (memorize)
`false`, `0`, `-0`, `0n`, `""`, `null`, `undefined`, `NaN`. **Everything else is truthy** (including `[]` and `{}`).

---

## 3. Operators

```
Arithmetic   + - * / % **            // ** = exponent
Assignment   = += -= *= /= **= ??=  ||=  &&=
Comparison   ==  ===  !=  !==  <  >  <=  >=
Logical      &&  ||  !
Nullish      ??              // returns RHS only if LHS is null/undefined
Optional     ?.              // safe property access
Spread/Rest  ...             // ...arr (spread)  /  (...args)=>{} (rest)
Ternary      cond ? a : b
Typeof       typeof x
Comma        (a, b)          // evaluates both, returns last
```

**`==` vs `===`** — always prefer `===`. `==` triggers coercion:
```js
0 == '';          // true  ❌
0 == '0';         // true  ❌
null == undefined;// true  ✅ (only "useful" coercion)
NaN === NaN;      // false → use Number.isNaN()
```

**`??` vs `||`**
```js
0 || 'default';   // 'default'   (0 is falsy)
0 ?? 'default';   // 0           (?? only on null/undefined)
```

**Optional chaining**
```js
user?.address?.city           // undefined instead of throwing
arr?.[0]                      // safe array access
fn?.()                        // call only if fn exists
```

---

## 4. Control Flow

```js
// if / else if / else
if (x > 0) {} else if (x < 0) {} else {}

// ternary
const sign = x > 0 ? 'pos' : x < 0 ? 'neg' : 'zero';

// switch
switch (day) {
  case 'mon':
  case 'tue': console.log('weekday'); break;   // fall-through if no break
  case 'sat': console.log('weekend'); break;
  default:    console.log('unknown');
}
```

---

## 5. Loops

```
                       can break?  iterates over     skips inherited?
  for                     ✓        index             —
  while / do-while        ✓        condition         —
  for...in                ✓        KEYS (object)     ❌ (use hasOwn)
  for...of                ✓        VALUES (iterable) —
  forEach                 ❌       array values      —
  map/filter/reduce       ❌       array → new value —
```

```js
for (let i = 0; i < arr.length; i++) {}     // classic
for (const k in obj) {}                     // object keys
for (const v of arr) {}                     // array/string/Map/Set
arr.forEach((v, i) => {});                  // no break
while (cond) {}
do { ... } while (cond);

// labels (rare)
outer: for (let i=0;i<3;i++) {
  for (let j=0;j<3;j++) if (j===2) break outer;
}
```

---

## 6. Functions

```
  Function Declaration   function foo(){}            hoisted (full)
  Function Expression    const foo = function(){}    hoisted (var only)
  Arrow                  const foo = () => {}        no `this`, no `arguments`
  IIFE                   (function(){})()            run immediately
  Generator              function* foo(){ yield 1 }  pausable
  Async                  async function foo(){}      returns Promise
  Method shorthand       { foo(){} }                 inside objects/classes
```

```js
// default + rest + destructuring params
function greet({ name = 'world', ...rest } = {}, ...others) {
  return `hi ${name}`;
}

// higher-order
const twice = fn => x => fn(fn(x));

// arrow vs regular for `this` — see section 8
```

---

## 7. Scope, Hoisting, Closures

### Scope chain
```
   ┌────────────────────┐
   │   Global scope     │
   │   ┌──────────────┐ │
   │   │ Function A   │ │
   │   │  ┌────────┐  │ │
   │   │  │ Inner  │  │ │   ← lookup walks UP
   │   │  └────────┘  │ │
   │   └──────────────┘ │
   └────────────────────┘
```

### Hoisting (what gets moved to top of scope at parse time)
```js
console.log(a);  // undefined  (var declaration hoisted, value not)
var a = 1;

console.log(b);  // ReferenceError (TDZ)
let b = 2;

foo();           // works — function declaration fully hoisted
function foo(){}
```

### Closure — "function + its lexical environment"
```js
function counter() {
  let n = 0;
  return () => ++n;     // inner fn closes over `n`
}
const c = counter();
c(); c(); c();          // 1, 2, 3   ← `n` persists
```
**Use cases:** data privacy, function factories, memoization, currying, callbacks with state.

---

## 8. `this`, call/apply/bind

```
  Call site        │ `this` is...
  ─────────────────┼──────────────────
  regular fn()     │ undefined (strict) / global (sloppy)
  obj.method()     │ obj
  new Foo()        │ the new instance
  arrow fn         │ inherited from enclosing scope (no own this)
  fn.call(ctx)     │ ctx
  fn.apply(ctx)    │ ctx
  fn.bind(ctx)()   │ ctx (permanently)
  DOM handler      │ the element (unless arrow)
```

```js
const obj = { x: 10, get(){ return this.x } };
obj.get();                      // 10
const g = obj.get; g();         // undefined  (lost context)
g.call(obj);                    // 10
const bound = obj.get.bind(obj);
bound();                        // 10
```

---

## 9. Objects & Prototypes

```js
const o = { a: 1, b: 2 };

// Create
Object.create(proto);        // with explicit prototype
{ ...o };                    // shallow clone
structuredClone(o);          // deep clone (built-in!)

// Inspect
Object.keys(o);              // ['a','b']
Object.values(o);            // [1,2]
Object.entries(o);           // [['a',1],['b',2]]
Object.fromEntries([['a',1]]); // { a: 1 }

// Freeze / seal
Object.freeze(o);            // immutable (shallow)
Object.seal(o);              // can't add/remove, can edit
Object.isFrozen(o);

// Descriptors
Object.defineProperty(o, 'c', {
  value: 3, writable: false, enumerable: false, configurable: false
});
```

### Prototype chain
```
   instance ──[[Proto]]──▶ Constructor.prototype ──[[Proto]]──▶ Object.prototype ──▶ null
```
```js
function Dog(name){ this.name = name; }
Dog.prototype.bark = function(){ return this.name + ' woof' };
const d = new Dog('Rex');
d.bark();                    // 'Rex woof'
Object.getPrototypeOf(d) === Dog.prototype; // true
```

---

## 10. Classes & OOP

```js
class Animal {
  #secret = 'hidden';                    // private field
  static count = 0;                      // class-level
  constructor(name){ this.name = name; Animal.count++; }
  speak(){ return `${this.name} makes a sound`; }
  get label(){ return `[${this.name}]` } // getter
  set label(v){ this.name = v }          // setter
  static create(n){ return new Animal(n) }
}

class Dog extends Animal {
  constructor(name){ super(name); }
  speak(){ return `${super.speak()} (bark)`; }
}
```

**4 pillars:**
- **Encapsulation** — `#private`, closures
- **Inheritance** — `extends`, `super`
- **Polymorphism** — overriding methods
- **Abstraction** — exposing only what matters

---

## 11. Arrays & Methods

### Method cheat-sheet
```
  MUTATES original              RETURNS new
  ─────────────────             ─────────────────
  push / pop                    concat
  shift / unshift               slice
  splice                        map / filter / reduce
  sort / reverse                flat / flatMap
  fill / copyWithin             toReversed / toSorted / toSpliced (ES2023)
```

### Iteration
```js
arr.forEach((v,i,a)=>{});                    // no return
arr.map(v => v*2);                           // transform
arr.filter(v => v>0);                        // keep matching
arr.reduce((acc,v)=>acc+v, 0);               // accumulate
arr.find(v => v.id===1);                     // first match
arr.findIndex(v => v.id===1);
arr.some(v => v>10);                         // any
arr.every(v => v>0);                         // all
arr.includes(3);                             // membership
```

### Without the method (manual versions)

```js
// map polyfill
function map(arr, fn){
  const out = [];
  for (let i = 0; i < arr.length; i++) out.push(fn(arr[i], i, arr));
  return out;
}

// filter polyfill
function filter(arr, fn){
  const out = [];
  for (let i = 0; i < arr.length; i++) if (fn(arr[i],i,arr)) out.push(arr[i]);
  return out;
}

// reduce polyfill
function reduce(arr, fn, init){
  let acc = init, i = 0;
  if (acc === undefined) { acc = arr[0]; i = 1; }
  for (; i < arr.length; i++) acc = fn(acc, arr[i], i, arr);
  return acc;
}

// flat polyfill
function flat(arr, depth=1){
  return depth ? arr.reduce((a,v)=>
    a.concat(Array.isArray(v) ? flat(v, depth-1) : v), []) : arr.slice();
}

// remove duplicates without Set
function uniq(arr){
  const seen = {}, out = [];
  for (const v of arr) if (!seen[v]) { seen[v]=1; out.push(v); }
  return out;
}
// with Set: [...new Set(arr)]
```

---

## 12. Strings

```js
const s = 'Hello World';

s.length;
s.toUpperCase(); s.toLowerCase();
s.trim(); s.trimStart(); s.trimEnd();
s.includes('lo'); s.startsWith('He'); s.endsWith('ld');
s.indexOf('o'); s.lastIndexOf('o');
s.slice(0,5);           // 'Hello'
s.substring(0,5);       // similar, no negatives
s.split(' ');           // ['Hello','World']
s.replace('l','L');     // first only
s.replaceAll('l','L');
s.repeat(2);
s.padStart(15, '*');
s.at(-1);               // 'd'

// template + tagged template
const name = 'Sam';
const greet = `Hi ${name}!`;
function tag(strings, ...vals){ return strings.raw[0]; }
tag`a ${1} b`;
```

---

## 13. Numbers, Math, BigInt, Date

```js
// Number
Number.isNaN(x); Number.isFinite(x); Number.isInteger(x);
parseInt('42px', 10);  parseFloat('3.14');
(1.005).toFixed(2);                  // '1.00' (precision pitfall!)
0.1 + 0.2;                            // 0.30000000000000004
Number.EPSILON;                       // smallest diff

// Math
Math.max(1,2,3); Math.min(...arr);
Math.round(1.5); Math.floor(1.9); Math.ceil(1.1); Math.trunc(-1.7);
Math.abs(-5); Math.pow(2,10); 2**10;
Math.sqrt(9); Math.random();          // [0,1)
Math.floor(Math.random()*10);         // 0-9

// BigInt — for integers > 2^53-1
const big = 9007199254740993n;
big + 1n;                             // 9007199254740994n  (cannot mix with Number)

// Date
const d = new Date();                 // now
new Date('2025-01-15');
new Date(2025, 0, 15, 10, 30);        // month is 0-indexed!
d.getTime();                          // ms since epoch
d.toISOString();
Date.now();                           // ms timestamp

new Intl.DateTimeFormat('en-GB').format(d);
```

---

## 14. Map, Set, WeakMap, WeakSet

```
            keys         iterable  size  GC-friendly?
  Object    string/sym   no        no    no
  Map       ANY          yes       yes   no
  Set       values uniq  yes       yes   no
  WeakMap   objects only no        no    YES (auto-cleared)
  WeakSet   objects only no        no    YES
```

```js
// Map
const m = new Map();
m.set('a', 1).set({}, 2);
m.get('a'); m.has('a'); m.delete('a');
m.size;
for (const [k,v] of m) {}

// Set — unique values
const s = new Set([1,2,2,3]);    // {1,2,3}
s.add(4); s.has(2); s.delete(1);
[...s];                           // back to array

// WeakMap — keys garbage-collected when no other refs
const wm = new WeakMap();
let key = {};
wm.set(key, 'data');
key = null;                       // entry auto-removed
```

**When to use Map over Object:** unknown keys, non-string keys, frequent add/remove, need size/iteration order guaranteed.

---

## 15. Iterators & Generators

### Iterator protocol
An object is **iterable** if it has `[Symbol.iterator]()` returning `{ next(): {value, done} }`.

```js
const range = {
  from: 1, to: 5,
  [Symbol.iterator](){
    let cur = this.from, last = this.to;
    return {
      next(){ return cur <= last ? {value: cur++, done:false} : {value:undefined, done:true}; }
    };
  }
};
for (const n of range) console.log(n);   // 1..5
```

### Generators — auto-build iterators
```js
function* gen(){
  yield 1; yield 2; yield 3;
}
const g = gen();
g.next();              // { value:1, done:false }
[...gen()];            // [1,2,3]

// infinite
function* ids(){ let i=0; while(true) yield i++; }

// delegation
function* a(){ yield 1; yield* [2,3]; yield 4; }
```

---

## 16. Symbols

```js
const id = Symbol('id');          // unique even with same desc
const obj = { [id]: 123 };
obj[id];                          // 123 — invisible to most loops

Symbol.for('shared');             // global registry
Symbol.keyFor(Symbol.for('shared')); // 'shared'

// Well-known symbols hook into language behaviour
class Foo { [Symbol.iterator](){ /* makes Foo iterable */ } }
```

---

## 17. JSON

```js
JSON.stringify({a:1, b:undefined, c: ()=>{}});   // '{"a":1}'  (drops fn/undefined)
JSON.stringify(obj, null, 2);                     // pretty print
JSON.stringify(obj, (k,v)=> typeof v==='bigint' ? v.toString() : v);

JSON.parse('{"a":1}');
JSON.parse(str, (k,v)=> typeof v==='string' ? v.trim() : v);
```
Pitfalls: no circular refs, no `Date` (becomes string), no `Map/Set`.

---

## 18. Error Handling

```js
try {
  risky();
} catch (err) {
  console.error(err.message);
} finally {
  cleanup();                  // always runs
}

// throw anything, but prefer Error
throw new Error('boom');
throw new TypeError('bad arg');

// custom error
class HttpError extends Error {
  constructor(status, msg){ super(msg); this.name='HttpError'; this.status=status; }
}

// error cause (ES2022)
try { JSON.parse('bad'); }
catch (e) { throw new Error('parse failed', { cause: e }); }

// async
try { await fetchUser(); } catch (e) { ... }
```

---

## 19. Async — Callbacks → Promises → async/await {#19-async}

### Evolution
```
   Callback hell           Promise chain              async/await
   ─────────────           ─────────────              ────────────
   a(x, (r1)=>             a(x).then(r1=>            const r1 = await a(x);
     b(r1, (r2)=>            b(r1)).then(r2=>        const r2 = await b(r1);
       c(r2, (r3)=>            c(r2)).then(r3=>      const r3 = await c(r2);
         done(r3))))             done(r3));          done(r3);
```

### Promise basics
```js
const p = new Promise((resolve, reject) => {
  setTimeout(() => resolve('ok'), 100);
});
p.then(v => v.toUpperCase())
 .catch(err => console.error(err))
 .finally(() => console.log('done'));
```

**States:** `pending` → `fulfilled` | `rejected` (irreversible).

### Combinators
```
  Promise.all([p1,p2,p3])         all fulfill OR any reject (fail-fast)
  Promise.allSettled([...])       waits for all, never rejects
  Promise.race([...])             first to settle (resolve OR reject)
  Promise.any([...])              first to FULFILL (rejects only if all reject)
```

### async/await
```js
async function load() {
  try {
    const [u, p] = await Promise.all([fetchUser(), fetchPosts()]);
    return { u, p };
  } catch (e) {
    console.error(e);
  }
}
```

### AbortController
```js
const ctrl = new AbortController();
fetch(url, { signal: ctrl.signal });
ctrl.abort();             // cancels
```

---

## 20. Event Loop {#20-event-loop}

See full version → `02-async/01-event-loop.md`. Quick recap:

```
  sync code → call stack
       ↓ (stack empty)
  drain ALL microtasks (Promises, queueMicrotask)
       ↓
  run ONE macrotask (setTimeout, I/O, events)
       ↓
  drain microtasks again
       ↓
  next macrotask…
```

**Non-blocking** because async ops are handed off to Web/Node APIs; the call stack stays free.

---

## 21. Modules

### ESM (modern, browser + Node)
```js
// math.js
export const add = (a,b) => a+b;
export default function sub(a,b){ return a-b; }

// app.js
import sub, { add } from './math.js';
import * as M from './math.js';
const mod = await import('./math.js');   // dynamic
```

### CommonJS (Node legacy)
```js
// math.js
module.exports = { add: (a,b)=>a+b };
// app.js
const { add } = require('./math');
```

| | ESM | CommonJS |
|---|---|---|
| Loading | static, async | sync at runtime |
| `this` at top | `undefined` | `module.exports` |
| Tree-shakable | yes | no |
| Top-level await | ✓ | ✗ |

---

## 22. Proxy & Reflect

```js
const handler = {
  get(target, prop, receiver) {
    console.log('GET', prop);
    return Reflect.get(target, prop, receiver);
  },
  set(target, prop, value){
    if (typeof value !== 'number') throw new TypeError('numbers only');
    return Reflect.set(target, prop, value);
  }
};
const num = new Proxy({}, handler);
num.x = 5;          // logs nothing for set; validates
num.x;              // GET x → 5
```
**Uses:** validation, logging, reactive state (Vue 3 uses Proxy), default values, virtual properties.

---

## 23. DOM & Events {#23-dom--events}

```js
// select
document.getElementById('id');
document.querySelector('.cls');
document.querySelectorAll('div.item');

// create + insert
const el = document.createElement('div');
el.className = 'box';
el.textContent = 'hi';
parent.appendChild(el);
parent.insertAdjacentHTML('beforeend', '<span>x</span>');

// modify
el.classList.add('on'); el.classList.toggle('on');
el.setAttribute('data-id', 1);
el.style.color = 'red';

// events
btn.addEventListener('click', e => {
  e.preventDefault();
  e.stopPropagation();
});

// delegation (one listener for many children)
list.addEventListener('click', e => {
  const item = e.target.closest('.item');
  if (item) handle(item.dataset.id);
});
```

**Event flow:** capture (root → target) → target → bubble (target → root).

---

## 24. Storage & Network {#24-storage--network}

```js
// localStorage — persistent, ~5MB, strings only
localStorage.setItem('user', JSON.stringify({name:'Sam'}));
JSON.parse(localStorage.getItem('user'));
localStorage.removeItem('user'); localStorage.clear();

// sessionStorage — same API, cleared on tab close
// cookies — server-readable, sent on every request
// IndexedDB — async, large, structured

// fetch
const res = await fetch('/api', {
  method: 'POST',
  headers: {'Content-Type':'application/json'},
  body: JSON.stringify({a:1}),
  signal: ctrl.signal,
});
if (!res.ok) throw new Error(res.status);
const data = await res.json();
```

---

## 25. Functional Patterns

```js
// Compose / Pipe
const compose = (...fns) => x => fns.reduceRight((v,f)=>f(v), x);
const pipe    = (...fns) => x => fns.reduce((v,f)=>f(v), x);

// Currying
const curry = fn => function curried(...args){
  return args.length >= fn.length
    ? fn(...args)
    : (...more) => curried(...args, ...more);
};
const add = curry((a,b,c)=>a+b+c);
add(1)(2)(3);  // 6

// Partial application
const partial = (fn, ...preset) => (...rest) => fn(...preset, ...rest);

// Memoize
const memo = fn => {
  const cache = new Map();
  return (...args) => {
    const k = JSON.stringify(args);
    if (!cache.has(k)) cache.set(k, fn(...args));
    return cache.get(k);
  };
};
```

---

## 26. Common Polyfills

```js
// Array.prototype.myMap
Array.prototype.myMap = function(fn){
  const out = [];
  for (let i = 0; i < this.length; i++) out.push(fn(this[i], i, this));
  return out;
};

// Function.prototype.myBind
Function.prototype.myBind = function(ctx, ...preset){
  const fn = this;
  return function(...rest){ return fn.apply(ctx, [...preset, ...rest]); };
};

// Promise.all
function promiseAll(promises){
  return new Promise((resolve, reject) => {
    const out = []; let done = 0;
    promises.forEach((p, i) => {
      Promise.resolve(p).then(v => {
        out[i] = v;
        if (++done === promises.length) resolve(out);
      }, reject);
    });
  });
}

// debounce
function debounce(fn, ms){
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(()=>fn(...args), ms); };
}

// throttle
function throttle(fn, ms){
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= ms){ last = now; fn(...args); }
  };
}

// deepClone (simple)
function deepClone(v, seen = new WeakMap()){
  if (v === null || typeof v !== 'object') return v;
  if (seen.has(v)) return seen.get(v);
  const out = Array.isArray(v) ? [] : {};
  seen.set(v, out);
  for (const k of Object.keys(v)) out[k] = deepClone(v[k], seen);
  return out;
}
// modern: structuredClone(v)
```

---

## 27. Design Patterns (quick)

```js
// Singleton
const Config = (() => {
  let instance;
  return { get(){ return instance ??= { theme:'dark' }; } };
})();

// Observer / Pub-Sub
class EventBus {
  #m = new Map();
  on(e, fn){ (this.#m.get(e) ?? this.#m.set(e, []).get(e)).push(fn); }
  emit(e, data){ (this.#m.get(e) ?? []).forEach(fn => fn(data)); }
  off(e, fn){ this.#m.set(e, (this.#m.get(e) ?? []).filter(f=>f!==fn)); }
}

// Factory
function makeUser(role){
  if (role==='admin') return { role, perms:['*'] };
  return { role, perms:['read'] };
}

// Module (closure)
const Counter = (() => {
  let n = 0;
  return { inc: () => ++n, get: () => n };
})();
```

---

## 28. Performance & Memory

- **GC** is mark-and-sweep — anything reachable from roots stays alive.
- Common leaks: forgotten timers, detached DOM nodes held in closures, global vars, listeners not removed, large caches without limit.
- **Use WeakMap/WeakSet** for metadata keyed by objects.
- **Avoid:** `eval`, `with`, `for...in` over arrays, sync loops over huge data on main thread (use Web Workers).
- **Measure** with DevTools Performance / Memory tabs; don't guess.

---

## 🎯 What to read next
- `01-core/` — language internals deep dives
- `02-async/01-event-loop.md` — visual event loop guide
- `04-machine-coding/polyfills.js` — runnable polyfills
- `Top_100_JavaScript_Interview_Questions_Converted.md`
