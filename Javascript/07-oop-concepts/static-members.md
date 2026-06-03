# Static Members in JavaScript

> 📅 **Concept** · ~5 min read · class-level properties and methods

## Definition

Static members (properties and methods) belong to the class itself, not to instances of the class. They are shared across all instances and are accessed directly on the class, not on objects created from the class.

Static members provide:
- **Shared data** — Common data across all instances
- **Utility functions** — Helper methods related to the class
- **Constants** — Class-level constants
- **Factory methods** — Alternative ways to create instances

## Static Methods

Static methods are defined using the `static` keyword and are called on the class:

```javascript
class MathUtils {
  static add(a, b) {
    return a + b;
  }

  static subtract(a, b) {
    return a - b;
  }

  static multiply(a, b) {
    return a * b;
  }

  static divide(a, b) {
    return a / b;
  }
}

// Called on the class
console.log(MathUtils.add(2, 3));      // 5
console.log(MathUtils.multiply(4, 5));  // 20

// Cannot call on instances
const utils = new MathUtils();
console.log(utils.add(2, 3));  // TypeError: utils.add is not a function
```

## Static Properties

ES2022+ supports static class fields:

```javascript
class Config {
  static API_URL = 'https://api.example.com';
  static API_VERSION = 'v1';
  static MAX_RETRIES = 3;
  static TIMEOUT = 5000;
}

console.log(Config.API_URL);      // "https://api.example.com"
console.log(Config.MAX_RETRIES);  // 3
```

## Static Methods for Utility Functions

```javascript
class StringUtils {
  static capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  static reverse(str) {
    return str.split('').reverse().join('');
  }

  static truncate(str, length) {
    return str.length > length ? str.slice(0, length) + '...' : str;
  }

  static isPalindrome(str) {
    const reversed = this.reverse(str.toLowerCase());
    return str.toLowerCase() === reversed;
  }
}

console.log(StringUtils.capitalize('hello'));      // "Hello"
console.log(StringUtils.reverse('hello'));        // "olleh"
console.log(StringUtils.truncate('Hello World', 5)); // "Hello..."
console.log(StringUtils.isPalindrome('racecar')); // true
```

## Static Methods for Validation

```javascript
class User {
  constructor(name, email, age) {
    this.name = name;
    this.email = email;
    this.age = age;
  }

  static validateName(name) {
    return name && name.length >= 2;
  }

  static validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  static validateAge(age) {
    return age >= 0 && age <= 150;
  }

  static validate(user) {
    return this.validateName(user.name) &&
           this.validateEmail(user.email) &&
           this.validateAge(user.age);
  }
}

console.log(User.validateName('Alice'));           // true
console.log(User.validateEmail('alice@test.com')); // true
console.log(User.validateAge(30));                 // true

const user = new User('Alice', 'alice@example.com', 30);
console.log(User.validate(user));  // true
```

## Static Factory Methods

Static methods can create instances with different initialization logic:

```javascript
class Color {
  constructor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  static fromHex(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? new Color(
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ) : null;
  }

  static fromRGB(r, g, b) {
    return new Color(r, g, b);
  }

  static random() {
    return new Color(
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256),
      Math.floor(Math.random() * 256)
    );
  }

  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

const red = Color.fromHex('#ff0000');
const blue = Color.fromRGB(0, 0, 255);
const random = Color.random();

console.log(red.toString());    // "rgb(255, 0, 0)"
console.log(blue.toString());   // "rgb(0, 0, 255)"
console.log(random.toString()); // Random color
```

## Static Properties for Constants

```javascript
class HTTPStatus {
  static OK = 200;
  static CREATED = 201;
  static BAD_REQUEST = 400;
  static UNAUTHORIZED = 401;
  static NOT_FOUND = 404;
  static INTERNAL_ERROR = 500;
}

class APIResponse {
  static success(data) {
    return {
      status: HTTPStatus.OK,
      data
    };
  }

  static error(message, status = HTTPStatus.INTERNAL_ERROR) {
    return {
      status,
      error: message
    };
  }
}

console.log(APIResponse.success({ id: 1 }));
console.log(APIResponse.error('Not found', HTTPStatus.NOT_FOUND));
```

## Static Methods for Comparison

```javascript
class Money {
  constructor(amount, currency = 'USD') {
    this.amount = amount;
    this.currency = currency;
  }

  static compare(a, b) {
    if (a.currency !== b.currency) {
      throw new Error('Cannot compare different currencies');
    }
    return a.amount - b.amount;
  }

  static max(...monies) {
    return monies.reduce((max, current) => {
      return this.compare(current, max) > 0 ? current : max;
    });
  }

  static min(...monies) {
    return monies.reduce((min, current) => {
      return this.compare(current, min) < 0 ? current : min;
    });
  }
}

const m1 = new Money(100, 'USD');
const m2 = new Money(200, 'USD');
const m3 = new Money(150, 'USD');

console.log(Money.compare(m1, m2));  // -100
console.log(Money.max(m1, m2, m3));   // Money { amount: 200, currency: 'USD' }
console.log(Money.min(m1, m2, m3));   // Money { amount: 100, currency: 'USD' }
```

