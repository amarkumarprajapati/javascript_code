# Design Patterns in JavaScript

> 📅 **Concept** · ~10 min read · reusable solutions to common problems

## Definition

Design patterns are reusable solutions to commonly occurring problems in software design. They represent best practices and provide a shared vocabulary for developers to communicate complex design concepts effectively.

## Singleton Pattern

Ensures a class has only one instance and provides a global point of access to it.

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

  query(sql) {
    console.log(`Executing: ${sql}`);
  }
}

const db1 = Database.getInstance();
const db2 = Database.getInstance();
console.log(db1 === db2);  // true

db1.query('SELECT * FROM users');
```

## Factory Pattern

Creates objects without specifying the exact class of object that will be created.

```javascript
class Button {
  constructor(label) {
    this.label = label;
  }

  render() {
    return `<button>${this.label}</button>`;
  }
}

class Input {
  constructor(placeholder) {
    this.placeholder = placeholder;
  }

  render() {
    return `<input placeholder="${this.placeholder}">`;
  }
}

class UIElementFactory {
  static create(type, options) {
    switch (type) {
      case 'button':
        return new Button(options.label);
      case 'input':
        return new Input(options.placeholder);
      default:
        throw new Error('Unknown element type');
    }
  }
}

const button = UIElementFactory.create('button', { label: 'Click me' });
const input = UIElementFactory.create('input', { placeholder: 'Enter text' });

console.log(button.render());  // "<button>Click me</button>"
console.log(input.render());   // "<input placeholder="Enter text">"
```

## Observer Pattern

Defines a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.

```javascript
class EventEmitter {
  #events = {};

  on(event, callback) {
    if (!this.#events[event]) {
      this.#events[event] = [];
    }
    this.#events[event].push(callback);
  }

  off(event, callback) {
    if (this.#events[event]) {
      this.#events[event] = this.#events[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.#events[event]) {
      this.#events[event].forEach(callback => callback(data));
    }
  }
}

class NewsPublisher extends EventEmitter {
  publishNews(news) {
    console.log('Publishing:', news);
    this.emit('news', news);
  }
}

const publisher = new NewsPublisher();

publisher.on('news', (news) => {
  console.log('Subscriber 1 received:', news);
});

publisher.on('news', (news) => {
  console.log('Subscriber 2 received:', news);
});

publisher.publishNews('Breaking: JavaScript is awesome!');
```

## Module Pattern

Encapsulates private and public members within a single object.

```javascript
const ShoppingCart = (function() {
  let items = [];  // Private
  let total = 0;   // Private

  return {
    addItem(item) {
      items.push(item);
      total += item.price;
    },

    removeItem(id) {
      const index = items.findIndex(item => item.id === id);
      if (index !== -1) {
        total -= items[index].price;
        items.splice(index, 1);
      }
    },

    getItems() {
      return [...items];  // Return copy
    },

    getTotal() {
      return total;
    },

    clear() {
      items = [];
      total = 0;
    }
  };
})();

ShoppingCart.addItem({ id: 1, name: 'Book', price: 20 });
ShoppingCart.addItem({ id: 2, name: 'Pen', price: 5 });
console.log(ShoppingCart.getTotal());  // 25
console.log(ShoppingCart.items);      // undefined — private
```

## Strategy Pattern

Defines a family of algorithms, encapsulates each one, and makes them interchangeable.

```javascript
class SortStrategy {
  sort(array) {
    throw new Error('Must implement sort()');
  }
}

class BubbleSort extends SortStrategy {
  sort(array) {
    console.log('Using bubble sort');
    const arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }
}

class QuickSort extends SortStrategy {
  sort(array) {
    console.log('Using quick sort');
    const arr = [...array];
    if (arr.length <= 1) return arr;
    const pivot = arr[0];
    const left = arr.slice(1).filter(x => x <= pivot);
    const right = arr.slice(1).filter(x => x > pivot);
    return [...this.sort(left), pivot, ...this.sort(right)];
  }
}

