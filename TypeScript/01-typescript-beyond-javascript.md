# TypeScript — Beyond JavaScript

> TypeScript = JavaScript + **static types**. All valid JS is valid TS. This guide covers only what TypeScript **adds** on top of JavaScript.

---

## JS vs TS — Quick Comparison

| | JavaScript | TypeScript |
| --- | --- | --- |
| Types | Dynamic — runtime only | Static — checked at **compile time** |
| Errors | Found at runtime | Caught before running |
| Tooling | Basic autocomplete | Full IntelliSense, refactor, go-to-definition |
| Output | Runs directly | Compiles to JavaScript |
| Learning | JS concepts first | JS + type system |

```ts
// JavaScript — no type info
function add(a, b) {
  return a + b;
}
add("1", 2); // "12" — bug at runtime

// TypeScript — catches error at compile time
function add(a: number, b: number): number {
  return a + b;
}
add("1", 2); // ❌ Error: Argument of type 'string' is not assignable to type 'number'
```

---

## How TypeScript Works

```
.ts / .tsx files
      ↓
TypeScript Compiler (tsc)
      ↓
Type checking (errors if types wrong)
      ↓
.js files (plain JavaScript output)
      ↓
Browser / Node.js runs JS
```

Types are ** erased at compile time** — they don't exist at runtime. Zero runtime overhead.

---

## Basic Type Annotations

Types JS doesn't have — you annotate variables, parameters, and return values.

```ts
// Primitives
let name: string = "John";
let age: number = 30;
let active: boolean = true;
let nothing: null = null;
let notDefined: undefined = undefined;

// Arrays
let nums: number[] = [1, 2, 3];
let names: Array<string> = ["a", "b"];

// Any — opts out of type checking (avoid)
let anything: any = "hello";

// Unknown — type-safe any (must narrow before use)
let input: unknown = getUserInput();
if (typeof input === "string") {
  console.log(input.toUpperCase());
}

// Void — function returns nothing
function log(msg: string): void {
  console.log(msg);
}

// Never — function never returns (throws or infinite loop)
function fail(msg: string): never {
  throw new Error(msg);
}
```

---

## Type Inference

TypeScript **infers** types when you don't write them — still gets type safety.

```ts
let x = 10;           // inferred as number
const y = "hello";    // inferred as string (literal)
let arr = [1, 2, 3];  // inferred as number[]

// Explicit only when needed
function identity<T>(value: T): T {
  return value;
}
```

---

## Interfaces

Define **object shapes** — compile-time contract, erased at runtime.

```ts
interface User {
  id: number;
  name: string;
  email: string;
  age?: number;        // optional property
  readonly createdAt: Date;  // can't reassign after creation
}

const user: User = {
  id: 1,
  name: "John",
  email: "john@test.com",
  createdAt: new Date(),
};

// Extend interfaces
interface Admin extends User {
  permissions: string[];
}

// Implement in classes
class UserService implements User {
  id = 0;
  name = "";
  email = "";
  createdAt = new Date();
}
```

### Declaration merging (interface only)

```ts
interface Window {
  myCustomProp: string;
}
interface Window {
  anotherProp: number;
}
// Merged into one interface — useful for extending library types
```

---

## Type Aliases

`type` can describe **anything** — objects, unions, intersections, primitives, tuples.

```ts
type ID = string | number;
type Point = { x: number; y: number };
type Callback = (data: string) => void;

// Union — one of several types
type Status = "pending" | "success" | "error";

// Intersection — combine types
type Employee = Person & { employeeId: number };

// Tuple — fixed-length typed array
type Coordinate = [number, number];
const point: Coordinate = [10, 20];
```

---

## Interface vs Type

| | `interface` | `type` |
| --- | --- | --- |
| Object shapes | ✅ | ✅ |
| Extend | `extends` | `&` intersection |
| Declaration merging | ✅ | ❌ |
| Unions | ❌ | ✅ |
| Tuples | ❌ | ✅ |
| Mapped types | ❌ | ✅ |
| Primitives alias | ❌ | ✅ |

**Rule:** `interface` for object shapes and public APIs. `type` for unions, tuples, and complex compositions.

---

## Enums

Named constants — **not in JavaScript** (unless using `const` objects).

```ts
// Numeric enum
enum Direction {
  Up,    // 0
  Down,  // 1
  Left,  // 2
  Right, // 3
}

// String enum (preferred)
enum Role {
  Admin = "ADMIN",
  User = "USER",
  Guest = "GUEST",
}

const role: Role = Role.Admin;

// const enum — inlined at compile, no runtime object
const enum Color {
  Red = "RED",
  Blue = "BLUE",
}
```

**Modern alternative:** `as const` objects (no runtime overhead):

```ts
const Role = {
  Admin: "ADMIN",
  User: "USER",
} as const;

type Role = typeof Role[keyof typeof Role]; // "ADMIN" | "USER"
```

