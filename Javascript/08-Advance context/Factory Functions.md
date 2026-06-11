# Factory Functions

## What is a Factory Function?

A **Factory Function** is a function that returns a new object. Unlike constructor functions or classes, it does not require the `new` keyword and provides a clean way to create multiple similar objects.

## Basic Example

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    greet() {
      console.log(`Hi, I'm ${this.name}`);
    }
  };
}

const person1 = createPerson("Alice", 30);
const person2 = createPerson("Bob", 25);

person1.greet(); // Hi, I'm Alice
person2.greet(); // Hi, I'm Bob
```

## Factory Functions vs Constructor Functions

| Feature             | Factory Function         | Constructor Function     |
|---------------------|--------------------------|--------------------------|
| Invocation          | Regular call             | Requires `new`           |
| `this` binding      | Not used (usually)       | Points to new instance   |
| Return value        | Explicitly returns object| Implicitly returns `this`  |
| Prototype setup     | Manual (if needed)       | Automatic via prototype  |

## Factory Function with Closures (Private State)

```javascript
function createCounter() {
  let count = 0; // private variable

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
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.count);       // undefined (private)
```

## Factory with Object Composition

```javascript
const canEat = {
  eat() {
    console.log(`${this.name} is eating.`);
  }
};

const canWalk = {
  walk() {
    console.log(`${this.name} is walking.`);
  }
};

function createHuman(name) {
  return Object.assign(
    { name },
    canEat,
    canWalk
  );
}

const human = createHuman("Alice");
human.eat();  // Alice is eating.
human.walk(); // Alice is walking.
```

## Factory Function with Prototypes

```javascript
const animalPrototype = {
  speak() {
    console.log(`${this.name} makes a sound.`);
  }
};

function createAnimal(name) {
  return Object.create(animalPrototype, {
    name: { value: name, writable: true, enumerable: true }
  });
}

const dog = createAnimal("Dog");
dog.speak(); // Dog makes a sound.
```

## Advantages of Factory Functions

1. **No `new` keyword** — less error-prone, simpler syntax
2. **Encapsulation** — easy to create private variables via closures
3. **Composition** — easier to mix behaviors without inheritance chains
4. **Flexibility** — can return different object types conditionally

## When to Use

- When you need **private data** (closures)
- When you prefer **composition over inheritance**
- When returning objects conditionally
- When you want to avoid `this` binding issues

## Common Interview Questions

1. **What is a factory function?**
   - A function that returns a new object instance.

2. **How do factory functions provide encapsulation?**
   - By using closures to keep variables private.

3. **Factory vs Constructor: which to use and when?**
   - Use factories for flexibility, private state, and composition.
   - Use constructors/classes when working in class-heavy ecosystems or when prototype inheritance is needed.