class Sorter {
  constructor(strategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy) {
    this.strategy = strategy;
  }

  sort(array) {
    return this.strategy.sort(array);
  }
}

const data = [5, 2, 8, 1, 9];

const sorter = new Sorter(new BubbleSort());
console.log(sorter.sort(data));  // [1, 2, 5, 8, 9]

sorter.setStrategy(new QuickSort());
console.log(sorter.sort(data));  // [1, 2, 5, 8, 9]
```

## Decorator Pattern

Adds behavior to individual objects dynamically without affecting other objects.

```javascript
class Coffee {
  cost() {
    return 5;
  }

  description() {
    return 'Coffee';
  }
}

class MilkDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost() + 1;
  }

  description() {
    return this.coffee.description() + ', Milk';
  }
}

class SugarDecorator {
  constructor(coffee) {
    this.coffee = coffee;
  }

  cost() {
    return this.coffee.cost() + 0.5;
  }

  description() {
    return this.coffee.description() + ', Sugar';
  }
}

let coffee = new Coffee();
console.log(coffee.cost());        // 5
console.log(coffee.description()); // "Coffee"

coffee = new MilkDecorator(coffee);
console.log(coffee.cost());        // 6
console.log(coffee.description()); // "Coffee, Milk"

coffee = new SugarDecorator(coffee);
console.log(coffee.cost());        // 6.5
console.log(coffee.description()); // "Coffee, Milk, Sugar"
```

## Adapter Pattern

Allows incompatible interfaces to work together.

```javascript
class LegacyAPI {
  getLegacyData() {
    return {
      user_name: 'Alice',
      user_age: 30,
      user_email: 'alice@example.com'
    };
  }
}

class ModernAPIAdapter {
  constructor(legacyAPI) {
    this.legacyAPI = legacyAPI;
  }

  getUser() {
    const data = this.legacyAPI.getLegacyData();
    return {
      name: data.user_name,
      age: data.user_age,
      email: data.user_email
    };
  }
}

const legacyAPI = new LegacyAPI();
const adapter = new ModernAPIAdapter(legacyAPI);

const user = adapter.getUser();
console.log(user);  // { name: 'Alice', age: 30, email: 'alice@example.com' }
```

## Facade Pattern

Provides a simplified interface to a complex subsystem.

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

  // Facade — hides complexity
  start() {
    this.#cpu.boot();
    this.#memory.initialize();
    this.#storage.mount();
    console.log('Computer started');
  }

  shutdown() {
    this.#storage.unmount();
    this.#memory.clear();
    this.#cpu.shutdown();
    console.log('Computer shutdown');
  }
}

class CPU {
  boot() {
    console.log('CPU booting...');
  }
  shutdown() {
    console.log('CPU shutting down...');
  }
}

class Memory {
  initialize() {
    console.log('Memory initializing...');
  }
  clear() {
    console.log('Memory clearing...');
  }
}

class Storage {
  mount() {
    console.log('Storage mounting...');
  }
  unmount() {
    console.log('Storage unmounting...');
  }
}

const computer = new Computer();
computer.start();
computer.shutdown();
```

## Builder Pattern

Constructs complex objects step by step.

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

## Proxy Pattern

Provides a surrogate or placeholder to control access to an object.

```javascript
class SmartProxy {
  constructor(target) {
    this.target = target;
    this.cache = new Map();
  }

  get(property) {
    if (this.cache.has(property)) {
      console.log(`Cache hit for ${property}`);
      return this.cache.get(property);
    }

    console.log(`Cache miss for ${property}`);
    const value = this.target[property];
    this.cache.set(property, value);
    return value;
  }

  set(property, value) {
    this.target[property] = value;
    this.cache.delete(property); // Invalidate cache
  }
}

const data = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com'
};

const proxy = new SmartProxy(data);

console.log(proxy.get('name'));  // Cache miss
console.log(proxy.get('name'));  // Cache hit
proxy.set('name', 'Bob');
console.log(proxy.get('name'));  // Cache miss
```