## Static Methods for Configuration

```javascript
class Database {
  static config = {
    host: 'localhost',
    port: 5432,
    database: 'myapp',
    user: 'admin',
    password: 'secret'
  };

  static configure(config) {
    this.config = { ...this.config, ...config };
  }

  static getConnectionUrl() {
    const { host, port, database, user, password } = this.config;
    return `postgresql://${user}:${password}@${host}:${port}/${database}`;
  }
}

Database.configure({ host: 'production.db', port: 5433 });
console.log(Database.getConnectionUrl());
```

## Static Methods in Inheritance

Static methods are inherited by subclasses:

```javascript
class Animal {
  static species() {
    return 'Unknown';
  }

  static info() {
    return `This is an animal of species: ${this.species()}`;
  }
}

class Dog extends Animal {
  static species() {
    return 'Canis lupus familiaris';
  }
}

class Cat extends Animal {
  static species() {
    return 'Felis catus';
  }
}

console.log(Animal.info());  // "This is an animal of species: Unknown"
console.log(Dog.info());     // "This is an animal of species: Canis lupus familiaris"
console.log(Cat.info());     // "This is an animal of species: Felis catus"
```

## Static Methods with super

```javascript
class Parent {
  static staticMethod() {
    return 'Parent static method';
  }
}

class Child extends Parent {
  static staticMethod() {
    return super.staticMethod() + ' (child version)';
  }
}

console.log(Child.staticMethod());  // "Parent static method (child version)"
```

## Static Private Fields

ES2022+ supports private static fields:

```javascript
class Counter {
  static #count = 0;

  static increment() {
    this.#count++;
    return this.#count;
  }

  static decrement() {
    this.#count--;
    return this.#count;
  }

  static getCount() {
    return this.#count;
  }
}

console.log(Counter.increment());  // 1
console.log(Counter.increment());  // 2
console.log(Counter.getCount());   // 2
console.log(Counter.#count);       // SyntaxError — private
```

## Static Block Initialization

ES2022+ supports static blocks for complex initialization:

```javascript
class Config {
  static settings = {};

  static {
    // Complex initialization logic
    this.settings = {
      env: process.env.NODE_ENV || 'development',
      debug: process.env.NODE_ENV === 'development',
      version: '1.0.0'
    };

    console.log('Config initialized:', this.settings);
  }
}

console.log(Config.settings);
```

## Static Methods vs Instance Methods

```javascript
class Calculator {
  constructor(value) {
    this.value = value;
  }

  // Instance method — operates on instance data
  add(n) {
    this.value += n;
    return this;
  }

  // Static method — independent of instances
  static add(a, b) {
    return a + b;
  }
}

const calc = new Calculator(10);
calc.add(5);           // Instance method — modifies calc.value
console.log(calc.value); // 15

Calculator.add(10, 20); // Static method — doesn't need instance
console.log(Calculator.add(10, 20)); // 30
```

## When to Use Static Members

**Use static methods when:**
- The method doesn't need access to instance data
- It's a utility function related to the class
- You need factory methods for creating instances
- You need validation or comparison functions

**Use static properties when:**
- You need class-level constants
- You need shared configuration
- You need to maintain class-level state

**Don't use static members when:**
- The method needs to access instance properties
- You need different values per instance
- The method operates on object state

## Best Practices

1. **Use for utilities** — Static methods are great for utility functions
2. **Keep them pure** — Static methods should not have side effects when possible
3. **Document clearly** — Make it obvious which methods are static
4. **Use for constants** — Class-level constants should be static
5. **Avoid state** — Be careful with mutable static state
6. **Factory pattern** — Use static methods for alternative constructors

## Common Patterns

### Singleton Pattern

```javascript
class Database {
  static #instance = null;

  constructor() {
    if (Database.#instance) {
      return Database.#instance;
    }
    this.connection = 'connected';
    Database.#instance = this;
  }

  static getInstance() {
    if (!Database.#instance) {
      Database.#instance = new Database();
    }
    return Database.#instance;
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true
```

### Registry Pattern

```javascript
class Registry {
  static #items = new Map();

  static register(key, value) {
    this.#items.set(key, value);
  }

  static get(key) {
    return this.#items.get(key);
  }

  static has(key) {
    return this.#items.has(key);
  }

  static unregister(key) {
    this.#items.delete(key);
  }
}

Registry.register('user-service', { url: '/api/users' });
console.log(Registry.get('user-service'));
```

### Enum Pattern

```javascript
class Direction {
  static NORTH = { value: 'N', degrees: 0 };
  static SOUTH = { value: 'S', degrees: 180 };
  static EAST = { value: 'E', degrees: 90 };
  static WEST = { value: 'W', degrees: 270 };

  static fromDegrees(degrees) {
    const normalized = degrees % 360;
    if (normalized === 0) return this.NORTH;
    if (normalized === 90) return this.EAST;
    if (normalized === 180) return this.SOUTH;
    if (normalized === 270) return this.WEST;
  }
}

console.log(Direction.fromDegrees(90));  // Direction.EAST
```
