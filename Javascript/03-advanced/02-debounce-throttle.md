# Debounce & Throttle

Both limit how often a function runs — common in search inputs, scroll, resize.

## Debounce
Run the function **only after** the user stops triggering it for `delay` ms. Resets the timer on every call.
> Use case: search box (wait until typing stops), autosave.

```js
function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const onSearch = debounce((q) => console.log("search:", q), 500);
// fires once, 500ms after the last keystroke
```

## Throttle
Run the function **at most once per `limit` ms**, no matter how often it's triggered.
> Use case: scroll, resize, mousemove, button spam.

```js
function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

const onScroll = throttle(() => console.log("scroll"), 200);
```

## Difference (one-liner for interviews)
- **Debounce** → waits for a pause, fires once at the end.
- **Throttle** → fires at a steady max rate during the activity.

## Debounce with immediate (leading edge) — bonus
```js
function debounce(fn, delay, immediate = false) {
  let timer;
  return function (...args) {
    const callNow = immediate && !timer;
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      if (!immediate) fn.apply(this, args);
    }, delay);
    if (callNow) fn.apply(this, args);
  };
}
```

---

## Common interview questions
1. **Debounce vs throttle?** → see one-liner above.
2. **Write debounce from scratch.** → closure over `timer` + `clearTimeout`.
3. **Where would you use each?** → debounce: search; throttle: scroll/resize.

> Runnable demo: `node debounce-throttle.js`
