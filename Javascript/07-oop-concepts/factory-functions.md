# Factory Functions in JavaScript

> 📅 **Concept** · ~5 min read · creating objects without classes or new

## Definition

Factory functions are functions that return objects. They provide an alternative to classes and the `new` keyword for creating objects. Factory functions don't use `this`, which eliminates common confusion about context binding.

Factory functions offer:
- **No `this` confusion** — No need to worry about context binding
- **True privacy** — Closures provide private variables
- **Flexibility** — Can return different object types
- **Simplicity** — No need for `new` or class syntax

## Basic Factory Function

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

console.log(user1.greet());  // "Hi, I'm Alice"
console.log(user2.greet());  // "Hi, I'm Bob"
```

## Factory Functions with Private State

Closures enable true privacy:

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

## Factory Functions with Methods

```javascript
function createRectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return this.width * this.height;
    },
    getPerimeter() {
      return 2 * (this.width + this.height);
    },
    scale(factor) {
      this.width *= factor;
      this.height *= factor;
    }
  };
}

const rect = createRectangle(5, 10);
console.log(rect.getArea());        // 50
console.log(rect.getPerimeter());   // 30
rect.scale(2);
console.log(rect.getArea());        // 200
```

## Factory Functions with Shared Methods

Methods are recreated for each instance by default. To share methods, use an external object:

```javascript
const userMethods = {
  greet() {
    return `Hi, I'm ${this.name}`;
  },
  getEmail() {
    return this.email;
  }
};

function createUser(name, email) {
  return Object.assign({}, userMethods, { name, email });
}

const user1 = createUser('Alice', 'alice@example.com');
const user2 = createUser('Bob', 'bob@example.com');

console.log(user1.greet === user2.greet);  // false — still separate
```

Better approach with `Object.create()`:

```javascript
const userPrototype = {
  greet() {
    return `Hi, I'm ${this.name}`;
  }
};

function createUser(name, email) {
  const user = Object.create(userPrototype);
  user.name = name;
  user.email = email;
  return user;
}

const user1 = createUser('Alice', 'alice@example.com');
const user2 = createUser('Bob', 'bob@example.com');

console.log(user1.greet === user2.greet);  // true — shared!
```

## Factory Functions with Composition

Combine multiple factory functions:

```javascript
function withName(name) {
  return {
    getName() {
      return name;
    },
    setName(newName) {
      name = newName;
    }
  };
}

function withAge(age) {
  return {
    getAge() {
      return age;
    },
    setAge(newAge) {
      age = newAge;
    }
  };
}

function createPerson(name, age) {
  return {
    ...withName(name),
    ...withAge(age)
  };
}

const person = createPerson('Alice', 30);
console.log(person.getName());  // "Alice"
console.log(person.getAge());   // 30
```

## Factory Functions for Different Types

```javascript
function createShape(type, ...args) {
  switch (type) {
    case 'circle':
      return createCircle(...args);
    case 'rectangle':
      return createRectangle(...args);
    case 'triangle':
      return createTriangle(...args);
    default:
      throw new Error('Unknown shape type');
  }
}

function createCircle(radius) {
  return {
    type: 'circle',
    radius,
    getArea() {
      return Math.PI * this.radius ** 2;
    }
  };
}

function createRectangle(width, height) {
  return {
    type: 'rectangle',
    width,
    height,
    getArea() {
      return this.width * this.height;
    }
  };
}

function createTriangle(base, height) {
  return {
    type: 'triangle',
    base,
    height,
    getArea() {
      return 0.5 * this.base * this.height;
    }
  };
}

const circle = createShape('circle', 5);
const rectangle = createShape('rectangle', 4, 6);
const triangle = createShape('triangle', 3, 4);

console.log(circle.getArea());      // 78.5398...
console.log(rectangle.getArea());   // 24
console.log(triangle.getArea());    // 6
```

## Factory Functions with Validation

```javascript
function createUser(name, email, age) {
  if (!name || name.length < 2) {
    throw new Error('Name must be at least 2 characters');
  }

  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }

  if (age < 0 || age > 150) {
    throw new Error('Invalid age');
  }

  return {
    name,
    email,
    age,
    toJSON() {
      return { name: this.name, email: this.email, age: this.age };
    }
  };
}

