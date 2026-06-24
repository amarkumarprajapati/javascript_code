# TypeScript — Generics & Utility Types

> Features JavaScript doesn't have — write reusable, type-safe code.

---

## Generics

Write functions, classes, and interfaces that work with **multiple types** while keeping type safety.

### Generic Functions

```ts
// Without generics — loses type info
function identity(value: any): any {
  return value;
}

// With generics — preserves type
function identity<T>(value: T): T {
  return value;
}

const num = identity(42);       // T = number
const str = identity("hello");  // T = string
const user = identity({ id: 1 }); // T = { id: number }
```

### Generic Interfaces

```ts
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: "John", email: "j@test.com" },
  status: 200,
  message: "OK",
};

const productList: Paginated<Product> = {
  items: [],
  total: 0,
  page: 1,
};
```

### Generic Constraints

Limit what type `T` can be.

```ts
interface HasLength {
  length: number;
}

function logLength<T extends HasLength>(value: T): T {
  console.log(value.length);
  return value;
}

logLength("hello");  // ✅ string has length
logLength([1, 2, 3]); // ✅ array has length
logLength(42);       // ❌ number has no length

// Constrain to object keys
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { id: 1, name: "John" };
getProperty(user, "name");  // ✅ returns string
getProperty(user, "age");   // ❌ 'age' doesn't exist
```

### Multiple Type Parameters

```ts
function pair<T, U>(first: T, second: U): [T, U] {
  return [first, second];
}

function merge<T extends object, U extends object>(a: T, b: U): T & U {
  return { ...a, ...b };
}
```

### Generic Classes

```ts
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);

const strStack = new Stack<string>();
strStack.push("hello");
```

### Generic Defaults

```ts
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
}

const response: ApiResponse = { data: anything, status: 200 };
const typed: ApiResponse<User> = { data: user, status: 200 };
```

---

## Utility Types

Built-in types that **transform** existing types — not available in JavaScript.

### Partial\<T\>

Make all properties optional.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string }

function updateUser(id: number, changes: Partial<User>) {
  // apply partial update
}
```

### Required\<T\>

Make all properties required (opposite of Partial).

```ts
interface Config {
  host?: string;
  port?: number;
}

type RequiredConfig = Required<Config>;
// { host: string; port: number }
```

### Readonly\<T\>

Make all properties readonly.

```ts
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; ... }
```

### Pick\<T, Keys\>

Select specific properties.

```ts
type UserPreview = Pick<User, "id" | "name">;
// { id: number; name: string }
```

### Omit\<T, Keys\>

Remove specific properties.

```ts
type CreateUserDto = Omit<User, "id">;
// { name: string; email: string }

type PublicUser = Omit<User, "password" | "token">;
```

### Record\<Keys, Type\>

Object with specific key and value types.

```ts
type Role = "admin" | "user" | "guest";
type Permissions = Record<Role, string[]>;

const perms: Permissions = {
  admin: ["read", "write", "delete"],
  user: ["read"],
  guest: [],
};

type StringMap = Record<string, number>;
```

### Exclude\<T, U\>

Remove types from union.

```ts
type T = "a" | "b" | "c";
type U = Exclude<T, "a">;  // "b" | "c"
```

### Extract\<T, U\>

Keep only matching types from union.

```ts
type T = "a" | "b" | "c";
type U = Extract<T, "a" | "f">;  // "a"
```

### NonNullable\<T\>

Remove null and undefined.

```ts
type T = string | null | undefined;
type U = NonNullable<T>;  // string
```

### ReturnType\<T\>

Extract function return type.

```ts
function getUser() {
  return { id: 1, name: "John" };
}

type User = ReturnType<typeof getUser>;
// { id: number; name: string }
```

### Parameters\<T\>

Extract function parameter types as tuple.

```ts
function create(name: string, age: number) { }
type Params = Parameters<typeof create>;  // [string, number]
```

### Awaited\<T\>

Unwrap Promise type.

```ts
type T = Awaited<Promise<string>>;  // string
type U = Awaited<Promise<Promise<number>>>;  // number
```

---

## Mapped Types

Create new types by transforming properties of existing types.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

// Make all properties optional
type PartialUser = {
  [K in keyof User]?: User[K];
};

// Make all properties readonly
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};

// Make all properties nullable
type NullableUser = {
  [K in keyof User]: User[K] | null;
};

// Transform property types
type StringifiedUser = {
  [K in keyof User]: string;
};
```