## Command Pattern

Encapsulates a request as an object, allowing parameterization and queuing.

```javascript
class Command {
  execute() {
    throw new Error('Must implement execute()');
  }

  undo() {
    throw new Error('Must implement undo()');
  }
}

class AddCommand extends Command {
  constructor(receiver, value) {
    super();
    this.receiver = receiver;
    this.value = value;
  }

  execute() {
    this.receiver.add(this.value);
  }

  undo() {
    this.receiver.subtract(this.value);
  }
}

class Calculator {
  constructor() {
    this.value = 0;
  }

  add(n) {
    this.value += n;
    console.log(`Value: ${this.value}`);
  }

  subtract(n) {
    this.value -= n;
    console.log(`Value: ${this.value}`);
  }
}

const calculator = new Calculator();
const commandHistory = [];

const add5 = new AddCommand(calculator, 5);
const add10 = new AddCommand(calculator, 10);

add5.execute();
commandHistory.push(add5);

add10.execute();
commandHistory.push(add10);

// Undo last command
commandHistory.pop().undo();
```

## Iterator Pattern

Provides a way to access elements of an aggregate object sequentially without exposing its underlying representation.

```javascript
class ArrayIterator {
  constructor(array) {
    this.array = array;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.array.length;
  }

  next() {
    return this.array[this.index++];
  }
}

class NumberCollection {
  constructor(numbers) {
    this.numbers = numbers;
  }

  createIterator() {
    return new ArrayIterator(this.numbers);
  }
}

const collection = new NumberCollection([1, 2, 3, 4, 5]);
const iterator = collection.createIterator();

while (iterator.hasNext()) {
  console.log(iterator.next());
}
```

## Chain of Responsibility Pattern

Passes a request along a chain of handlers.

```javascript
class Handler {
  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }

  handle(request) {
    if (this.nextHandler) {
      return this.nextHandler.handle(request);
    }
    return null;
  }
}

class AuthHandler extends Handler {
  handle(request) {
    if (!request.authenticated) {
      return 'Authentication failed';
    }
    return super.handle(request);
  }
}

class ValidationHandler extends Handler {
  handle(request) {
    if (!request.valid) {
      return 'Validation failed';
    }
    return super.handle(request);
  }
}

class LogHandler extends Handler {
  handle(request) {
    console.log('Request logged:', request);
    return super.handle(request);
  }
}

const auth = new AuthHandler();
const validation = new ValidationHandler();
const log = new LogHandler();

auth.setNext(validation).setNext(log);

const request1 = { authenticated: true, valid: true };
console.log(auth.handle(request1));  // null (success)

const request2 = { authenticated: false, valid: true };
console.log(auth.handle(request2));  // "Authentication failed"
```

## When to Use Patterns

| Pattern | Use When |
|---------|----------|
| **Singleton** | Need exactly one instance (database, config) |
| **Factory** | Creating objects without specifying exact class |
| **Observer** | One-to-many dependencies, event handling |
| **Module** | Encapsulation, private state |
| **Strategy** | Interchangeable algorithms |
| **Decorator** | Add behavior dynamically |
| **Adapter** | Make incompatible interfaces work together |
| **Facade** | Simplify complex subsystem |
| **Builder** | Construct complex objects step by step |
| **Proxy** | Control access to an object |
| **Command** | Parameterize/queue operations |
| **Iterator** | Traverse collections uniformly |
| **Chain of Responsibility** | Pass requests through handlers |

## Best Practices

1. **Don't overuse** — Patterns add complexity, use only when needed
2. **Understand the problem** — Know why you're using a pattern
3. **Keep it simple** — Don't force patterns where they don't fit
4. **Document the pattern** — Make it clear which pattern is used
5. **Refactor when needed** — Patterns can evolve with the codebase
6. **Consider JavaScript features** — Some patterns are built into JS (iterators, proxies)
