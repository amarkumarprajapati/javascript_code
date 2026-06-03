# Object-Oriented Programming in JavaScript

> 📅 **Day 6** · ~15 min read · classes, inheritance, encapsulation

## Mental model — the 4 pillars

```
┌─────────────────────────────────────────────────────────┐
│                    OOP Pillars                          │
├──────────────┬──────────────┬──────────────┬───────────┤
│ Encapsulation│  Inheritance │ Polymorphism │ Abstraction│
│              │              │              │            │
│ Hide data    │ Reuse code   │ Many forms   │ Hide      │
│ Expose API   │ Extend       │ Same method  │ complexity │
└──────────────┴──────────────┴──────────────┴───────────┘
```

## Classes (ES6+)

Classes are syntactic sugar over prototypes — they provide a cleaner, more familiar syntax for creating objects and dealing with inheritance.

```javascript
// Class declaration
class Person {
  // Constructor — initializes instance properties
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  // Instance method — shared via prototype
  greet() {
    return `Hello, I'm ${this.name}`;
  }

  // Static method — called on class, not instances
  static species() {
    return 'Homo sapiens';
  }

  // Getter — computed property
  get birthYear() {
    return new Date().getFullYear() - this.age;
  }

  // Setter — validation
  set age(value) {
    if (value < 0) throw new Error('Age cannot be negative');
    this._age = value;
  }
}

const person = new Person('Alice', 30);
console.log(person.greet());        // "Hello, I'm Alice"
console.log(Person.species());      // "Homo sapiens"
console.log(person.birthYear);      // 1996 (computed)
```

### Private Fields (#)

ES2022 introduced private class fields using `#` prefix:

```javascript
class BankAccount {
  #balance;  // Private field

  constructor(initialBalance) {
    this.#balance = initialBalance;
  }

  deposit(amount) {
    this.#balance += amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount(100);
account.deposit(50);
console.log(account.getBalance());  // 150
console.log(account.#balance);      // SyntaxError — private!
```

## Inheritance

Classes can extend other classes using the `extends` keyword:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }

  speak() {
    // Override parent method
    return `${this.name} barks!`;
  }

  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak());  // "Rex barks!"
console.log(dog.fetch());  // "Rex fetches the ball"
```

### Method Overriding & Super

```javascript
class Vehicle {
  constructor(speed) {
    this.speed = speed;
  }

  move() {
    return `Moving at ${this.speed} km/h`;
  }
}

class Car extends Vehicle {
  move() {
    // Call parent method with super
    const baseMove = super.move();
    return `${baseMove} on wheels`;
  }
}

const car = new Car(60);
console.log(car.move());  // "Moving at 60 km/h on wheels"
```

## Encapsulation

Encapsulation is about hiding internal state and requiring interaction through methods.

### Using Closures (Factory Pattern)

```javascript
function createCounter() {
  let count = 0;  // Private variable

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment());  // 1
console.log(counter.increment());  // 2
console.log(counter.count);        // undefined — private!
```

### Using Classes with Private Fields

```javascript
class Stack {
  #items = [];

  push(item) {
    this.#items.push(item);
  }

  pop() {
    return this.#items.pop();
  }

  peek() {
    return this.#items[this.#items.length - 1];
  }

  isEmpty() {
    return this.#items.length === 0;
  }
}

