# Prototypal Inheritance in JavaScript

> 📅 **Concept** · ~5 min read · JavaScript's native inheritance model

## Definition

Prototypal inheritance is JavaScript's native object-oriented programming model. Unlike class-based languages where objects inherit from classes, in JavaScript, objects inherit directly from other objects. Each object has an internal link to another object called its prototype.

Prototypal inheritance provides:
- **Dynamic inheritance** — Can modify prototype chain at runtime
- **Memory efficiency** — Methods shared via prototype
- **Flexibility** — Objects can inherit from any object
- **Simplicity** — No complex class hierarchies needed

## The Prototype Chain

Every object has a prototype, forming a chain:

```javascript
const grandParent = {
  greet() {
    return 'Hello from grandparent';
  }
};

const parent = Object.create(grandParent);
parent.parentMethod = function() {
  return 'Hello from parent';
};

const child = Object.create(parent);
child.childMethod = function() {
  return 'Hello from child';
};

console.log(child.childMethod());   // "Hello from child" — own property
console.log(child.parentMethod());   // "Hello from parent" — from parent
console.log(child.greet());         // "Hello from grandparent" — from grandParent
```

## Object.create()

The primary way to create objects with a specific prototype:

```javascript
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  },
  introduce() {
    return `My name is ${this.name} and I'm ${this.age} years old`;
  }
};

const person1 = Object.create(personPrototype);
person1.name = 'Alice';
person1.age = 30;

const person2 = Object.create(personPrototype);
person2.name = 'Bob';
person2.age = 25;

console.log(person1.greet());      // "Hello, I'm Alice"
console.log(person2.introduce()); // "My name is Bob and I'm 25"
console.log(person1.greet === person2.greet); // true — shared method
```

## Constructor Functions and Prototypes

Before ES6 classes, constructor functions were used:

```javascript
function Person(name, age) {
  this.name = name;
  this.age = age;
}

// Methods added to prototype
Person.prototype.greet = function() {
  return `Hello, I'm ${this.name}`;
};

Person.prototype.introduce = function() {
  return `My name is ${this.name} and I'm ${this.age} years old`;
};

const person1 = new Person('Alice', 30);
const person2 = new Person('Bob', 25);

console.log(person1.greet());      // "Hello, I'm Alice"
console.log(person1.greet === person2.greet); // true — shared
```

## The new Keyword

The `new` keyword does four things:
1. Creates a new object
2. Sets the object's prototype to the constructor's prototype
3. Binds `this` to the new object
4. Returns the new object

```javascript
function Car(make, model) {
  this.make = make;
  this.model = model;
}

Car.prototype.drive = function() {
  return `${this.make} ${this.model} is driving`;
};

const car = new Car('Toyota', 'Camry');
console.log(car.drive());  // "Toyota Camry is driving"
```

## __proto__ vs prototype

- `prototype` — property on constructor functions, used by `new`
- `__proto__` — property on objects, points to the object's prototype

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

const person = new Person('Alice');

console.log(Person.prototype === person.__proto__);  // true
console.log(person.__proto__.greet === Person.prototype.greet);  // true
```

## Object.getPrototypeOf() and Object.setPrototypeOf()

Modern methods for working with prototypes:

```javascript
const proto = {
  greet() {
    return 'Hello';
  }
};

const obj = Object.create(proto);
console.log(Object.getPrototypeOf(obj) === proto);  // true

const newProto = {
  farewell() {
    return 'Goodbye';
  }
};

Object.setPrototypeOf(obj, newProto);
console.log(Object.getPrototypeOf(obj) === newProto);  // true
```

## Property Lookup

When accessing a property, JavaScript searches:
1. The object itself
2. Its prototype
3. The prototype's prototype
4. Until `null` is reached

```javascript
const grandParent = {
  a: 1
};

const parent = Object.create(grandParent);
parent.b = 2;

const child = Object.create(parent);
child.c = 3;

console.log(child.c);  // 3 — from child
console.log(child.b);  // 2 — from parent
console.log(child.a);  // 1 — from grandParent
console.log(child.d);  // undefined — not found
```

## hasOwnProperty()

Check if a property is on the object itself (not inherited):

```javascript
const parent = {
  inherited: 'from parent'
};

const child = Object.create(parent);
child.own = 'own property';

console.log(child.hasOwnProperty('own'));        // true
console.log(child.hasOwnProperty('inherited'));  // false
console.log('inherited' in child);              // true — property exists (inherited)
```

