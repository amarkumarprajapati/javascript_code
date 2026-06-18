# DOM Manipulation



## Mental model — the DOM tree

```
              document
                 │
              <html>
            ┌────┴─────┐
         <head>      <body>
                       │
              ┌────────┼────────┐
            <div>   <ul>     <button>
              │      │
            "Hi"  <li>×3
```

Every node has `parent`, `children`, `nextSibling`, `previousSibling`.

```
                   parentNode
                       ▲
                       │
   previousSibling ◀─ NODE ─▶ nextSibling
                       │
                       ▼
                  children[]
                  firstChild / lastChild
```

---

## 1. Selecting elements

```js
document.getElementById('app');                // single — fastest
document.querySelector('.btn');                // first match (any CSS selector)
document.querySelectorAll('ul > li');          // NodeList of all matches
document.getElementsByClassName('item');       // live HTMLCollection
document.getElementsByTagName('div');          // live HTMLCollection

// modern shorthand
const $  = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => [...root.querySelectorAll(sel)];
```

| | returns | live? | accepts CSS sel? |
|---|---|---|---|
| `getElementById` | Element / null | — | id only |
| `querySelector` | Element / null | no | ✅ |
| `querySelectorAll` | NodeList | no (static snapshot) | ✅ |
| `getElementsByClassName` | HTMLCollection | **yes** (auto-updates) | class name only |

---

## 2. Reading & modifying

```js
const el = document.querySelector('#title');

// text & HTML
el.textContent = 'safe text';            // safe — no parsing
el.innerHTML   = '<b>parsed</b>';        // ⚠️ XSS risk — never insert user input

// attributes
el.getAttribute('href');
el.setAttribute('data-id', 42);
el.removeAttribute('disabled');
el.id; el.className; el.href;            // common props (direct access)

// classes
el.classList.add('active');
el.classList.remove('hidden');
el.classList.toggle('on');
el.classList.contains('on');
el.classList.replace('old','new');

// inline style
el.style.color = 'red';
el.style.setProperty('--theme', 'dark');

// data-* attributes (most common pattern)
el.dataset.userId = 7;                   // sets data-user-id="7"
console.log(el.dataset.userId);
```

---

## 3. Creating, inserting, removing

```js
// create
const li = document.createElement('li');
li.textContent = 'new item';
li.className = 'item';

// insert
parent.appendChild(li);                   // at end
parent.prepend(li);                       // at start
parent.insertBefore(li, parent.firstChild);
parent.insertAdjacentHTML('beforeend', '<span>x</span>');
// positions: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend'

// replace
oldEl.replaceWith(newEl);

// remove
el.remove();                              // modern
el.parentNode.removeChild(el);            // legacy
```

### Fragment — batch DOM updates (perf)
```js
const frag = document.createDocumentFragment();
for (const item of items) {
  const li = document.createElement('li');
  li.textContent = item;
  frag.appendChild(li);                   // off-DOM, no reflow
}
list.appendChild(frag);                   // ONE reflow
```

---

## 4. Events

```js
btn.addEventListener('click', handler);
btn.removeEventListener('click', handler);   // must be SAME ref

function handler(event) {
  event.preventDefault();                 // stop default (e.g. form submit)
  event.stopPropagation();                // stop bubbling
  console.log(event.target);              // actual clicked element
  console.log(event.currentTarget);       // element listener is on
}

// once / capture / passive
btn.addEventListener('click', fn, { once: true });          // auto-remove after 1
btn.addEventListener('scroll', fn, { passive: true });      // perf for scroll/touch
btn.addEventListener('click', fn, { capture: true });       // listen on capture phase
```

### Event flow

```
       window
         │ capture phase ▼ (root → target)
       document
         │
       <body>
         │
       <div>
         │
       <button>  ← TARGET
         │
       <div>
         │ bubble phase ▲ (target → root)
       <body>
         │
       document
```

### Event delegation (one listener, many children)

```js
// ❌ wasteful — N listeners
items.forEach(li => li.addEventListener('click', handle));

// ✅ ONE listener on parent — works for dynamically added items too
list.addEventListener('click', (e) => {
  const li = e.target.closest('li.item');
  if (li && list.contains(li)) handle(li.dataset.id);
});
```

---

## 5. Traversal

```js
el.parentNode / el.parentElement
el.children                    // HTMLCollection (elements only)
el.childNodes                  // NodeList (incl. text/comment nodes)
el.firstElementChild / el.lastElementChild
el.nextElementSibling / el.previousElementSibling
el.closest('.card')            // ↑ ancestor matching selector
el.matches('.active')          // boolean
```

---

## 6. Forms

```js
const form = document.querySelector('form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  for (const [k, v] of data) console.log(k, v);
  const obj = Object.fromEntries(data);   // → plain object
});

// individual inputs
input.value;
input.checked;
select.selectedOptions;
```

---

## Common pitfalls

| Pitfall | Fix |
|---------|-----|
| `innerHTML = userInput` | use `textContent` (XSS) |
| `querySelectorAll` doesn't update on DOM change | re-query, or use `getElementsByClassName` if live needed |
| Many listeners on a long list | event delegation |
| Repeated DOM writes in a loop | DocumentFragment, batch |
| `for...of` on `NodeList` works, but `.map` doesn't directly | `[...nodeList].map(...)` |

---

## Common interview questions

1. **Event bubbling vs capturing?** → bubble = target→root (default); capture = root→target.
2. **`target` vs `currentTarget`?** → target = actual clicked; currentTarget = where listener lives.
3. **What is event delegation, why use it?** → one parent listener handles N children; works for dynamic items.
4. **`innerHTML` vs `textContent`?** → innerHTML parses HTML (XSS risk); textContent treats as plain text.
5. **Live vs static NodeList?** → `getElementsByClassName` is live; `querySelectorAll` is a static snapshot.
6. **How to remove a listener?** → `removeEventListener` with same function reference (so don't use anonymous fns).
