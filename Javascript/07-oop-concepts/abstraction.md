# Abstraction in JavaScript

> 📅 **Concept** · ~5 min read · hiding complexity, exposing essential features

## Definition

Abstraction is the concept of hiding complex implementation details and showing only the essential features of an object. It reduces complexity and helps the user focus on what an object does rather than how it does it.

Abstraction provides:
- **Simplified interface** — Users interact with a clean, simple API
- **Hidden complexity** — Internal details are not exposed
- **Flexibility** — Implementation can change without affecting users
- **Focus on what, not how** — Users know what operations are available

## Abstraction with Classes

Classes can provide abstraction by hiding internal details behind public methods:

```javascript
class Car {
  #engine;      // Private — hidden complexity
  #fuelLevel;
  #isRunning;

  constructor() {
    this.#engine = new Engine();  // Complex object hidden
    this.#fuelLevel = 100;
    this.#isRunning = false;
  }

  start() {
    if (this.#fuelLevel <= 0) {
      throw new Error('No fuel');
    }
    this.#engine.ignite();  // Internal complexity
    this.#isRunning = true;
  }

  stop() {
    this.#engine.shutdown();
    this.#isRunning = false;
  }

  drive(distance) {
    if (!this.#isRunning) {
      throw new Error('Car is not running');
    }
    const fuelConsumed = distance * 0.1;
    this.#fuelLevel -= fuelConsumed;
  }

  getFuelLevel() {
    return this.#fuelLevel;
  }
}

// User doesn't need to know about Engine internals
const car = new Car();
car.start();
car.drive(50);
console.log(car.getFuelLevel());  // 95
```

## Abstract Classes (Convention)

JavaScript doesn't have built-in abstract classes, but you can create them by convention:

```javascript
class Database {
  constructor(connectionString) {
    if (this.constructor === Database) {
      throw new Error('Abstract class Database cannot be instantiated');
    }
    this.connectionString = connectionString;
  }

  connect() {
    throw new Error('Method connect() must be implemented');
  }

  query(sql) {
    throw new Error('Method query() must be implemented');
  }

  close() {
    throw new Error('Method close() must be implemented');
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

  close() {
    console.log('Closing MySQL connection');
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

  close() {
    console.log('Closing PostgreSQL connection');
  }
}

// const db = new Database('localhost');  // Error!

const mysql = new MySQL('localhost:3306');
mysql.connect();
mysql.query('SELECT * FROM users');
mysql.close();
```

## Abstraction with Factory Functions

Factory functions can hide object creation complexity:

```javascript
function createPerson(name, age) {
  // Internal complexity hidden
  const id = generateUniqueId();
  const createdAt = new Date();

  return {
    // Public interface
    getName() {
      return name;
    },
    getAge() {
      return age;
    },
    getId() {
      return id;
    },

    // Internal details hidden
    getCreatedAt() {
      return createdAt;
    }
  };
}

function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

const person = createPerson('Alice', 30);
console.log(person.getName());  // "Alice"
// person.generateUniqueId()  // Not accessible
```

## Abstraction with Modules

Modules provide abstraction by exporting only what's needed:

```javascript
// utils.js — internal implementation hidden
function internalHelper(x) {
  return x * 2;
}

function anotherHelper(x) {
  return x + 10;
}

export function processData(data) {
  return data.map(internalHelper).map(anotherHelper);
}

export function validate(input) {
  return input.length > 0;
}

// main.js — only sees what's exported
import { processData, validate } from './utils.js';

const result = processData([1, 2, 3]);
console.log(result);  // [12, 14, 16]
// internalHelper is not accessible
```

## Abstraction with APIs

APIs abstract away complex operations:

