# TypeScript — Advanced Features & Interview Q&A

> TS-only features: decorators, strict mode, .tsx, runtime validation, and interview questions.

---

## Decorators (Experimental)

Add metadata and modify classes/methods — used in **NestJS**, Angular.

```ts
function Log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`Calling ${key} with`, args);
    return original.apply(this, args);
  };
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}
```

Enable in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

Common in: `@Controller`, `@Get`, `@Injectable` (NestJS), `@Component` (Angular).

---

## Strict Mode Options

TypeScript strict flags JS doesn't enforce:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noImplicitThis": true,
    "alwaysStrict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

| Flag | Effect |
| --- | --- |
| `strictNullChecks` | Must handle `null`/`undefined` explicitly |
| `noImplicitAny` | Error when TS can't infer type |
| `strictPropertyInitialization` | Class properties must be initialized |
| `noImplicitReturns` | All code paths must return |

---

## TSX — TypeScript + JSX

TypeScript adds types to React JSX.

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

function Button({ label, onClick, disabled = false }: ButtonProps) {
  return (
    <button onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}

// Typed events
function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
  console.log(e.target.value);
}

// Typed refs
const inputRef = useRef<HTMLInputElement>(null);
inputRef.current?.focus();

// Typed children
interface CardProps {
  title: string;
  children: React.ReactNode;
}
```

---

## Module Augmentation

Extend types from third-party libraries.

```ts
// Extend Express Request
declare global {
  namespace Express {
    interface Request {
      user?: { id: number; role: string };
    }
  }
}

// Extend module
declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}
```

---

## Ambient Declarations

Tell TS about JS files without types.

```ts
// types/global.d.ts
declare module "*.css" {
  const classes: { [key: string]: string };
  export default classes;
}

declare module "*.png" {
  const src: string;
  export default src;
}

declare const API_URL: string;
```

---

## Runtime Validation with Zod

Types are compile-time only — validate at runtime with Zod.

```ts
import { z } from "zod";

const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  age: z.number().optional(),
});

type User = z.infer<typeof UserSchema>;  // infer TS type from schema

// Validate API response
const data = UserSchema.parse(await response.json());  // throws if invalid
const result = UserSchema.safeParse(input);  // { success, data } | { success: false, error }
```

**Pattern:** Single source of truth — schema defines both runtime validation and TS type.

---

## TypeScript vs JavaScript — Summary

| Feature | JS | TS |
| --- | --- | --- |
| Static types | ❌ | ✅ |
| Interfaces | ❌ | ✅ |
| Generics | ❌ | ✅ |
| Enums | ❌ | ✅ |
| Access modifiers | ❌ | ✅ |
| Utility types | ❌ | ✅ |
| Type narrowing | ❌ | ✅ |
| Compile step | ❌ | ✅ (tsc) |
| Decorators | Stage 3 (ES) | ✅ (experimental) |
| `.tsx` | ❌ | ✅ |

**Everything in JavaScript works in TypeScript.** TS only adds a type layer on top.

---

# Interview Questions & Answers

---

### 1. What is TypeScript? How is it different from JavaScript?

**Answer:** TypeScript is a **superset of JavaScript** that adds static type checking. It compiles to plain JavaScript. All valid JS is valid TS.

| JavaScript | TypeScript |
| --- | --- |
| Dynamic types | Static types checked at compile time |
| Errors at runtime | Errors caught before running |
| No compile step | Compiles via `tsc` |
| `.js` files | `.ts` / `.tsx` files |

Types are erased at runtime — zero performance overhead.

---

### 2. What is the difference between `interface` and `type`?

**Answer:**

| | interface | type |
| --- | --- | --- |
| Object shapes | ✅ | ✅ |
| Declaration merging | ✅ | ❌ |
| Unions | ❌ | ✅ |
| Tuples | ❌ | ✅ |
| Mapped types | ❌ | ✅ |

Use `interface` for object shapes and public APIs. Use `type` for unions, tuples, and complex type compositions.

---

### 3. What is the difference between `any` and `unknown`?

**Answer:**

| | any | unknown |
| --- | --- | --- |
| Type checking | Disabled | Enabled after narrowing |
| Assign to anything | ✅ | ❌ |
| Safe | ❌ | ✅ |

```ts
let a: any = "hello";
a.toFixed(); // no error — runtime crash

let b: unknown = "hello";
b.toUpperCase(); // ❌ compile error
if (typeof b === "string") b.toUpperCase(); // ✅
```

Avoid `any`. Use `unknown` for external data, then narrow with type guards or Zod.

---

### 4. Explain generics with an example.

**Answer:** Generics write reusable code that works with multiple types while preserving type safety.

```ts
function useFetch<T>(url: string): { data: T | null; loading: boolean } {
  const [data, setData] = useState<T | null>(null);
  // fetch and set data
  return { data, loading };
}