## Modifying Prototypes

Prototypes can be modified at runtime:

```javascript
function Person(name) {
  this.name = name;
}

const person1 = new Person('Alice');
const person2 = new Person('Bob');

// Add method to prototype after creating instances
Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};

console.log(person1.greet());  // "Hello, Alice" — works on existing instances
console.log(person2.greet());  // "Hello, Bob"
```

## Prototype Inheritance Chain

```javascript
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function() {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  Animal.call(this, name);  // Call parent constructor
  this.breed = breed;
}

// Set up inheritance
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function() {
  return `${this.name} barks`;
};

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak());  // "Rex makes a sound" — inherited from Animal
console.log(dog.bark());   // "Rex barks" — own method
```

## Object.assign() for Prototypes

```javascript
const basePrototype = {
  init() {
    console.log('Initialized');
  }
};

const extendedPrototype = Object.assign({}, basePrototype, {
  customMethod() {
    console.log('Custom method');
  }
});

const obj = Object.create(extendedPrototype);
obj.init();         // "Initialized"
obj.customMethod(); // "Custom method"
```

## Prototypal Inheritance vs Classes

Classes are syntactic sugar over prototypes:

```javascript
// Class syntax
class Person {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
}

// Equivalent prototype syntax
function Person(name) {
  this.name = name;
}

Person.prototype.greet = function() {
  return `Hello, ${this.name}`;
};
```

## Pure Prototypal Inheritance (No constructors)

```javascript
const person = {
  name: 'Anonymous',
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const employee = Object.create(person);
employee.name = 'Alice';
employee.work = function() {
  return `${this.name} is working`;
};

const manager = Object.create(employee);
manager.name = 'Bob';
manager.manage = function() {
  return `${this.name} is managing`;
};

console.log(manager.greet());   // "Hello, I'm Bob" — from person
console.log(manager.work());   // "Bob is working" — from employee
console.log(manager.manage()); // "Bob is managing" — own method
```

## Performance Considerations

- **Prototype lookup** — Slower than direct property access
- **Deep chains** — Can impact performance if too deep
- **Optimization** — Engines optimize for common patterns

```javascript
// Good — shallow chain
const obj = Object.create({ method() {} });

// Avoid — very deep chain
const chain = {};
for (let i = 0; i < 100; i++) {
  chain = Object.create(chain);
}
```

## When to Use Prototypal Inheritance

**Use when:**
- You need memory efficiency (shared methods)
- You want dynamic inheritance
- You're working with legacy code
- You prefer functional style

**Use classes when:**
- You prefer class-based syntax
- You need inheritance hierarchies
- You want better tooling support
- You're working with a team familiar with classes

## Best Practices

1. **Keep chains shallow** — Deep chains are hard to debug
2. **Don't modify Object.prototype** — Can break code
3. **Use Object.create()** — Instead of __proto__
4. **Check hasOwnProperty** — When iterating properties
5. **Document prototype relationships** — Make inheritance clear
6. **Prefer classes** — For new code (unless you have specific needs)

## Common Patterns

### Cloning Objects

```javascript
function clone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}

const original = { name: 'Alice', greet() { return this.name; } };
const copy = clone(original);
console.log(copy.greet());  // "Alice"
```

### Mixin Pattern

```javascript
const flyable = {
  fly() {
    return `${this.name} is flying`;
  }
};

const swimmable = {
  swim() {
    return `${this.name} is swimming`;
  }
};

function createDuck(name) {
  const duck = Object.create(null);
  duck.name = name;
  Object.assign(duck, flyable, swimmable);
  return duck;
}

const duck = createDuck('Donald');
console.log(duck.fly());   // "Donald is flying"
console.log(duck.swim());  // "Donald is swimming"
```

### Module Pattern with Prototypes

```javascript
const module = (function() {
  const privateData = {};

  const PublicPrototype = {
    set(key, value) {
      privateData[key] = value;
    },
    get(key) {
      return privateData[key];
    }
  };

  return {
    create() {
      return Object.create(PublicPrototype);
    }
  };
})();

const instance1 = module.create();
const instance2 = module.create();

instance1.set('key', 'value');
console.log(instance2.get('key'));  // "value" — shared private state
```
