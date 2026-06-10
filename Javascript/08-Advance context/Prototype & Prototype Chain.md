# Prototype & Prototype Chain

## Definition
**Prototype** is a mechanism by which JavaScript objects inherit features from one another. Every object in JavaScript has an internal link to another object called its **prototype**.

The **Prototype Chain** is the linked series of prototypes that JavaScript traverses to look up properties and methods that don't exist directly on an object.

---

## `[[Prototype]]` vs `prototype`

### `[[Prototype]]` (Internal Slot)
- Every object has an internal `[[Prototype]]` link.
- Access it via `Object.getPrototypeOf(obj)` or `__proto__` (legacy).
- It points to the object this object inherits from.

### `prototype` Property
- Only **functions** have a `prototype` property.
- It is the object that will become the `[[Prototype]]` of instances created with `new`.

```js
function Person(name) {
  this.name = name;
}

// Person has `prototype` property
console.log(Person.prototype); // { constructor: Person }

const alice = new Person('Alice');
// alice's [[Prototype]] points to Person.prototype
console.log(Object.getPrototypeOf(alice) === Person.prototype); // true
```

---

## How Prototype Chain Works

### Lookup Process
When you access a property on an object:
1. JS checks if the property exists on the object itself.
2. If not, it looks up the `[[Prototype]]`.
3. If not found there, it continues up the chain.
4. Until it reaches `null` (end of chain).

```js
const animal = {
  eats: true,
  walk() {
    console.log('Animal walks');
  }
};

const rabbit = {
  jumps: true,
  __proto__: animal // rabbit inherits from animal
};

console.log(rabbit.eats); // true (found on animal)
console.log(rabbit.jumps); // true (found on rabbit)
rabbit.walk(); // 'Animal walks' (found on animal)
```

### Chain Visualization
```
rabbit → animal → Object.prototype → null
   |         |            |
 jumps    eats         toString()
          walk()
```

---

## `Object.create()`

### Definition
Creates a new object with the specified object as its prototype.

```js
const parent = { greet: 'Hello' };
const child = Object.create(parent);

console.log(child.greet); // 'Hello'
console.log(Object.getPrototypeOf(child) === parent); // true
```

---

## Constructor Functions & Prototype

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

const dog = new Animal('Dog');
dog.speak(); // 'Dog makes a sound'
```

**What `new` does:**
1. Creates a new empty object.
2. Sets its `[[Prototype]]` to `Animal.prototype`.
3. Binds `this` to the new object and calls `Animal`.
4. Returns the new object.

---

## Modern Approach: `class` (Syntactic Sugar)

```js
class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Rex');
dog.speak(); // 'Rex barks'
```

**Note**: Classes in JS are still prototype-based under the hood.

---

## Checking Prototypes

```js
const obj = {};

// Get prototype
Object.getPrototypeOf(obj);        // Object.prototype
obj.__proto__;                     // Object.prototype (legacy)

// Check if object is prototype of another
Object.prototype.isPrototypeOf(obj); // true

// Check if property is own (not inherited)
obj.hasOwnProperty('toString');  // false
```

---

## Key Takeaways
- Prototypes enable **inheritance** in JavaScript.
- The chain ends at `Object.prototype` then `null`.
- `class` is just cleaner syntax for prototype-based inheritance.
