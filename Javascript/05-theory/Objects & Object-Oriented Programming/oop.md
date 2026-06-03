# Objects & Object-Oriented Programming

> 📅 **Day 17** · ~15 min read · the OOP picture in JS

## Mental model — the 4 pillars

```
                       ┌──────────────────────┐
                       │   4 PILLARS OF OOP   │
                       └──────────────────────┘
                                 │
       ┌──────────────┬──────────┴──────────┬──────────────┐
       ▼              ▼                     ▼              ▼
   Encapsulation   Inheritance        Polymorphism    Abstraction
   ─────────────   ────────────       ───────────     ───────────
   bundle data +   reuse via          same method     hide internals,
   methods         parent class       name, different expose only
   #private,       extends, super     behaviour       interface
   closures
```

## Definition

**OOP** = organising code around *objects* (data + behaviour together). JS achieves this through **prototypes** (under the hood) or **classes** (modern syntax sugar over prototypes).

---

## 1. Three ways to create objects

### (a) Object literal — simplest
```js
const user = {
  name: 'Amar',
  age: 28,
  greet() { return `Hello, I'm ${this.name}`; }
};
user.greet();                 // "Hello, I'm Amar"
```
**Use when:** one-off, no need to make multiples.

### (b) Constructor function — pre-class era
```js
function User(name, age) {
  this.name = name;
  this.age  = age;
}
User.prototype.greet = function () {
  return `Hi, I'm ${this.name}`;
};
const u = new User('Amar', 28);
```
**Use when:** you can't use ES6+ classes (very old environments).

### (c) ES6 class — modern, recommended
```js
class User {
  constructor(name, age) {
    this.name = name;
    this.age  = age;
  }
  greet() { return `Hi, I'm ${this.name}`; }
}
const u = new User('Amar', 28);
```

> All three produce equivalent objects. Class is just sugar — see `01-core/04-prototypes.md` for the desugared version.

---

## 2. Encapsulation — `#private` fields

```js
class Account {
  #balance = 0;                         // private — only this class can touch

  deposit(amount) {
    if (amount <= 0) throw new Error('positive only');
    this.#balance += amount;
  }
  getBalance() { return this.#balance; }
}

const a = new Account();
a.deposit(500);
a.getBalance();          // 500
// a.#balance            // ❌ SyntaxError outside the class
```

### Without `#` — closure-based private (pre-ES2022)
```js
function makeAccount() {
  let balance = 0;                     // truly private via closure
  return {
    deposit: (amt) => { balance += amt; },
    getBalance: () => balance,
  };
}
```

---

## 3. Inheritance — `extends` + `super`

```js
class Person {
  constructor(name) { this.name = name; }
  greet() { return `Hello, I'm ${this.name}`; }
}

class Developer extends Person {
  constructor(name, stack) {
    super(name);                       // ⚠️ must call before using `this`
    this.stack = stack;
  }
  code() { return `${this.name} writes ${this.stack}`; }
  greet() {                            // override
    return super.greet() + ` (dev)`;   // call parent version
  }
}

const d = new Developer('Amar', 'MERN');
d.greet();    // "Hello, I'm Amar (dev)"
d.code();     // "Amar writes MERN"
```

```
   Developer instance ──[[Proto]]──▶ Developer.prototype ──[[Proto]]──▶ Person.prototype ──▶ Object.prototype ──▶ null
```

---

## 4. Polymorphism — same call, different behaviour

```js
class Animal { speak() { return 'generic sound'; } }
class Dog extends Animal { speak() { return 'Woof!'; } }
class Cat extends Animal { speak() { return 'Meow!'; } }

const zoo = [new Dog(), new Cat(), new Animal()];
zoo.map(a => a.speak());          // ['Woof!', 'Meow!', 'generic sound']
```

The caller doesn't care which subclass — they all answer `speak()`. That's polymorphism.

---

## 5. Abstraction — expose only what matters

```js
class HttpClient {
  // public surface
  async get(url)  { return this.#request('GET', url); }
  async post(url, body) { return this.#request('POST', url, body); }

  // hidden implementation
  async #request(method, url, body) {
    const res = await fetch(url, { method, body: body && JSON.stringify(body) });
    return res.json();
  }
}
```
Users call `get` / `post` — they don't need to know about retries, headers, JSON wrapping.

---

## 6. Static + getters/setters

```js
class Circle {
  static PI = 3.14159;                 // class-level, not on instance

  constructor(r) { this._r = r; }
  get radius()       { return this._r; }
  set radius(v) {
    if (v < 0) throw new Error('negative radius');
    this._r = v;
  }
  get area() { return Circle.PI * this._r ** 2; }   // computed property

  static fromDiameter(d) { return new Circle(d / 2); }   // factory
}

const c = Circle.fromDiameter(10);
c.area;                  // accessed like a property
c.radius = 7;            // triggers setter validation
```

---

## 7. Object utility methods (worth memorizing)

```js
Object.keys(obj);              // ['a','b']
Object.values(obj);            // [1,2]
Object.entries(obj);           // [['a',1],['b',2]]
Object.fromEntries(arr);       // reverse — array of pairs → object

Object.assign(target, src1, src2);   // shallow merge into target
{ ...src1, ...src2 };                // same, but creates new object

Object.freeze(obj);            // shallow immutable
Object.isFrozen(obj);
Object.seal(obj);              // can't add/remove keys, can edit
Object.create(proto);          // new object with given prototype
Object.getPrototypeOf(obj);
Object.hasOwn(obj, key);       // modern hasOwnProperty (ES2022)

obj.hasOwnProperty('x');       // old way
'x' in obj;                    // also checks prototype chain
```

---

## 8. Common interview comparisons

### Class vs constructor function
| | constructor fn | class |
|---|---|---|
| Hoisted | yes (the function) | no |
| `new` required | no (runs as fn — bad `this`) | yes (throws otherwise) |
| Strict mode inside | no by default | yes always |
| Readable | so-so | ✅ |

### Composition vs Inheritance (interview classic)
- **Inheritance** — "**is-a**" (Dog is an Animal)
- **Composition** — "**has-a**" (Car has an Engine)
- Modern advice: prefer composition; deep class trees become fragile.

```js
// composition example
const canFly  = (obj) => ({ ...obj, fly:  () => 'flying'  });
const canSwim = (obj) => ({ ...obj, swim: () => 'swimming' });
const duck = canSwim(canFly({ name: 'Donald' }));
duck.fly(); duck.swim();
```

---

## Common interview questions

1. **4 pillars of OOP in JS?** → encapsulation, inheritance, polymorphism, abstraction.
2. **Are classes "real" classes?** → No, syntactic sugar over prototypes.
3. **Why `super(args)` must come first?** → before `super`, `this` is uninitialized.
4. **Public vs private fields?** → `#name` is truly private (syntax-level); convention `_name` is just a hint.
5. **`static` method use case?** → factories, utilities — no `this` needed.
6. **Composition vs inheritance?** → "has-a" vs "is-a"; composition is more flexible.
7. **How to make an object immutable?** → `Object.freeze` (shallow) or deep-freeze recursively.
