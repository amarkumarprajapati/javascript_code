# Mixins in JavaScript

> 📅 **Concept** · ~5 min read · composing functionality without inheritance

## Definition

Mixins are a way to add functionality to classes or objects without using inheritance. They allow you to compose classes from multiple sources of behavior, solving the problem that JavaScript doesn't support multiple inheritance.

Mixins provide:
- **Code reuse** — Share functionality across unrelated classes
- **Composition over inheritance** — Build classes from smaller pieces
- **Flexibility** — Add or remove functionality dynamically
- **Avoid deep inheritance** — Prevent complex inheritance hierarchies

## Basic Mixin with Object.assign()

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

## Mixin Functions

Create reusable mixin functions:

```javascript
function Loggable(Base) {
  return class extends Base {
    log(message) {
      console.log(`[${this.constructor.name}] ${message}`);
    }
  };
}

function Timestamped(Base) {
  return class extends Base {
    constructor(...args) {
      super(...args);
      this.createdAt = new Date();
    }

    getAge() {
      return Date.now() - this.createdAt.getTime();
    }
  };
}

class User {
  constructor(name) {
    this.name = name;
  }
}

// Compose with mixins
const TimestampedUser = Timestamped(User);
const LoggableTimestampedUser = Loggable(TimestampedUser);

const user = new LoggableTimestampedUser('Alice');
user.log('User created');
console.log(user.getAge());
```

## Multiple Mixin Composition

```javascript
const Flyable = {
  fly() {
    return `${this.name} is flying`;
  }
};

const Swimmable = {
  swim() {
    return `${this.name} is swimming`;
  }
};

const Walkable = {
  walk() {
    return `${this.name} is walking`;
  }
};

class Duck {
  constructor(name) {
    this.name = name;
  }
}

Object.assign(Duck.prototype, Flyable, Swimmable, Walkable);

const duck = new Duck('Donald');
console.log(duck.fly());    // "Donald is flying"
console.log(duck.swim());   // "Donald is swimming"
console.log(duck.walk());   // "Donald is walking"
```

## Mixin with State

```javascript
function EventEmitter(Base) {
  return class extends Base {
    constructor(...args) {
      super(...args);
      this._events = {};
    }

    on(event, callback) {
      if (!this._events[event]) {
        this._events[event] = [];
      }
      this._events[event].push(callback);
    }

    emit(event, data) {
      if (this._events[event]) {
        this._events[event].forEach(callback => callback(data));
      }
    }

    off(event, callback) {
      if (this._events[event]) {
        this._events[event] = this._events[event].filter(cb => cb !== callback);
      }
    }
  };
}

class User {
  constructor(name) {
    this.name = name;
  }
}

const ObservableUser = EventEmitter(User);

const user = new ObservableUser('Alice');
user.on('login', () => console.log('User logged in'));
user.emit('login');  // "User logged in"
```

## Mixin for Validation

```javascript
const Validatable = {
  validate() {
    const errors = [];
    if (this.validateName) {
      const nameError = this.validateName();
      if (nameError) errors.push(nameError);
    }
    if (this.validateEmail) {
      const emailError = this.validateEmail();
      if (emailError) errors.push(emailError);
    }
    return errors;
  }
};

class User {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  validateName() {
    if (!this.name || this.name.length < 2) {
      return 'Name must be at least 2 characters';
    }
  }

  validateEmail() {
    if (!this.email || !this.email.includes('@')) {
      return 'Invalid email';
    }
  }
}

Object.assign(User.prototype, Validatable);

const user = new User('A', 'invalid-email');
console.log(user.validate());  // ['Name must be at least 2 characters', 'Invalid email']
```

## Mixin for Serialization

```javascript
const Serializable = {
  toJSON() {
    const obj = {};
    for (const key in this) {
      if (!key.startsWith('_')) {
        obj[key] = this[key];
      }
    }
    return obj;
  },

  fromJSON(json) {
    Object.assign(this, json);
    return this;
  }
};

class User {
  constructor(name, email) {
    this.name = name;
    this._password = 'secret';  // Private-ish
  }
}

Object.assign(User.prototype, Serializable);

const user = new User('Alice', 'alice@example.com');
const json = user.toJSON();
console.log(json);  // { name: 'Alice', email: 'alice@example.com' } — no _password
```

## Functional Mixins

```javascript
function withFlying(Base) {
  return class extends Base {
    fly() {
      console.log(`${this.name} is flying`);
    }
  };
}

function withSwimming(Base) {
  return class extends Base {
    swim() {
      console.log(`${this.name} is swimming`);
    }
  };
}

function withWalking(Base) {
  return class extends Base {
    walk() {
      console.log(`${this.name} is walking`);
    }
  };
}

class Animal {
  constructor(name) {
    this.name = name;
  }
}

// Compose mixins
const SuperAnimal = withWalking(withSwimming(withFlying(Animal)));

const animal = new SuperAnimal('Super Creature');
animal.fly();
animal.swim();
animal.walk();
```

