# Polymorphism in JavaScript

> 📅 **Concept** · ~5 min read · many forms, same interface

## Definition

Polymorphism means "many forms" — the ability of different classes to be treated as instances of the same general type through a common interface. This allows objects of different classes to respond to the same method call in their own specific way.

Polymorphism enables:
- **Code flexibility** — write code that works with multiple types
- **Extensibility** — add new types without modifying existing code
- **Clean architecture** — reduce conditional logic

## Method Overriding

The simplest form of polymorphism — subclasses override parent methods:

```javascript
class Animal {
  speak() {
    return 'Some sound';
  }
}

class Dog extends Animal {
  speak() {
    return 'Woof!';
  }
}

class Cat extends Animal {
  speak() {
    return 'Meow!';
  }
}

class Bird extends Animal {
  speak() {
    return 'Tweet!';
  }
}

const animals = [new Dog(), new Cat(), new Bird()];

animals.forEach(animal => {
  console.log(animal.speak());
});
// Output:
// Woof!
// Meow!
// Tweet!
```

## Polymorphic Functions

Functions that work with any object that implements a specific interface:

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

class Triangle extends Shape {
  constructor(base, height) {
    super();
    this.base = base;
    this.height = height;
  }

  area() {
    return 0.5 * this.base * this.height;
  }
}

// Polymorphic function — works with any Shape
function printArea(shape) {
  console.log(`Area: ${shape.area().toFixed(2)}`);
}

printArea(new Circle(5));       // "Area: 78.54"
printArea(new Rectangle(4, 6)); // "Area: 24.00"
printArea(new Triangle(3, 4));  // "Area: 6.00"
```

## Polymorphic Arrays

Collections of different types treated uniformly:

```javascript
class Employee {
  constructor(name, salary) {
    this.name = name;
    this.salary = salary;
  }

  calculatePay() {
    return this.salary;
  }
}

class FullTimeEmployee extends Employee {
  constructor(name, salary, bonus) {
    super(name, salary);
    this.bonus = bonus;
  }

  calculatePay() {
    return this.salary + this.bonus;
  }
}

class PartTimeEmployee extends Employee {
  constructor(name, hourlyRate, hoursWorked) {
    super(name, 0);
    this.hourlyRate = hourlyRate;
    this.hoursWorked = hoursWorked;
  }

  calculatePay() {
    return this.hourlyRate * this.hoursWorked;
  }
}

const employees = [
  new FullTimeEmployee('Alice', 5000, 1000),
  new PartTimeEmployee('Bob', 20, 160),
  new FullTimeEmployee('Charlie', 6000, 500)
];

let totalPayroll = 0;
employees.forEach(emp => {
  const pay = emp.calculatePay();
  console.log(`${emp.name}: $${pay}`);
  totalPayroll += pay;
});

console.log(`Total Payroll: $${totalPayroll}`);
```

## Duck Typing

JavaScript uses duck typing — "if it walks like a duck and quacks like a duck, it's a duck". Objects are polymorphic based on their methods, not their class:

```javascript
class Duck {
  quack() {
    return 'Quack!';
  }

  fly() {
    return 'Flying...';
  }
}

class Person {
  quack() {
    return 'I\'m quacking like a duck!';
  }

  fly() {
    return 'I\'m flapping my arms!';
  }
}

function makeItQuack(thing) {
  if (thing.quack) {
    console.log(thing.quack());
  }
}

makeItQuack(new Duck());   // "Quack!"
makeItQuack(new Person()); // "I'm quacking like a duck!"
```

## Interface-like Behavior

JavaScript doesn't have interfaces, but you can create similar behavior:

```javascript
// Define "interface" as documentation
/**
 * @interface Logger
 * @method log(message) - Logs a message
 * @method error(message) - Logs an error
 */

class ConsoleLogger {
  log(message) {
    console.log(`[LOG] ${message}`);
  }

  error(message) {
    console.error(`[ERROR] ${message}`);
  }
}

class FileLogger {
  constructor(filename) {
    this.filename = filename;
    this.logs = [];
  }

  log(message) {
    this.logs.push(`[LOG] ${message}`);
  }

  error(message) {
    this.logs.push(`[ERROR] ${message}`);
  }

  save() {
    console.log(`Saving to ${this.filename}:`, this.logs);
  }
}

class RemoteLogger {
  log(message) {
    // Send to remote server
    console.log(`Sending to remote: ${message}`);
  }

  error(message) {
    console.log(`Sending error to remote: ${message}`);
  }
}

// Polymorphic usage
function processLogs(logger, messages) {
  messages.forEach(msg => {
    if (msg.type === 'error') {
      logger.error(msg.text);
    } else {
      logger.log(msg.text);
    }
  });
}

