# Generators in JavaScript

## What are Generators?
- Generator functions are a special type of function that can **pause and resume** execution.
- Declared with `function*` syntax.
- They return a **Generator object** that follows the Iterator protocol.
- Useful for lazy evaluation, infinite sequences, and async flow control.

## Basic Syntax
```js
function* myGenerator() {
  yield 1;
  yield 2;
  yield 3;
}

const gen = myGenerator();
console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: false }
console.log(gen.next()); // { value: undefined, done: true }
```

## Key Concepts

### `yield` keyword
- Pauses the generator and returns a value.
- The generator remembers its state and resumes from where it left off.

### `next()` method
- Resumes execution until the next `yield` or return.
- Returns `{ value, done }`.

### Passing values to generator
```js
function* counter() {
  let count = 0;
  while (true) {
    const increment = yield count;
    count += increment || 1;
  }
}

const c = counter();
console.log(c.next().value);     // 0
console.log(c.next(5).value);    // 5
console.log(c.next(3).value);    // 8
```

## Practical Examples

### Infinite ID Generator
```js
function* idGenerator() {
  let id = 1;
  while (true) {
    yield id++;
  }
}

const ids = idGenerator();
console.log(ids.next().value); // 1
console.log(ids.next().value); // 2
```

### Range Generator
```js
function* range(start, end) {
  for (let i = start; i <= end; i++) {
    yield i;
  }
}

for (const num of range(1, 5)) {
  console.log(num); // 1, 2, 3, 4, 5
}
```

## Generator Methods
- `gen.next(value)` - resume with optional value
- `gen.return(value)` - finish generator early
- `gen.throw(error)` - throw an error inside generator

## Use Cases
- Lazy loading of large datasets
- Implementing custom iterables
- Async generators for streaming data (`async function*`)
- State machines
