# String Methods — Complete Reference


> Note: this file replaces the misnamed `Object-notes.txt` (which was actually about strings).

## Mental model — 4 categories

```
                       ┌──────────────────────┐
                       │  STRING METHODS      │
                       └──────────────────────┘
                                 │
       ┌──────────────┬──────────┴──────────┬──────────────┐
       ▼              ▼                     ▼              ▼
    SEARCH         MODIFY               SPLIT/EXTRACT    OTHER
    ──────         ──────               ─────────────    ─────
    includes       toUpper/Lower        split            toString
    indexOf        trim / replace       slice            valueOf
    startsWith     padStart / repeat    substring        localeCompare
    endsWith       normalize            charAt / at
```

**Big rule:** strings are **immutable** — every method returns a NEW string.

```js
const s = 'hello';
s.toUpperCase();      // 'HELLO'
console.log(s);       // 'hello'  ← original unchanged
```

---

## 1. Search & Check — "does it contain / where is it?"

### `includes(substr, fromIndex?)` — boolean
```js
'hello world'.includes('world');         // true
'hello'.includes('LO');                  // false (case-sensitive)
'hello'.includes('l', 4);                // false (starts looking from index 4)
```
Without method:
```js
function includes(str, sub) { return str.indexOf(sub) !== -1; }
```

### `indexOf(substr)` / `lastIndexOf(substr)` — position or -1
```js
'banana'.indexOf('a');                   // 1   (first occurrence)
'banana'.lastIndexOf('a');               // 5
'banana'.indexOf('z');                   // -1
```

### `startsWith(substr, pos?)` / `endsWith(substr, len?)`
```js
'hello.js'.startsWith('hello');          // true
'hello.js'.endsWith('.js');              // true
'/api/users'.startsWith('/api');         // true (great for routing)
```

### `search(regex)` — index of first regex match
```js
'hello 123 world'.search(/\d+/);         // 6
```

### `match(regex)` / `matchAll(regex)`
```js
'a1 b2 c3'.match(/\d/g);                 // ['1','2','3']
[...'a1 b2'.matchAll(/(\w)(\d)/g)];      // detailed groups + indices
```

---

## 2. Modify — "transform the text"

### Case
```js
'Hello'.toUpperCase();                   // 'HELLO'
'Hello'.toLowerCase();                   // 'hello'
'Hello'.toLocaleLowerCase('tr-TR');      // locale-aware (Turkish dotless i)
```

### Trim — remove whitespace
```js
'   hi   '.trim();                       // 'hi'
'   hi   '.trimStart();                  // 'hi   '
'   hi   '.trimEnd();                    // '   hi'
```

### Replace
```js
'hello hello'.replace('hello', 'hi');        // 'hi hello'  (first only)
'hello hello'.replaceAll('hello', 'hi');     // 'hi hi'
'hello'.replace(/l/g, 'L');                  // 'heLLo'     (regex w/ g)
'2025-01-15'.replace(/(\d+)-(\d+)-(\d+)/, '$3/$2/$1');   // '15/01/2025'

// function replacer
'abc'.replace(/./g, c => c.toUpperCase()); // 'ABC'
```

### Pad / Repeat
```js
'5'.padStart(3, '0');                    // '005'      (zero-pad)
'5'.padEnd(3, '*');                      // '5**'
'ab'.repeat(3);                          // 'ababab'
```

### Concat (rare — use `+` or template literals)
```js
'a'.concat('b', 'c');                    // 'abc'
`${'a'}${'b'}${'c'}`;                    // 'abc'   ← preferred
```

---

## 3. Split & Extract — "get parts of it"

### `split(separator, limit?)` — string → array
```js
'a,b,c'.split(',');                      // ['a','b','c']
'hello'.split('');                       // ['h','e','l','l','o']
'one two three'.split(/\s+/);            // ['one','two','three']
'a,b,c,d'.split(',', 2);                 // ['a','b']
```

### `slice(start, end?)` — supports negatives
```js
'hello'.slice(0, 3);                     // 'hel'
'hello'.slice(-3);                       // 'llo'   (last 3)
'hello'.slice(-3, -1);                   // 'll'
```