const user = createUser('Alice', 'alice@example.com', 30);
console.log(user.toJSON());
```

## Factory Functions with Default Values

```javascript
function createUser(options = {}) {
  const {
    name = 'Anonymous',
    email = 'no-email@example.com',
    age = 0,
    isAdmin = false
  } = options;

  return {
    name,
    email,
    age,
    isAdmin,
    isAdult() {
      return this.age >= 18;
    }
  };
}

const user1 = createUser();
const user2 = createUser({ name: 'Alice', age: 25 });

console.log(user1.name);       // "Anonymous"
console.log(user2.name);       // "Alice"
console.log(user2.isAdult());  // true
```

## Factory Functions vs Classes

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

const user = new User('Alice', 'alice@example.com');
```

**Pros:**
- Methods shared via prototype (memory efficient)
- `instanceof` works
- Familiar to developers from other languages
- Better tooling support

**Cons:**
- `this` can be confusing
- Harder to create truly private members (before #)
- Requires `new` keyword

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

const user = createUser('Alice', 'alice@example.com');
```

**Pros:**
- No `this` confusion
- Private variables via closures
- No need for `new`
- More flexible
- Simpler syntax

**Cons:**
- No `instanceof` check
- Methods recreated for each instance (unless shared via prototype)
- Less familiar to some developers

## When to Use Factory Functions

1. **Need true privacy** — Closures provide better privacy than classes
2. **Simple objects** — When you don't need inheritance
3. **Avoid `this` confusion** — When context binding is problematic
4. **Flexible object creation** — When you need to return different types
5. **Functional programming** — When preferring functional over OOP

## When to Use Classes

1. **Need inheritance** — Classes have better inheritance support
2. **Performance critical** — Shared prototype methods are more efficient
3. **Type checking** — Need `instanceof` checks
4. **Team familiarity** — Team prefers class-based OOP
5. **Framework requirements** — Some frameworks expect classes

## Common Patterns

### Singleton Factory

```javascript
function createDatabaseConnection() {
  let instance = null;

  return {
    getInstance(config) {
      if (!instance) {
        instance = {
          config,
          connected: true,
          query(sql) {
            console.log(`Executing: ${sql}`);
          }
        };
      }
      return instance;
    }
  };
}

const dbFactory = createDatabaseConnection();
const db1 = dbFactory.getInstance({ host: 'localhost' });
const db2 = dbFactory.getInstance({ host: 'localhost' });

console.log(db1 === db2);  // true — same instance
```

### Caching Factory

```javascript
function createUserFactory() {
  const cache = new Map();

  return {
    create(id, name, email) {
      if (cache.has(id)) {
        return cache.get(id);
      }

      const user = { id, name, email };
      cache.set(id, user);
      return user;
    },
    getCacheSize() {
      return cache.size;
    }
  };
}

const userFactory = createUserFactory();
const user1 = userFactory.create(1, 'Alice', 'alice@example.com');
const user2 = userFactory.create(1, 'Alice', 'alice@example.com');

console.log(user1 === user2);  // true — cached
```

### Builder Factory

```javascript
function createUserBuilder() {
  let name = '';
  let email = '';
  let age = 0;

  return {
    setName(value) {
      name = value;
      return this;
    },
    setEmail(value) {
      email = value;
      return this;
    },
    setAge(value) {
      age = value;
      return this;
    },
    build() {
      return { name, email, age };
    }
  };
}

const user = createUserBuilder()
  .setName('Alice')
  .setEmail('alice@example.com')
  .setAge(30)
  .build();

console.log(user);  // { name: 'Alice', email: 'alice@example.com', age: 30 }
```

## Best Practices

1. **Use descriptive names** — `createX` or `makeX` pattern
2. **Return plain objects** — Unless you need prototype chains
3. **Use closures for privacy** — Hide internal state
4. **Validate inputs** — Ensure data integrity
5. **Provide defaults** — Make functions flexible
6. **Document the API** — Explain what the factory creates
7. **Consider immutability** — Return frozen objects when appropriate