processLogs(new ConsoleLogger(), [
  { type: 'log', text: 'Starting...' },
  { type: 'error', text: 'Something went wrong' }
]);

processLogs(new FileLogger('app.log'), [
  { type: 'log', text: 'User logged in' }
]);
```

## Operator Overloading (Not in JavaScript)

JavaScript doesn't support operator overloading, but you can simulate it with methods:

```javascript
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  add(other) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  multiply(scalar) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }
}

const v1 = new Vector(3, 4);
const v2 = new Vector(1, 2);

console.log(v1.add(v2).toString());        // "(4, 6)"
console.log(v1.subtract(v2).toString());  // "(2, 2)"
console.log(v1.multiply(2).toString());   // "(6, 8)"
```

## Polymorphism with Prototypes

```javascript
const greeter = {
  greet() {
    return 'Hello!';
  }
};

const formalGreeter = Object.create(greeter);
formalGreeter.greet = function() {
  return 'Good day to you, sir!';
};

const casualGreeter = Object.create(greeter);
casualGreeter.greet = function() {
  return 'Hey there!';
};

function makeGreet(obj) {
  console.log(obj.greet());
}

makeGreet(greeter);        // "Hello!"
makeGreet(formalGreeter);  // "Good day to you, sir!"
makeGreet(casualGreeter);  // "Hey there!"
```

## Strategy Pattern

Polymorphism enables the strategy pattern — interchangeable algorithms:

```javascript
class SortStrategy {
  sort(array) {
    throw new Error('Must implement sort()');
  }
}

class BubbleSort extends SortStrategy {
  sort(array) {
    console.log('Using bubble sort');
    // Bubble sort implementation
    return array.slice().sort((a, b) => a - b);
  }
}

class QuickSort extends SortStrategy {
  sort(array) {
    console.log('Using quick sort');
    // Quick sort implementation
    return array.slice().sort((a, b) => a - b);
  }
}

class MergeSort extends SortStrategy {
  sort(array) {
    console.log('Using merge sort');
    // Merge sort implementation
    return array.slice().sort((a, b) => a - b);
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

## Benefits of Polymorphism

1. **Flexibility** — Code works with multiple types
2. **Extensibility** — Add new types without modifying existing code
3. **Reduced Conditionals** — Replace if/else with polymorphic calls
4. **Cleaner Code** — More readable and maintainable
5. **Open/Closed Principle** — Open for extension, closed for modification

## Best Practices

1. **Use common interfaces** — Define clear contracts for polymorphic objects
2. **Document expected behavior** — Make it clear what methods should be implemented
3. **Keep behavior consistent** — Polymorphic methods should have similar semantics
4. **Prefer composition** — Sometimes composition is better than inheritance for polymorphism
5. **Use type checking sparingly** — Duck typing is more flexible than instanceof checks

## Common Patterns

### Plugin System

```javascript
class Plugin {
  init() {
    throw new Error('Must implement init()');
  }

  execute(data) {
    throw new Error('Must implement execute()');
  }
}

class ValidationPlugin extends Plugin {
  init() {
    console.log('Validation plugin initialized');
  }

  execute(data) {
    return data.every(item => item.isValid);
  }
}

class LoggingPlugin extends Plugin {
  init() {
    console.log('Logging plugin initialized');
  }

  execute(data) {
    console.log('Processing data:', data);
    return true;
  }
}

class PluginManager {
  constructor() {
    this.plugins = [];
  }

  register(plugin) {
    this.plugins.push(plugin);
    plugin.init();
  }

  execute(data) {
    return this.plugins.every(plugin => plugin.execute(data));
  }
}

const manager = new PluginManager();
manager.register(new ValidationPlugin());
manager.register(new LoggingPlugin());
manager.execute([{ isValid: true }]);
```

### Renderer Pattern

```javascript
class Renderer {
  render(data) {
    throw new Error('Must implement render()');
  }
}

class JSONRenderer extends Renderer {
  render(data) {
    return JSON.stringify(data, null, 2);
  }
}

class XMLRenderer extends Renderer {
  render(data) {
    // Simplified XML rendering
    return `<data>${JSON.stringify(data)}</data>`;
  }
}

class HTMLRenderer extends Renderer {
  render(data) {
    return `<div>${JSON.stringify(data)}</div>`;
  }
}

function displayData(renderer, data) {
  console.log(renderer.render(data));
}

displayData(new JSONRenderer(), { name: 'Alice' });
displayData(new XMLRenderer(), { name: 'Bob' });
displayData(new HTMLRenderer(), { name: 'Charlie' });
```
