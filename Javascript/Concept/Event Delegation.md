# Event Delegation

## Definition
**Event Delegation** is a pattern in JavaScript where a **single event listener** is attached to a **parent element** to handle events for **all of its current and future child elements**. It leverages the **event bubbling** mechanism to catch events as they propagate upward through the DOM.

---

## Why Use Event Delegation?

| Problem | Solution with Delegation |
|---------|--------------------------|
| Attaching listeners to 1000 items = 1000 listeners | One listener on parent handles all |
| Dynamically added elements need new listeners | No extra listeners needed |
| Memory overhead from many listeners | Minimal memory usage |

---

## How It Works

```
User clicks <li> item
     |
     v
<li> click event fires
     |
     v
Event BUBBLES UP to <ul>
     |
     v
<ul>'s listener catches event via event.target
     |
     v
Handler runs based on event.target (the actual <li>)
```

---

## Basic Example

### Without Event Delegation (Inefficient)
```js
const items = document.querySelectorAll('li');

items.forEach(item => {
  item.addEventListener('click', function() {
    console.log('Clicked:', this.textContent);
  });
});
// 100 list items = 100 event listeners in memory!
```

### With Event Delegation (Efficient)
```js
document.getElementById('todo-list').addEventListener('click', function(event) {
  // event.target is the ACTUAL element that was clicked
  if (event.target.tagName === 'LI') {
    console.log('Clicked:', event.target.textContent);
  }
});
// Only 1 listener for any number of items!
```

```html
<ul id="todo-list">
  <li>Buy milk</li>
  <li>Walk dog</li>
  <li>Read book</li>
  <!-- New <li> items will also work automatically -->
</ul>
```

---

## Dynamic Elements Example

### Without Delegation: Dynamic Items Don't Work
```js
document.getElementById('add-btn').addEventListener('click', () => {
  const li = document.createElement('li');
  li.textContent = 'New item';
  document.getElementById('list').appendChild(li);
  // This new li has NO click listener!
});
```

### With Delegation: Works Automatically
```js
document.getElementById('list').addEventListener('click', (e) => {
  if (e.target.matches('li')) {
    e.target.classList.toggle('completed');
  }
});

// Dynamically added items work without any extra code!
document.getElementById('add-btn').addEventListener('click', () => {
  const li = document.createElement('li');
  li.textContent = 'New item';
  document.getElementById('list').appendChild(li);
});
```

---

## Using `event.target` vs `event.currentTarget`

| Property | Description |
|----------|-------------|
| `event.target` | The **actual element** that triggered the event |
| `event.currentTarget` | The element **the listener is attached to** |

```js
document.getElementById('list').addEventListener('click', function(e) {
  console.log(e.target);        // The <li> that was clicked
  console.log(e.currentTarget); // The <ul> #list (where listener is)
});
```

---

## Filtering Events with `closest()`

### Definition
Use `Element.closest()` to handle clicks on child elements inside the target.

```js
document.getElementById('list').addEventListener('click', (e) => {
  // Find the nearest ancestor <li> from the click target
  const li = e.target.closest('li');

  if (li) {
    console.log('Clicked list item:', li.textContent);
  }
});
```

This handles cases where the user clicks a `<span>` or `<button>` **inside** the `<li>`.

---

## Advanced Example: Table Row Actions

```html
<table id="user-table">
  <tr data-id="1">
    <td>Alice</td>
    <td><button class="edit">Edit</button></td>
    <td><button class="delete">Delete</button></td>
  </tr>
  <!-- more rows... -->
</table>
```

```js
document.getElementById('user-table').addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  const userId = row?.dataset.id;

  if (e.target.matches('.edit')) {
    editUser(userId);
  } else if (e.target.matches('.delete')) {
    deleteUser(userId);
  }
});
```

---

## When NOT to Use Event Delegation

- **Small number of elements** — direct listeners are simpler.
- **No parent container** — delegation needs a common ancestor.
- **Need `event.stopPropagation()`** — can interfere with delegation.
- **Non-bubbling events** — `focus`, `blur`, `mouseenter`, `mouseleave` don't bubble.

---

## Key Takeaways
- Attach **one listener** to a **parent** instead of many to children.
- Use `event.target` or `closest()` to identify the actual clicked element.
- Works **automatically** for dynamically added elements.
- Saves memory and improves performance with large lists.
