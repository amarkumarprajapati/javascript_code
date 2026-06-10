# Prototype Inheritance

## Definition
**Prototype Inheritance** is the mechanism by which JavaScript objects inherit properties and methods from other objects via the prototype chain. Unlike classical inheritance (classes inheriting from classes), JS uses **delegation** — objects delegate to their prototype.

---

## Core Concept

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

console.log(rabbit.eats); // true (inherited)
rabbit.walk();           // 'Animal walks' (inherited)
```

- `rabbit` doesn't have `eats` or `walk` directly.
- JavaScript looks up the prototype chain and finds them on `animal`.

---

## Constructor Function Pattern

### Definition
Before ES6 classes, constructor functions were the standard way to create inheritable objects.

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  console.log(`${this.name} makes a sound`);
};

function Dog(name, breed) {
  Animal.call(this, name); // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.speak = function() {
  console.log(`${this.name} barks`);
};

const dog = new Dog('Rex', 'Labrador');
dog.speak(); // 'Rex barks'
console.log(dog.eats); // undefined (unless added to Animal.prototype)
```

**Steps to set up inheritance:**
1. Call parent constructor with `Parent.call(this, ...)`.
2. Set `Child.prototype = Object.create(Parent.prototype)`.
3. Reset `Child.prototype.constructor = Child`.

---

## ES6 `class` Syntax

### Definition
ES6 introduced `class` as syntactic sugar over prototype inheritance.

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
  constructor(name, breed) {
    super(name); // Calls Animal's constructor
    this.breed = breed;
  }
  speak() {
    console.log(`${this.name} barks`);
  }
}

const dog = new Dog('Rex', 'Labrador');
dog.speak(); // 'Rex barks'
```

**Important**: Under the hood, this still uses prototype inheritance.

---

## Inheritance Chain Visualization

```
Dog instance
  → Dog.prototype (speak(), constructor)
    → Animal.prototype (speak(), constructor)
      → Object.prototype (toString(), etc.)
        → null
```

---

## Checking Inheritance

```js
const dog = new Dog('Rex');

// Check if Dog.prototype exists in dog's chain
dog instanceof Dog;      // true
dog instanceof Animal;   // true
dog instanceof Object;   // true

// Check direct prototype
Object.getPrototypeOf(dog) === Dog.prototype;      // true
Dog.prototype.isPrototypeOf(dog);                   // true

// Check own property vs inherited
dog.hasOwnProperty('name');      // true (own)
dog.hasOwnProperty('speak');     // false (inherited)
```

---

## Common Pitfalls

### Modifying Shared Prototype
```js
function Parent() {}
Parent.prototype.items = []; // Shared across ALL instances!

const child1 = new Parent();
const child2 = new Parent();

child1.items.push('A');
console.log(child2.items); // ['A'] — unexpected!

// Fix: Initialize in constructor
function Parent() {
  this.items = []; // Each instance gets its own array
}
```

### Forgetting `new`
```js
const dog = Dog('Rex'); // Missing `new`
// `this` becomes global object (or undefined in strict mode)
```

---

## Key Takeaways
- JS inheritance is **prototypal**, not classical.
- Objects delegate to their prototype for missing properties.
- `class` is cleaner syntax but prototype-based under the hood.
- Always initialize instance-specific data in the constructor, not on the prototype.
