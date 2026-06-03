# Classes in JavaScript

> 📅 **Concept** · ~5 min read · ES6+ syntax for object creation

## Definition

Classes in JavaScript are syntactic sugar over the existing prototype-based inheritance. They provide a cleaner, more familiar syntax for creating objects and dealing with inheritance, especially for developers coming from class-based languages like Java, C#, or Python.

Under the hood, JavaScript classes still use prototypes — they don't introduce a new object-oriented inheritance model.

## Basic Class Structure

```javascript
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
}

const person = new Person('Alice', 30);
console.log(person.greet());        // "Hello, I'm Alice"
console.log(Person.species());      // "Homo sapiens"
```

## Constructor

The `constructor` is a special method for creating and initializing an object created with a class.

```javascript
class Car {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }
}

const car = new Car('Toyota', 'Camry', 2022);
```

**Key points:**
- Only one constructor per class
- If you don't define one, JavaScript provides a default constructor
- Must call `super()` in subclass constructors before using `this`

## Instance Methods

Methods defined inside a class body are added to the prototype, shared across all instances.

```javascript
class Calculator {
  add(a, b) {
    return a + b;
  }

  subtract(a, b) {
    return a - b;
  }
}

const calc1 = new Calculator();
const calc2 = new Calculator();

console.log(calc1.add === calc2.add);  // true — shared via prototype
```

## Static Methods

Static methods are called on the class itself, not on instances. They're useful for utility functions.

```javascript
class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static multiply(a, b) {
    return a * b;
  }
}

console.log(MathUtils.add(2, 3));    // 5
console.log(MathUtils.multiply(4, 5)); // 20

const utils = new MathUtils();
console.log(utils.add(2, 3));        // TypeError: utils.add is not a function
```

## Static Properties

ES2022+ supports static class fields:

```javascript
class Config {
  static API_URL = 'https://api.example.com';
  static VERSION = '1.0.0';
  static MAX_RETRIES = 3;
}

console.log(Config.API_URL);  // "https://api.example.com"
```

## Getters and Setters

Getters and setters allow you to define computed properties and add validation.

```javascript
class Rectangle {
  constructor(width, height) {
    this._width = width;
    this._height = height;
  }

  // Getter — computed property
  get area() {
    return this._width * this._height;
  }

  // Getter
  get width() {
    return this._width;
  }

  // Setter — with validation
  set width(value) {
    if (value <= 0) {
      throw new Error('Width must be positive');
    }
    this._width = value;
  }
}

const rect = new Rectangle(5, 10);
console.log(rect.area);  // 50

rect.width = 8;
console.log(rect.area);  // 80

rect.width = -2;         // Error: Width must be positive
```

## Private Fields (#)

ES2022 introduced private class fields using the `#` prefix. These are truly private and cannot be accessed from outside the class.

```javascript
class BankAccount {
  #balance;  // Private field
  #accountNumber;

  constructor(accountNumber, initialBalance) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    this.#balance -= amount;
  }

  getBalance() {
    return this.#balance;
  }
}

const account = new BankAccount('12345', 100);
account.deposit(50);
console.log(account.getBalance());  // 150
console.log(account.#balance);       // SyntaxError — private!
```

## Private Methods

You can also create private methods:

```javascript
class Auth {
  #hashPassword(password) {
    // Simulated hashing
    return btoa(password);
  }

  login(username, password) {
    const hashed = this.#hashPassword(password);
    return `User ${username} logged in with hash: ${hashed}`;
  }
}

const auth = new Auth();
console.log(auth.login('alice', 'secret'));  // Works
console.log(auth.#hashPassword('test'));     // SyntaxError
```

## Class Expressions

Classes can be defined as expressions, similar to functions:

```javascript
const Person = class {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hello, ${this.name}`;
  }
};

const person = new Person('Bob');
console.log(person.greet());  // "Hello, Bob"
```

## Named Class Expressions

```javascript
const Person = class PersonClass {
  constructor(name) {
    this.name = name;
  }

  // Can reference the class name inside
  createCopy() {
    return new PersonClass(this.name);
  }
};
```

## Hoisting

Unlike function declarations, class declarations are **not hoisted**:

```javascript
const person = new Person();  // ReferenceError

class Person {
  constructor(name) {
    this.name = name;
  }
}
```

You must declare the class before using it.

## First-Class Citizens

Classes are first-class citizens — they can be:

```javascript
// Passed as arguments
function createInstance(Class, ...args) {
  return new Class(...args);
}

const person = createInstance(Person, 'Alice');

// Returned from functions
function getClass() {
  return class {
    constructor(value) {
      this.value = value;
    }
  };
}

const DynamicClass = getClass();
const instance = new DynamicClass(42);
```

## Class vs Prototype

Classes compile to prototypes:

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

Both produce the same result, but classes provide:
- Cleaner syntax
- More familiar to developers from other languages
- Built-in constructor
- Super support for inheritance
- Private fields

## Best Practices

1. **Use PascalCase** for class names: `class User {}`
2. **One class per file** for better organization
3. **Keep constructors simple** — just initialize properties
4. **Use private fields (#)** for internal state
5. **Prefer methods over direct property access** for encapsulation
6. **Use static methods** for utility functions related to the class
7. **Document your classes** with JSDoc comments

## Common Use Cases

```javascript
// Data model
class User {
  constructor(id, name, email) {
    this.id = id;
    this.name = name;
    this.email = email;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email
    };
  }
}

// Service class
class APIService {
  static async fetch(url) {
    const response = await fetch(url);
    return response.json();
  }

  static async post(url, data) {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }
}

// Utility class
class Validator {
  static isEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static isPhone(phone) {
    return /^\d{10}$/.test(phone);
  }
}
```