### Custom Mapped Type with Modifier

```ts
type Mutable<T> = {
  -readonly [K in keyof T]: T[K];  // remove readonly
};

type Concrete<T> = {
  [K in keyof T]-?: T[K];  // remove optional
};
```

---

## Conditional Types

Types that depend on a condition — `T extends U ? X : Y`.

```ts
type IsString<T> = T extends string ? true : false;

type A = IsString<string>;  // true
type B = IsString<number>;  // false

// Extract array element type
type ElementType<T> = T extends (infer U)[] ? U : T;

type Item = ElementType<string[]>;  // string
type Num = ElementType<number>;     // number

// Flatten array type
type Flatten<T> = T extends Array<infer U> ? U : T;
```

### infer Keyword

Extract type from within another type.

```ts
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

type FuncReturn = ReturnType<() => string>;  // string
```

---

## Template Literal Types

Combine string literal types — TS 4.1+.

```ts
type EventName = "click" | "focus" | "blur";
type EventHandler = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

type HTTPMethod = "GET" | "POST" | "PUT" | "DELETE";
type Endpoint = `/api/${string}`;
type Route = `${HTTPMethod} ${Endpoint}`;
```

---

## Discriminated Unions

Union types with a common **discriminant** field for type narrowing.

```ts
type ApiState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: T }
  | { status: "error"; error: string };

function render<T>(state: ApiState<T>) {
  switch (state.status) {
    case "idle":
      return "Ready";
    case "loading":
      return "Loading...";
    case "success":
      return state.data;   // TS knows data exists
    case "error":
      return state.error;  // TS knows error exists
  }
}
```

Eliminates impossible states — can't have `success` without `data`.

---

## as const

Freeze values to **literal types** instead of widening.

```ts
// Without as const — widened to string
const routes = { home: "/", about: "/about" };
type Route = typeof routes.home;  // string

// With as const — exact literals
const routes = {
  home: "/",
  about: "/about",
} as const;

type Route = typeof routes[keyof typeof routes];  // "/" | "/about"

// Readonly tuple
const colors = ["red", "green", "blue"] as const;
type Color = typeof colors[number];  // "red" | "green" | "blue"
```

---

## Type Guards

Custom functions that narrow types — runtime check + compile-time narrowing.

```ts
interface Fish { swim: () => void }
interface Bird { fly: () => void }

function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim();  // TS knows: Fish
  } else {
    pet.fly();   // TS knows: Bird
  }
}

// typeof / instanceof guards
function process(value: unknown) {
  if (typeof value === "string") return value.toUpperCase();
  if (value instanceof Date) return value.toISOString();
}
```

---

## satisfies Operator

Validate type without widening — TS 4.9+.

```ts
type Color = "red" | "green" | "blue";

// as — widens to Color
const a = "red" as Color;

// satisfies — keeps literal, validates shape
const palette = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
} satisfies Record<Color, string>;

palette.red;  // TS knows exact keys
```

---

## keyof Operator

Get union of object keys as type.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKey = keyof User;  // "id" | "name" | "email"

function getValue<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

---

## Quick Reference

```
Generics           → identity<T>, ApiResponse<T>, Stack<T>
extends constraint → T extends HasLength
keyof              → union of object keys
Partial<T>         → all optional
Required<T>        → all required
Readonly<T>        → all readonly
Pick<T, K>         → select keys
Omit<T, K>         → remove keys
Record<K, V>       → typed object map
ReturnType<F>      → function return type
Parameters<F>      → function param types
Mapped types       → [K in keyof T]
Conditional types  → T extends U ? X : Y
infer              → extract type from within
Discriminated union → status field for narrowing
as const           → literal types, readonly
satisfies          → validate without widening
Type guard         → pet is Fish
```