```javascript
class APIClient {
  #baseUrl;
  #apiKey;

  constructor(baseUrl, apiKey) {
    this.#baseUrl = baseUrl;
    this.#apiKey = apiKey;
  }

  async get(endpoint) {
    // Complex HTTP logic hidden
    const url = `${this.#baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async post(endpoint, data) {
    const url = `${this.#baseUrl}${endpoint}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.#apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }
}

// User doesn't need to know about fetch, headers, error handling
const api = new APIClient('https://api.example.com', 'secret-key');
const users = await api.get('/users');
await api.post('/users', { name: 'Alice' });
```

## Abstraction with Higher-Order Functions

Higher-order functions can abstract iteration patterns:

```javascript
// Abstraction: hide the loop, focus on the operation
function map(array, fn) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    result.push(fn(array[i], i, array));
  }
  return result;
}

function filter(array, fn) {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

function reduce(array, fn, initial) {
  let accumulator = initial;
  for (let i = 0; i < array.length; i++) {
    accumulator = fn(accumulator, array[i], i, array);
  }
  return accumulator;
}

// Users focus on what to do, not how to iterate
const numbers = [1, 2, 3, 4, 5];

const doubled = map(numbers, n => n * 2);
const evens = filter(numbers, n => n % 2 === 0);
const sum = reduce(numbers, (acc, n) => acc + n, 0);
```

## Abstraction with Promises

Promises abstract asynchronous operations:

```javascript
// Without abstraction — complex callback handling
function fetchData(callback) {
  setTimeout(() => {
    callback(null, { data: 'result' });
  }, 1000);
}

fetchData((error, result) => {
  if (error) {
    console.error(error);
  } else {
    console.log(result);
  }
});

// With abstraction — clean promise API
function fetchDataPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: 'result' });
    }, 1000);
  });
}

fetchDataPromise()
  .then(result => console.log(result))
  .catch(error => console.error(error));
```

## Abstraction Layers

Building layers of abstraction:

```javascript
// Layer 1: Low-level database operations
class DatabaseConnection {
  executeQuery(sql) {
    // Direct database interaction
    console.log(`Executing SQL: ${sql}`);
    return { rows: [{ id: 1, name: 'Alice' }] };
  }
}

// Layer 2: Data access abstraction
class UserRepository {
  constructor(db) {
    this.db = db;
  }

  findById(id) {
    return this.db.executeQuery(`SELECT * FROM users WHERE id = ${id}`);
  }

  findAll() {
    return this.db.executeQuery('SELECT * FROM users');
  }
}

// Layer 3: Business logic abstraction
class UserService {
  constructor(userRepo) {
    this.userRepo = userRepo;
  }

  getUser(id) {
    const result = this.userRepo.findById(id);
    // Business logic here
    return result.rows[0];
  }

  getAllUsers() {
    const result = this.userRepo.findAll();
    return result.rows;
  }
}

// Layer 4: API abstraction
class UserController {
  constructor(userService) {
    this.userService = userService;
  }

  handleGetUser(req) {
    const user = this.userService.getUser(req.params.id);
    return { status: 200, body: user };
  }
}

// Each layer hides the complexity of the layer below
const db = new DatabaseConnection();
const userRepo = new UserRepository(db);
const userService = new UserService(userRepo);
const controller = new UserController(userService);

const response = controller.handleGetUser({ params: { id: 1 } });
console.log(response);
```

## Benefits of Abstraction

1. **Reduced Complexity** — Users deal with simpler interfaces
2. **Improved Maintainability** — Changes to implementation don't affect users
3. **Better Focus** — Users focus on what, not how
4. **Reusability** — Abstracted components can be reused
5. **Security** — Sensitive details can be hidden

## Best Practices

1. **Hide implementation details** — Only expose necessary methods
2. **Provide clear interfaces** — Make the public API intuitive
3. **Use meaningful names** — Method names should describe what they do
4. **Document the abstraction** — Explain what the abstraction does
5. **Keep abstractions small** — Large abstractions are hard to understand
6. **Don't over-abstract** — Only abstract when it provides value

## Common Patterns

### Facade Pattern

```javascript
class Computer {
  #cpu;
  #memory;
  #storage;

  constructor() {
    this.#cpu = new CPU();
    this.#memory = new Memory();
    this.#storage = new Storage();
  }

  // Facade — hides complexity of starting components
  start() {
    this.#cpu.boot();
    this.#memory.initialize();
    this.#storage.mount();
    console.log('Computer started');
  }
}

class CPU {
  boot() {
    console.log('CPU booting...');
  }
}

class Memory {
  initialize() {
    console.log('Memory initializing...');
  }
}

class Storage {
  mount() {
    console.log('Storage mounting...');
  }
}

const computer = new Computer();
computer.start();
// User doesn't need to know about CPU, Memory, Storage
```

### Builder Pattern

```javascript
class SQLQueryBuilder {
  #select = [];
  #from = '';
  #where = [];
  #orderBy = '';
  #limit = 0;

  select(columns) {
    this.#select = Array.isArray(columns) ? columns : [columns];
    return this;
  }

  from(table) {
    this.#from = table;
    return this;
  }

  where(condition) {
    this.#where.push(condition);
    return this;
  }

  orderBy(column) {
    this.#orderBy = column;
    return this;
  }

  limit(count) {
    this.#limit = count;
    return this;
  }

  build() {
    let query = `SELECT ${this.#select.join(', ')} FROM ${this.#from}`;

    if (this.#where.length > 0) {
      query += ` WHERE ${this.#where.join(' AND ')}`;
    }

    if (this.#orderBy) {
      query += ` ORDER BY ${this.#orderBy}`;
    }

    if (this.#limit > 0) {
      query += ` LIMIT ${this.#limit}`;
    }

    return query;
  }
}

const query = new SQLQueryBuilder()
  .select(['id', 'name', 'email'])
  .from('users')
  .where('age > 18')
  .where('status = "active"')
  .orderBy('name')
  .limit(10)
  .build();

console.log(query);
// SELECT id, name, email FROM users WHERE age > 18 AND status = "active" ORDER BY name LIMIT 10
```
