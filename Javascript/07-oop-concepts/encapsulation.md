# Encapsulation in JavaScript

> 📅 **Concept** · ~5 min read · hiding internal state and exposing API

## Definition

Encapsulation is the practice of bundling data (properties) and methods (functions) that operate on that data into a single unit (object), while hiding internal details and exposing only what's necessary through a public interface.

Encapsulation provides:
- **Data hiding** — internal state is protected from external access
- **Controlled access** — data is accessed through methods, allowing validation
- **Modularity** — changes to internal implementation don't affect external code
- **Reduced complexity** — users only need to know the public API

## Encapsulation with Closures (Factory Pattern)

Before private fields, closures were the primary way to achieve true encapsulation:

```javascript
function createCounter() {
  let count = 0;  // Private variable — accessible only within this scope

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
console.log(counter.count);        // undefined — truly private!
```

### More Complex Example

```javascript
function createUser(name, email) {
  let _name = name;
  let _email = email;

  return {
    getName() {
      return _name;
    },
    setName(newName) {
      if (newName.length < 2) {
        throw new Error('Name must be at least 2 characters');
      }
      _name = newName;
    },
    getEmail() {
      return _email;
    },
    setEmail(newEmail) {
      if (!newEmail.includes('@')) {
        throw new Error('Invalid email');
      }
      _email = newEmail;
    },
    toJSON() {
      return { name: _name, email: _email };
    }
  };
}

const user = createUser('Alice', 'alice@example.com');
console.log(user.getName());  // "Alice"
user.setName('Bob');
console.log(user.getName());  // "Bob"
console.log(user._name);     // undefined — private
```

## Encapsulation with Classes (Private Fields #)

ES2022 introduced private class fields using the `#` prefix:

```javascript
class BankAccount {
  #balance;  // Private field
  #accountNumber;
  #transactionHistory = [];

  constructor(accountNumber, initialBalance) {
    this.#accountNumber = accountNumber;
    this.#balance = initialBalance;
  }

  deposit(amount) {
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance += amount;
    this.#transactionHistory.push({ type: 'deposit', amount, date: new Date() });
  }

  withdraw(amount) {
    if (amount > this.#balance) throw new Error('Insufficient funds');
    if (amount <= 0) throw new Error('Amount must be positive');
    this.#balance -= amount;
    this.#transactionHistory.push({ type: 'withdrawal', amount, date: new Date() });
  }

  getBalance() {
    return this.#balance;
  }

  getAccountNumber() {
    return this.#accountNumber;
  }

  getTransactionHistory() {
    return [...this.#transactionHistory];  // Return copy, not reference
  }
}

const account = new BankAccount('12345', 100);
account.deposit(50);
console.log(account.getBalance());  // 150
console.log(account.#balance);       // SyntaxError — private!
```

### Private Methods

```javascript
class Auth {
  #apiKey = 'secret-key';

  #hashPassword(password) {
    // Simulated hashing
    return btoa(password);
  }

  #validateToken(token) {
    return token.length > 10;
  }

  login(username, password) {
    const hashed = this.#hashPassword(password);
    return { username, token: hashed };
  }

  authenticate(token) {
    if (!this.#validateToken(token)) {
      throw new Error('Invalid token');
    }
    return true;
  }
}

const auth = new Auth();
console.log(auth.login('alice', 'secret'));  // Works
console.log(auth.#hashPassword('test'));     // SyntaxError
```

## Encapsulation with Convention (_prefix)

Before private fields, developers used underscore prefix to indicate "private" properties (by convention only):

```javascript
class User {
  constructor(name, email) {
    this._name = name;      // "Private" by convention
    this._email = email;
  }

  getName() {
    return this._name;
  }

  setName(name) {
    this._name = name;
  }
}

const user = new User('Alice', 'alice@example.com');
console.log(user._name);  // "Alice" — accessible, but shouldn't be used
```

**Limitation:** This is just a convention — the properties are still publicly accessible.

## Encapsulation with WeakMap

Another pattern for true privacy using WeakMap:

```javascript
const privateData = new WeakMap();

class User {
  constructor(name, email) {
    privateData.set(this, { name, email });
  }

  getName() {
    return privateData.get(this).name;
  }

  setName(name) {
    privateData.get(this).name = name;
  }
}

const user = new User('Alice', 'alice@example.com');
console.log(user.getName());  // "Alice"
console.log(user.name);       // undefined
```

## Getters and Setters

Control access to properties with validation:

```javascript
class Temperature {
  constructor(celsius) {
    this._celsius = celsius;
  }

  get celsius() {
    return this._celsius;
  }

  set celsius(value) {
    if (value < -273.15) {
      throw new Error('Temperature below absolute zero');
    }
    this._celsius = value;
  }

  get fahrenheit() {
    return (this._celsius * 9/5) + 32;
  }

  set fahrenheit(value) {
    this._celsius = (value - 32) * 5/9;
  }
}

const temp = new Temperature(25);
console.log(temp.celsius);     // 25
console.log(temp.fahrenheit);  // 77

temp.fahrenheit = 100;
console.log(temp.celsius);     // 37.777...

temp.celsius = -300;  // Error: Temperature below absolute zero
```

## Module Pattern (IIFE)

Using IIFE for encapsulation:

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

## Benefits of Encapsulation

1. **Protection** — Prevents external code from directly modifying internal state
2. **Flexibility** — Can change internal implementation without affecting external code
3. **Validation** — Add validation logic in setters
4. **Debugging** — Easier to track where data is modified
5. **Maintainability** — Clear separation between interface and implementation

## When to Use Each Approach

| Approach | Use When |
|----------|----------|
| **Closures** | Simple objects, need true privacy, no class syntax needed |
| **Private Fields (#)** | Using classes, need true privacy, modern JavaScript |
| **Underscore Convention** | Legacy code, need compatibility, privacy not critical |
| **WeakMap** | Need privacy with many instances, memory management important |
| **Getters/Setters** | Need computed properties, validation, or logging on access |

## Best Practices

1. **Make fields private by default** — expose only what's necessary
2. **Use getters/setters for validation** — not just for direct access
3. **Return copies of internal arrays/objects** — prevent external modification
4. **Document the public API** — make it clear what can be used
5. **Keep the interface minimal** — fewer public methods = less complexity
6. **Use meaningful names** — make the purpose of methods clear

## Common Patterns

### Immutable Object

```javascript
function createImmutableUser(name, email) {
  return Object.freeze({
    name,
    email,
    getName() {
      return name;
    }
  });
}

const user = createImmutableUser('Alice', 'alice@example.com');
user.name = 'Bob';  // Fails silently in non-strict mode
```

### Read-Only Properties

```javascript
class Config {
  constructor() {
    this._apiKey = 'secret';
  }

  get apiKey() {
    return this._apiKey;
  }
  // No setter — read-only
}

const config = new Config();
console.log(config.apiKey);  // "secret"
config.apiKey = 'new-key';   // Fails silently
```

### Protected Pattern (Simulated)

```javascript
class Parent {
  constructor() {
    this._protected = 'protected data';
  }

  useProtected() {
    return this._protected;
  }
}

class Child extends Parent {
  constructor() {
    super();
    // Can access _protected (by convention)
    console.log(this._protected);
  }
}
```