const { data } = useFetch<User[]>("/api/users");
// data is User[] | null — not any
```

Used in: API wrappers, hooks, data structures (Stack<T>, Map<K,V>).

---

### 5. What are utility types? Explain Partial, Pick, Omit, Required, Readonly.

**Answer:** Built-in types that transform existing types.

```ts
interface User { id: number; name: string; email: string; age?: number; }

Partial<User>              // all optional
Required<User>             // all required
Readonly<User>             // all readonly
Pick<User, "id" | "name">  // select fields
Omit<User, "email">        // remove fields
Record<string, number>     // typed key-value map
ReturnType<typeof fn>      // function return type
```

Common pattern: `Omit<User, "id">` for CreateUserDto.

---

### 6. What is a discriminated union?

**Answer:** Union type where each member shares a **literal discriminant field** for type narrowing.

```ts
type Result =
  | { status: "success"; data: string }
  | { status: "error"; error: string };

function handle(result: Result) {
  if (result.status === "success") {
    console.log(result.data);  // TS knows data exists
  }
}
```

Eliminates impossible states — can't be success without data.

---

### 7. What is type narrowing?

**Answer:** TypeScript refines a type within a conditional block based on checks.

Methods: `typeof`, `instanceof`, `in`, equality checks, type guard functions (`pet is Fish`), discriminated unions.

```ts
function process(value: string | number) {
  if (typeof value === "string") return value.toUpperCase();
  return value.toFixed(2);
}
```

---

### 8. What is `as const`?

**Answer:** Freezes a value to its **literal type** and makes it deeply readonly.

```ts
const routes = { home: "/", about: "/about" } as const;
type Route = typeof routes[keyof typeof routes]; // "/" | "/about"
```

Without `as const`, values widen to `string`. With it, exact literals are preserved.

---

### 9. What is the `satisfies` operator?

**Answer:** Validates a value matches a type **without widening** — TS 4.9+.

```ts
const palette = {
  red: "#ff0000",
  green: "#00ff00",
} satisfies Record<string, string>;

palette.red; // TS knows exact shape, not just Record<string, string>
```

---

### 10. What are access modifiers in TypeScript classes?

**Answer:**

| Modifier | Access |
| --- | --- |
| `public` | Anywhere (default) |
| `private` | Class only |
| `protected` | Class + subclasses |
| `readonly` | Set once, immutable |

JavaScript has no access modifiers — TS adds compile-time enforcement (erased at runtime unless using `#` private fields in modern JS).

---

### 11. What is declaration merging?

**Answer:** Two interfaces with the same name **merge** into one. Only works with `interface`, not `type`.

```ts
interface User { name: string; }
interface User { age: number; }
// Result: { name: string; age: number }
```

Used to extend third-party library types.

---

### 12. How do you type a React component's props?

**Answer:**

```tsx
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
  children?: React.ReactNode;
}

function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return <button className={variant} onClick={onClick}>{label}</button>;
}
```

For components with children: `React.PropsWithChildren<Props>` or explicit `children: React.ReactNode`.

---

### 13. What is `strictNullChecks`?

**Answer:** When enabled, `null` and `undefined` are not assignable to other types unless explicitly handled.

```ts
// strictNullChecks: false
let name: string = null; // allowed

// strictNullChecks: true
let name: string = null; // ❌ error
let name: string | null = null; // ✅ must declare nullable
```

Forces handling of null/undefined — prevents most null reference errors.

---

### 14. How do you handle types for API responses?

**Answer:**

```ts
// Define types
interface User { id: number; name: string; }
interface ApiResponse<T> { data: T; status: number; }

// Fetch with type
async function getUsers(): Promise<ApiResponse<User[]>> {
  const res = await fetch("/api/users");
  return res.json();
}

// Runtime validation (recommended)
const UserSchema = z.object({ id: z.number(), name: z.string() });
const users = z.array(UserSchema).parse(await res.json());
type User = z.infer<typeof UserSchema>;
```

---

### 15. What are mapped types?

**Answer:** Create new types by transforming each property of an existing type.

```ts
type Optional<T> = { [K in keyof T]?: T[K] };
type Readonly<T> = { readonly [K in keyof T]: T[K] };
type Nullable<T> = { [K in keyof T]: T[K] | null };
```

Utility types like `Partial`, `Readonly` are built using mapped types internally.

---

## Quick Revision

```
TS = JS + static types (erased at compile time)
interface  → object shapes, declaration merging
type       → unions, tuples, mapped types
any        → avoid — disables checking
unknown    → safe any — narrow before use
Generics   → reusable typed code <T>
Utility    → Partial, Pick, Omit, Required, Readonly
Discriminated union → shared literal field for narrowing
as const   → literal types + readonly
satisfies  → validate without widening
strict     → enable all strict checks in tsconfig
Zod        → runtime validation + z.infer for types
Decorators → @ decorators (NestJS, Angular)
```
