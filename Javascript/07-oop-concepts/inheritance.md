# Inheritance in JavaScript

> 📅 **Concept** · ~5 min read · extending classes with extends and super

## Definition

Inheritance is a mechanism where a new class derives properties and methods from an existing class. This promotes code reuse and establishes a natural hierarchy between classes.

In JavaScript, inheritance is implemented through prototypes, and the `class` syntax with `extends` keyword provides a clean way to create inheritance relationships.

## Basic Inheritance

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }

  eat() {
    return `${this.name} is eating`;
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name);  // Call parent constructor
    this.breed = breed;
  }

  // Override parent method
  speak() {
    return `${this.name} barks!`;
  }

  // Add new method
  fetch() {
    return `${this.name} fetches the ball`;
  }
}

const dog = new Dog('Rex', 'German Shepherd');
console.log(dog.speak());  // "Rex barks!"
console.log(dog.eat());    // "Rex is eating" — inherited
console.log(dog.fetch());  // "Rex fetches the ball" — new
```

## The super Keyword

The `super` keyword is used to call functions on an object's parent.

### Calling Parent Constructor

```javascript
class Vehicle {
  constructor(speed) {
    this.speed = speed;
  }
}

class Car extends Vehicle {
  constructor(speed, brand) {
    super(speed);  // Must call super before using this
    this.brand = brand;
  }
}

const car = new Car(60, 'Toyota');
```

**Important:** You must call `super()` in the subclass constructor before using `this`.

### Calling Parent Methods

```javascript
class Vehicle {
  move() {
    return `Moving at ${this.speed} km/h`;
  }
}

class Car extends Vehicle {
  move() {
    const baseMove = super.move();  // Call parent method
    return `${baseMove} on wheels`;
  }
}

const car = new Car(60);
console.log(car.move());  // "Moving at 60 km/h on wheels"
```

## Method Overriding

Subclasses can override parent methods:

```javascript
class Shape {
  area() {
    return 0;
  }

  describe() {
    return 'This is a shape';
  }
}

class Circle extends Shape {
  constructor(radius) {
    super();
    this.radius = radius;
  }

  // Override area
  area() {
    return Math.PI * this.radius ** 2;
  }

  // Override describe
  describe() {
    return `This is a circle with radius ${this.radius}`;
  }
}

const circle = new Circle(5);
console.log(circle.area());      // 78.5398...
console.log(circle.describe());  // "This is a circle with radius 5"
```

## Multi-Level Inheritance

You can chain inheritance through multiple levels:

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    return `${this.name} makes a sound`;
  }
}

class Mammal extends Animal {
  constructor(name, furColor) {
    super(name);
    this.furColor = furColor;
  }

  giveBirth() {
    return `${this.name} gives birth to live young`;
  }
}

class Dog extends Mammal {
  constructor(name, furColor, breed) {
    super(name, furColor);
    this.breed = breed;
  }

  speak() {
    return `${this.name} barks`;
  }
}

const dog = new Dog('Rex', 'brown', 'German Shepherd');
console.log(dog.speak());       // "Rex barks" — overridden
console.log(dog.giveBirth());   // "Rex gives birth to live young" — from Mammal
console.log(dog.name);          // "Rex" — from Animal
```

## Inheriting Static Members

Static methods and properties are also inherited:

```javascript
class Parent {
  static staticMethod() {
    return 'Parent static method';
  }

  static staticProp = 'Parent prop';
}

class Child extends Parent {
  static staticMethod() {
    return super.staticMethod() + ' (child version)';
  }
}

console.log(Child.staticMethod());  // "Parent static method (child version)"
console.log(Child.staticProp);      // "Parent prop"
```

## instanceof Operator

The `instanceof` operator checks if an object is an instance of a class:

```javascript
class Animal {}
class Dog extends Animal {}

const dog = new Dog();

console.log(dog instanceof Dog);     // true
console.log(dog instanceof Animal);  // true
console.log(dog instanceof Object);  // true
```

## Object.getPrototypeOf()

You can get the prototype of an object:

```javascript
class Parent {}
class Child extends Parent {}

const child = new Child();

console.log(Object.getPrototypeOf(child) === Child.prototype);  // true
console.log(Object.getPrototypeOf(Child.prototype) === Parent.prototype);  // true
```

## extends with Built-in Objects

You can extend built-in objects like Array, Map, etc.:

```javascript
class Stack extends Array {
  push(item) {
    super.push(item);
    console.log(`Pushed: ${item}`);
  }

  pop() {
    const item = super.pop();
    console.log(`Popped: ${item}`);
    return item;
  }
}

const stack = new Stack();
stack.push(1);  // "Pushed: 1"
stack.push(2);  // "Pushed: 2"
stack.pop();    // "Popped: 2"
```

## Mixin Pattern (Multiple Inheritance)

JavaScript doesn't support multiple inheritance, but you can use mixins:

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

## Composition vs Inheritance

Sometimes composition is better than inheritance:

```javascript
// Inheritance (can get messy)
class FlyingCar extends Car {
  fly() {
    return 'Flying...';
  }
}

class SwimmingCar extends Car {
  swim() {
    return 'Swimming...';
  }
}

// Composition (more flexible)
class Car {
  constructor(engine) {
    this.engine = engine;
  }
}

class FlyingEngine {
  fly() {
    return 'Flying...';
  }
}

class SwimmingEngine {
  swim() {
    return 'Swimming...';
  }
}

const flyingCar = new Car(new FlyingEngine());
const swimmingCar = new Car(new SwimmingEngine());
```

## Best Practices

1. **Favor composition over inheritance** — use inheritance only when there's a clear "is-a" relationship
2. **Keep inheritance hierarchies shallow** — deep hierarchies are hard to maintain
3. **Use `super` correctly** — always call parent constructor before using `this`
4. **Override methods carefully** — maintain the contract of the parent method
5. **Document inheritance relationships** — make the hierarchy clear
6. **Don't inherit just to reuse code** — use composition or utility functions instead

## Common Patterns

### Template Method Pattern

```javascript
class DataProcessor {
  process(data) {
    this.validate(data);
    const transformed = this.transform(data);
    return this.save(transformed);
  }

  validate(data) {
    throw new Error('Must implement validate()');
  }

  transform(data) {
    throw new Error('Must implement transform()');
  }

  save(data) {
    throw new Error('Must implement save()');
  }
}

class UserProcessor extends DataProcessor {
  validate(data) {
    if (!data.name) throw new Error('Name required');
  }

  transform(data) {
    return { ...data, processed: true };
  }

  save(data) {
    console.log('Saving to database:', data);
  }
}
```

### Abstract Base Class

```javascript
class Shape {
  constructor() {
    if (this.constructor === Shape) {
      throw new Error('Abstract class cannot be instantiated');
    }
  }

  area() {
    throw new Error('Must implement area()');
  }

  perimeter() {
    throw new Error('Must implement perimeter()');
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

  perimeter() {
    return 2 * Math.PI * this.radius;
  }
}
```