## Mixin Pattern for Multiple Inheritance

```javascript
function mix(...mixins) {
  return function(Base) {
    return mixins.reduce((acc, mixin) => mixin(acc), Base);
  };
}

const Flyable = (Base) => class extends Base {
  fly() {
    return `${this.name} is flying`;
  }
};

const Swimmable = (Base) => class extends Base {
  swim() {
    return `${this.name} is swimming`;
  }
};

const Walkable = (Base) => class extends Base {
  walk() {
    return `${this.name} is walking`;
  }
};

class Creature {
  constructor(name) {
    this.name = name;
  }
}

const AllCapableCreature = mix(Flyable, Swimmable, Walkable)(Creature);

const creature = new AllCapableCreature('Amphibian');
console.log(creature.fly());
console.log(creature.swim());
console.log(creature.walk());
```

## Mixin with Private Fields

```javascript
const Identifiable = (Base) => class extends Base {
  #id;

  constructor(...args) {
    super(...args);
    this.#id = crypto.randomUUID();
  }

  getId() {
    return this.#id;
  }
};

class User {
  constructor(name) {
    this.name = name;
  }
}

const IdentifiableUser = Identifiable(User);

const user = new IdentifiableUser('Alice');
console.log(user.getId());  // Unique ID
console.log(user.#id);      // SyntaxError — private
```

## Real-World Example: API Resource

```javascript
const Timestamped = (Base) => class extends Base {
  constructor(...args) {
    super(...args);
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  touch() {
    this.updatedAt = new Date();
  }
};

const Validatable = (Base) => class extends Base {
  validate() {
    return true; // Override in subclasses
  }
};

const Serializable = (Base) => class extends Base {
  toJSON() {
    const { createdAt, updatedAt, ...rest } = this;
    return {
      ...rest,
      createdAt: createdAt.toISOString(),
      updatedAt: updatedAt.toISOString()
    };
  }
};

class Resource {
  constructor(id) {
    this.id = id;
  }
}

const APIResource = mix(Timestamped, Validatable, Serializable)(Resource);

class User extends APIResource {
  constructor(id, name, email) {
    super(id);
    this.name = name;
    this.email = email;
  }

  validate() {
    return this.name.length >= 2 && this.email.includes('@');
  }
}

const user = new User(1, 'Alice', 'alice@example.com');
console.log(user.validate());  // true
console.log(user.toJSON());
```

## Mixin vs Inheritance

### Inheritance
```javascript
class Animal { }
class Dog extends Animal { }
class FlyingDog extends Dog { }  // Can only extend one class
```

### Mixins
```javascript
class Animal { }
const Flying = (Base) => class extends Base { fly() { } };
const Swimmable = (Base) => class extends Base { swim() { } };

const FlyingSwimmingAnimal = Swimmable(Flying(Animal));  // Multiple capabilities
```

## Benefits of Mixins

1. **Multiple inheritance** — Add functionality from multiple sources
2. **Composition over inheritance** — Build classes from smaller pieces
3. **Reusability** — Share functionality across unrelated classes
4. **Flexibility** — Add or remove functionality dynamically
5. **Flat hierarchy** — Avoid deep inheritance trees

## Drawbacks of Mixins

1. **Name collisions** — Multiple mixins might have same method names
2. **Complexity** — Can be hard to track where methods come from
3. **Initialization order** — Mixin constructors must call super correctly
4. **Tooling support** — Some tools don't understand mixins well

## Best Practices

1. **Keep mixins small** — Each mixin should do one thing
2. **Use descriptive names** — Make it clear what the mixin does
3. **Avoid state conflicts** — Be careful with shared properties
4. **Document dependencies** — What does the mixin expect from the base class?
5. **Prefer composition** — Use mixins when inheritance doesn't fit
6. **Test thoroughly** — Mixin interactions can be complex

## Common Patterns

### Capability Mixins

```javascript
const Sortable = {
  sort(field) {
    this.items.sort((a, b) => a[field] > b[field] ? 1 : -1);
  }
};

const Filterable = {
  filter(predicate) {
    return this.items.filter(predicate);
  }
};

class Collection {
  constructor(items) {
    this.items = items;
  }
}

Object.assign(Collection.prototype, Sortable, Filterable);

const collection = new Collection([
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
]);

collection.sort('age');
console.log(collection.items);  // Sorted by age
```

### Feature Detection Mixin

```javascript
const Responsive = {
  isMobile() {
    return window.innerWidth < 768;
  },

  isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  },

  isDesktop() {
    return window.innerWidth >= 1024;
  }
};

class Component {
  render() {
    if (this.isMobile()) {
      return this.renderMobile();
    }
    return this.renderDesktop();
  }
}

Object.assign(Component.prototype, Responsive);
```