---

## Literal Types

Exact values as types — JS has values, TS adds literal **types**.

```ts
type Direction = "north" | "south" | "east" | "west";
type Dice = 1 | 2 | 3 | 4 | 5 | 6;

function move(dir: Direction) { /* ... */ }
move("north");  // ✅
move("up");     // ❌ compile error
```

---

## Union & Intersection Types

```ts
// Union — OR
type ID = string | number;
type Result = Success | Failure;

function printId(id: ID) {
  if (typeof id === "string") {
    console.log(id.toUpperCase()); // narrowed to string
  } else {
    console.log(id.toFixed(2));    // narrowed to number
  }
}

// Intersection — AND
type Named = { name: string };
type Aged = { age: number };
type Person = Named & Aged; // { name: string; age: number }
```

---

## Type Narrowing

TS narrows types based on checks — **smarter than JS**.

```ts
function process(value: string | number) {
  if (typeof value === "string") {
    return value.toUpperCase();  // TS knows: string
  }
  return value.toFixed(2);       // TS knows: number
}

// Truthiness narrowing
function print(name: string | null) {
  if (name) {
    console.log(name.toUpperCase()); // string
  }
}

// in operator
type Fish = { swim: () => void };
type Bird = { fly: () => void };

function move(animal: Fish | Bird) {
  if ("swim" in animal) {
    animal.swim();
  } else {
    animal.fly();
  }
}
```

---

## Type Assertions

Tell TS you know the type — **no runtime check**.

```ts
const input = document.getElementById("email") as HTMLInputElement;
const value = input.value;

// Angle bracket syntax (not in JSX files)
const el = <HTMLElement>document.getElementById("root");

// Non-null assertion
const name = user!.name; // assert user is not null/undefined
```

Use sparingly — prefer type guards and narrowing.

---

## Optional Chaining & Nullish Coalescing

These exist in **modern JavaScript (ES2020)** but TS adds type narrowing with them.

```ts
// Optional chaining — TS narrows after check
const city = user?.address?.city;

// Nullish coalescing
const name = user.name ?? "Anonymous"; // only null/undefined, not 0 or ""
```

---

## Functions — Extra TS Features

```ts
// Parameter types + return type
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Optional parameters
function createUser(name: string, age?: number) { }

// Default parameters
function connect(host: string = "localhost") { }

// Rest parameters
function sum(...nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}

// Function type
type MathOp = (a: number, b: number) => number;
const add: MathOp = (a, b) => a + b;

// Overloads — multiple call signatures
function format(value: string): string;
function format(value: number): string;
function format(value: string | number): string {
  return String(value);
}
```

---

## Classes — TS Additions

JS has classes; TS adds **access modifiers** and **abstract classes**.

```ts
abstract class Animal {
  protected name: string;  // accessible in subclass only

  constructor(name: string) {
    this.name = name;
  }

  abstract makeSound(): void;  // must implement in subclass
}

class Dog extends Animal {
  makeSound(): void {
    console.log("Woof");
  }
}

class User {
  public id: number;       // default — accessible anywhere
  private password: string; // class only
  readonly email: string;  // set once, can't change

  constructor(id: number, email: string, password: string) {
    this.id = id;
    this.email = email;
    this.password = password;
  }
}

// Parameter properties shorthand
class Product {
  constructor(
    public id: number,
    public name: string,
    private cost: number,
  ) {}
}
```

| Modifier | Access |
| --- | --- |
| `public` | Anywhere (default) |
| `private` | Class only |
| `protected` | Class + subclasses |
| `readonly` | Set once at init |

---

## Modules & Namespaces

TS adds **import/export type** syntax and type-only imports.

```ts
// Export types
export interface User { id: number; name: string; }
export type ID = string | number;

// Import types only — erased at compile, no runtime import
import type { User } from "./types";
import { type User, createUser } from "./user";

// Re-export
export type { User } from "./types";
```

---

## tsconfig.json — TS-Only Config

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

| Option | What it does |
| --- | --- |
| `strict` | Enable all strict checks |
| `noImplicitAny` | Error on implicit `any` |
| `strictNullChecks` | `null`/`undefined` must be handled |
| `target` | JS version to compile to |
| `module` | Module system (CommonJS, ESNext) |

---

## Quick Revision — What TS Adds

```
Static types       → catch errors at compile time
interface / type   → define object shapes
enum               → named constants
Generics           → reusable typed code
Union / Intersection → combine types
Type narrowing     → smart type checks
Access modifiers   → public, private, protected
readonly           → immutable properties
abstract class     → force subclass implementation
Utility types      → transform existing types
tsconfig.json      → compiler configuration
Type-only imports  → import types without runtime cost
```

> **Next:** `02-generics-utility-types.md` → Generics, utility types, mapped types
