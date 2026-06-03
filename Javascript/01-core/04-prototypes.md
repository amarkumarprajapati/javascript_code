# Prototypes & Inheritance

> 📅 **Day 4** · ~10 min read · foundation for classes & inheritance

## Mental model — the chain

```
   const d = new Dog("Rex")
        │
        │ [[Prototype]]
        ▼
   ┌─────────────────────┐
   │  Dog.prototype      │   ◀── shared methods (bark, sit...)
   │  { bark, ... }      │
   └──────────┬──────────┘
              │ [[Prototype]]
              ▼
   ┌─────────────────────┐
   │ Animal.prototype    │   ◀── inherited methods (eat, sleep)
   │  { eat, sleep }     │
   └──────────┬──────────┘
              │ [[Prototype]]
              ▼
   ┌─────────────────────┐
   │ Object.prototype    │   ◀── toString, hasOwnProperty...
   └──────────┬──────────┘
              │ [[Prototype]]
              ▼
            null      ◀── end of chain
```

**Lookup rule:** `d.bark()` → not on `d` → walk up the chain → found on `Dog.prototype` → call.
If never found → `undefined` (or `TypeError` if you try to invoke).

## Prototype chain
Every JS object has an internal link `[[Prototype]]` (accessible via `__proto__`) to another object. When you access a property, JS looks:
1. on the object itself,
2. then its prototype,
3. then the prototype's prototype… until `null`.

```js
const arr = [1, 2, 3];
arr.map(...)        // map isn't on arr → found on Array.prototype
// arr → Array.prototype → Object.prototype → null
```

## prototype vs __proto__
- **`prototype`** — a property on **constructor functions**; becomes the prototype of instances created with `new`.
- **`__proto__`** — the actual link on an **instance** pointing to its constructor's `prototype`.

```js
function User(name) { this.name = name; }
User.prototype.greet = function () { return `Hi ${this.name}`; };

const u = new User("Amar");
u.greet();                          // "Hi Amar"
u.__proto__ === User.prototype;     // true
```

## Why use prototypes?
Methods on the prototype are **shared** across all instances → memory efficient (not recreated per instance).

## ES6 Classes (syntactic sugar over prototypes)
```js
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hi ${this.name}`; }   // lives on Person.prototype
}

class Developer extends Person {
  constructor(name, stack) {
    super(name);          // call parent constructor
    this.stack = stack;
  }
  code() { return `${this.name} writes ${this.stack}`; }
}

const d = new Developer("Amar", "MERN");
d.greet(); // inherited
d.code();  // own
```

## Inheritance under the hood
`extends` sets up the prototype chain: `Developer.prototype.__proto__ === Person.prototype`.

## Useful methods
```js
Object.create(proto)          // create object with given prototype
Object.getPrototypeOf(obj)    // read prototype (preferred over __proto__)
obj.hasOwnProperty("x")       // own property check (ignores prototype)
```

## Without `class` — inheritance the old way

```js
// Parent
function Person(name) { this.name = name; }
Person.prototype.greet = function () { return `Hi ${this.name}`; };

// Child
function Developer(name, stack) {
  Person.call(this, name);                // 1️⃣ "super(name)"
  this.stack = stack;
}
Developer.prototype = Object.create(Person.prototype);  // 2️⃣ link chain
Developer.prototype.constructor = Developer;            // 3️⃣ fix constructor
Developer.prototype.code = function () { return `${this.name} writes ${this.stack}`; };

const d = new Developer("Amar", "MERN");
d.greet();  // inherited from Person
d.code();   // own
```

> The `class` keyword does **exactly** these 3 steps under the hood.

---

## Common interview questions
1. **What is prototypal inheritance?** → Objects inherit directly from other objects via the prototype chain.
2. **Difference `prototype` vs `__proto__`?** → constructor property vs instance link.
3. **Are ES6 classes real classes?** → No, sugar over prototypes.
4. **How does `super` work?** → calls parent constructor/method via prototype chain.
5. **hasOwnProperty vs `in`?** → `in` also checks prototype chain.