const stack = new Stack();
stack.push(1);
stack.push(2);
console.log(stack.pop());  // 2
console.log(stack.#items); // SyntaxError
```

## Polymorphism

Polymorphism allows objects of different classes to be treated as objects of a common superclass.

```javascript
class Shape {
  area() {
    throw new Error('Must implement area()');
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  area() {
    return Math.PI * this.radius ** 2;
  }
}

class Rectangle extends Shape {
  constructor(width, height) {
    super();
    this.width = width;
    this.height = height;
  }

  area() {
    return this.width * this.height;
  }
}

// Polymorphic usage
function printArea(shape) {
  console.log(`Area: ${shape.area()}`);
}

printArea(new Circle(5));       // "Area: 78.5398..."
printArea(new Rectangle(4, 6)); // "Area: 24"
```

## Abstraction

Abstraction hides complex implementation details and shows only essential features.

```javascript
// Abstract class concept (using convention)
class Database {
  constructor(connectionString) {
    if (this.constructor === Database) {
      throw new Error('Abstract class cannot be instantiated');
    }
    this.connectionString = connectionString;
  }

  connect() {
    throw new Error('Must implement connect()');
  }

  query(sql) {
    throw new Error('Must implement query()');
  }

  // Concrete method — shared implementation
  logQuery(sql) {
    console.log(`Executing: ${sql}`);
  }
}

class MySQL extends Database {
  connect() {
    console.log(`Connecting to MySQL at ${this.connectionString}`);
  }

  query(sql) {
    this.logQuery(sql);
    return `Results from MySQL: ${sql}`;
  }
}

class PostgreSQL extends Database {
  connect() {
    console.log(`Connecting to PostgreSQL at ${this.connectionString}`);
  }

  query(sql) {
    this.logQuery(sql);
    return `Results from PostgreSQL: ${sql}`;
  }
}

const mysql = new MySQL('localhost:3306');
mysql.connect();
mysql.query('SELECT * FROM users');
```

## Factory Functions vs Classes

### Factory Functions

```javascript
function createUser(name, email) {
  return {
    name,
    email,
    greet() {
      return `Hi, I'm ${this.name}`;
    }
  };
}

const user1 = createUser('Alice', 'alice@example.com');
const user2 = createUser('Bob', 'bob@example.com');
```

**Pros:**
- No `this` confusion
- Private variables via closures
- No need for `new`
- More flexible

**Cons:**
- No instanceof check
- Methods recreated for each instance (unless shared via prototype)

### Classes

```javascript
class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

const user1 = new User('Alice', 'alice@example.com');
const user2 = new User('Bob', 'bob@example.com');
```

**Pros:**
- Methods shared via prototype (memory efficient)
- `instanceof` works
- Familiar to developers from other languages
- Better tooling support

**Cons:**
- `this` can be confusing
- Harder to create truly private members (before #)

## Mixins

Mixins allow adding functionality to classes without inheritance:

```javascript
const Loggable = {
  log(message) {
    console.log(`[${this.constructor.name}] ${message}`);
  }
};

const Timestamped = {
  createdAt: new Date(),
  getAge() {
    return Date.now() - this.createdAt.getTime();
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

// Apply mixins
Object.assign(User.prototype, Loggable, Timestamped);

const user = new User('Alice');
user.log('User created');  // "[User] User created"
console.log(user.getAge());
```

## Static Properties & Methods

Static members belong to the class, not instances:

```javascript
class MathUtils {
  static PI = 3.14159;

  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

console.log(MathUtils.PI);           // 3.14159
console.log(MathUtils.add(2, 3));    // 5
console.log(MathUtils.multiply(4, 5)); // 20

const utils = new MathUtils();
console.log(utils.add(2, 3));        // TypeError: utils.add is not a function
```

## Object.create() & Prototypal Inheritance

Before classes, JavaScript used `Object.create()`:

```javascript
const personPrototype = {
  greet() {
    return `Hello, I'm ${this.name}`;
  }
};

const person = Object.create(personPrototype);
person.name = 'Alice';
console.log(person.greet());  // "Hello, I'm Alice"

// Inheritance chain
const employeePrototype = Object.create(personPrototype);
employeePrototype.work = function() {
  return `${this.name} is working`;
};

const employee = Object.create(employeePrototype);
employee.name = 'Bob';
console.log(employee.greet());  // "Hello, I'm Bob"
console.log(employee.work());   // "Bob is working"
```

## Best Practices

1. **Use classes for stateful objects** — when you need multiple instances with shared behavior
2. **Use factory functions for simple objects** — when you don't need inheritance
3. **Prefer composition over inheritance** — combine small, focused objects
4. **Keep classes small** — single responsibility principle
5. **Use private fields (#) for internal state** — true encapsulation
6. **Use static methods for utility functions** — related to the class but not instances
7. **Prefer method chaining** — for fluent APIs

## Common Patterns

### Singleton Pattern

```javascript
class Database {
  static instance = null;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }
    this.connection = 'connected';
    Database.instance = this;
  }
}

const db1 = new Database();
const db2 = new Database();
console.log(db1 === db2);  // true
```

### Observer Pattern

```javascript
class EventEmitter {
  #events = {};

  on(event, callback) {
    if (!this.#events[event]) {
      this.#events[event] = [];
    }
    this.#events[event].push(callback);
  }

  emit(event, data) {
    if (this.#events[event]) {
      this.#events[event].forEach(callback => callback(data));
    }
  }
}

const emitter = new EventEmitter();
emitter.on('data', data => console.log('Received:', data));
emitter.emit('data', { id: 1 });  // "Received: { id: 1 }"
```

### Module Pattern

```javascript
const ShoppingCart = (function() {
  let items = [];

  return {
    addItem(item) {
      items.push(item);
    },
    getItems() {
      return [...items];  // Return copy
    },
    clear() {
      items = [];
    }
  };
})();

ShoppingCart.addItem({ id: 1, name: 'Book' });
console.log(ShoppingCart.getItems());  // [{ id: 1, name: 'Book' }]
console.log(ShoppingCart.items);      // undefined — private
```

## Summary

- **Classes** — syntactic sugar over prototypes, cleaner syntax
- **Inheritance** — `extends` and `super` for code reuse
- **Encapsulation** — private fields (#) or closures
- **Polymorphism** — same interface, different implementations
- **Abstraction** — hide complexity, expose essential features
- **Factory functions** — alternative to classes, no `this` confusion
- **Mixins** — add functionality without inheritance
- **Static members** — class-level properties and methods
- **Prototypal inheritance** — `Object.create()` for simple cases