### `substring(start, end?)` — no negatives (clamped to 0)
```js
'hello'.substring(1, 4);                 // 'ell'
'hello'.substring(4, 1);                 // 'ell'  (auto-swaps args!)
'hello'.substring(-2);                   // 'hello' (negative → 0)
```

### `substr(start, length?)` — **deprecated**, avoid

### `charAt(i)` / `at(i)` / bracket
```js
'hello'.charAt(1);                       // 'e'
'hello'[1];                              // 'e'
'hello'.at(-1);                          // 'o'    (supports negative)
'hello'.charCodeAt(0);                   // 104
String.fromCharCode(72, 73);             // 'HI'
'hello'.codePointAt(0);                  // 104  (handles emoji properly)
String.fromCodePoint(0x1F600);           // '😀'
```

### Quick reference — which extractor to use?
| Need | Use |
|------|-----|
| Negatives, modern code | `slice` |
| Length-based | `slice` or `substring` |
| Single char, with negatives | `at(i)` |
| Emoji-safe | `codePointAt` / `fromCodePoint` |

---

## 4. Other / specialized

### `toString()` / `valueOf()` — rarely called manually
```js
(123).toString();                        // '123'
true.toString();                         // 'true'
[1,2,3].toString();                      // '1,2,3'
```

### `localeCompare(other)` — locale-aware sort
```js
['Älpha', 'Alpha', 'Beta'].sort((a, b) => a.localeCompare(b, 'de'));
'a'.localeCompare('b');                  // -1   (a < b)
```

### `normalize()` — Unicode canonicalization
```js
'\u00E9' === '\u0065\u0301';                              // false (é vs e+◌́)
'\u00E9'.normalize() === '\u0065\u0301'.normalize();      // true
```

### Template literals (modern, not a method but essential)
```js
const name = 'Sam', n = 3;
`Hi ${name}, you have ${n} messages`;            // interpolation
`line 1
line 2`;                                          // multi-line, no \n needed

// tagged template
function safe(strings, ...vals) {
  return strings.reduce((acc, s, i) =>
    acc + s + (vals[i] !== undefined ? String(vals[i]).replace(/</g,'&lt;') : ''), '');
}
safe`hello <${userInput}>`;
```

---

## 5. Without the method — common manual versions

### Reverse a string (no built-in!)
```js
function reverse(s) {
  let out = '';
  for (let i = s.length - 1; i >= 0; i--) out += s[i];
  return out;
}
reverse('hello');                              // 'olleh'

// one-liner (but breaks on emoji — surrogate pairs)
[...'hello'].reverse().join('');               // 'olleh'  (emoji-safe)
```

### Count occurrences of a char
```js
function count(s, ch) {
  let n = 0;
  for (const c of s) if (c === ch) n++;
  return n;
}

// built-in trick
'banana'.split('a').length - 1;                // 3
```

### Check palindrome
```js
function isPalindrome(s) {
  s = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (let i = 0, j = s.length - 1; i < j; i++, j--) {
    if (s[i] !== s[j]) return false;
  }
  return true;
}
isPalindrome('A man, a plan, a canal: Panama');    // true
```

### Capitalize first letter
```js
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
cap('hello');                                   // 'Hello'
```

---

## ⚠️ Emoji / Unicode pitfall

`length` and indexing count **UTF-16 code units**, not characters:
```js
'😀'.length;                                    // 2  ❌ not 1
[...'😀'].length;                               // 1  ✅ spread iterates code points
'😀'.charAt(0);                                 // '\uD83D'  (broken half)
'😀'.codePointAt(0);                            // 128512  ✅
```

---

## Common interview questions

1. **Are strings mutable?** → No, every method returns a new string.
2. **`slice` vs `substring` vs `substr`?** → slice supports negatives (preferred); substring clamps + swaps; substr deprecated.
3. **`includes` vs `indexOf` vs `search`?** → boolean / index / regex index.
4. **Reverse a string?** → spread + reverse + join, or for-loop building string.
5. **Why does `'😀'.length === 2`?** → UTF-16 surrogate pair; use `[...str].length`.
6. **Template literal vs `+`?** → cleaner interpolation, multi-line, can be tagged.
