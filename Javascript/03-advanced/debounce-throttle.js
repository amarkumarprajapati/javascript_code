// Runnable demo: node debounce-throttle.js

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

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

// --- Demo debounce: only the last call within 300ms runs ---
const log = debounce((msg) => console.log("[debounce] fired:", msg), 300);
log("a");
log("b");
log("c"); // only "c" prints after 300ms

// --- Demo throttle: fires at most once per 300ms ---
const t = throttle((n) => console.log("[throttle] fired:", n), 300);
let i = 0;
const id = setInterval(() => {
  t(++i);
  if (i >= 10) clearInterval(id);
}, 50); // 10 calls in 500ms → ~2 throttled fires

module.exports = { debounce, throttle };
