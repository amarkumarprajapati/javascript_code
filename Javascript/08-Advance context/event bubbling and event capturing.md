# Event Bubbling and Event Capturing

## Definition
When an event occurs on an element in the DOM, it doesn't just fire on that element. It travels through the DOM in two phases:
- **Event Capturing** (Capture Phase): Event travels from the root down to the target.
- **Event Bubbling** (Bubble Phase): Event travels from the target back up to the root.

This is called **Event Propagation**.

---

## Event Phases

```
Window → Document → HTML → Body → Parent → Target → ...Bubbles back up
   |          |         |      |       |        |
 CAPTURE                    TARGET            BUBBLE
   |                                           |
  (Top down)                              (Bottom up)
```

### Phase Order
1. **Capture Phase**: Root → Target parent
2. **Target Phase**: The actual element that triggered the event
3. **Bubble Phase**: Target parent → Root

---

## Event Bubbling

### Definition
**Event Bubbling** is the default behavior where an event on a child element "bubbles up" through its ancestors, triggering their event listeners too.

### Example
```html
<div id="grandparent">
  <div id="parent">
    <button id="child">Click me</button>
  </div>
</div>
```

```js
document.getElementById('grandparent').addEventListener('click', () => {
  console.log('Grandparent clicked');
});

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent clicked');
});

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked');
});

// Clicking the button outputs:
// Child clicked
// Parent clicked
// Grandparent clicked
```

---

## Event Capturing

### Definition
**Event Capturing** is the opposite: the event is first captured at the outermost element and travels down to the target.

### Enabling Capture
Pass `true` as the third argument to `addEventListener`:

```js
document.getElementById('grandparent').addEventListener('click', () => {
  console.log('Grandparent captured');
}, true); // <-- capture mode

document.getElementById('parent').addEventListener('click', () => {
  console.log('Parent captured');
}, true);

document.getElementById('child').addEventListener('click', () => {
  console.log('Child clicked');
});

// Clicking the button outputs:
// Grandparent captured
// Parent captured
// Child clicked
```

---

## Stopping Propagation

### `event.stopPropagation()`
Stops the event from traveling further up or down the DOM tree.

```js
document.getElementById('child').addEventListener('click', (e) => {
  e.stopPropagation();
  console.log('Child clicked — propagation stopped');
});
// Parent and Grandparent will NOT be notified
```

### `event.stopImmediatePropagation()`
Stops propagation AND prevents other listeners on the same element from running.

---

## `event.preventDefault()`

### Definition
Prevents the **default browser behavior** associated with an event (not propagation).

```js
document.querySelector('a').addEventListener('click', (e) => {
  e.preventDefault(); // Don't navigate to the link's href
  console.log('Link clicked but no navigation');
});
```

| Method | Stops Propagation? | Prevents Default? |
|--------|--------------------|-------------------|
| `stopPropagation()` | Yes | No |
| `preventDefault()` | No | Yes |
| `stopImmediatePropagation()` | Yes (all on same element too) | No |

---

## Event Delegation

### Definition
**Event Delegation** is a pattern where a single event listener on a parent handles events for all its children, leveraging bubbling.

```js
// Instead of adding listeners to each <li>
document.getElementById('todo-list').addEventListener('click', (e) => {
  if (e.target.tagName === 'LI') {
    console.log('Clicked:', e.target.textContent);
  }
});
```

### Benefits
- Fewer event listeners (better performance).
- Automatically handles dynamically added children.

---

## Key Takeaways
- **Bubbling**: Target → Ancestors (default).
- **Capturing**: Ancestors → Target (`useCapture: true`).
- Use `stopPropagation()` to prevent further travel.
- Use `preventDefault()` to stop default browser behavior.
- Use **Event Delegation** for efficient handling of many child elements.
