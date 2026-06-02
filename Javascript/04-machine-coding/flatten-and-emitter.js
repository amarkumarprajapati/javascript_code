// More machine-coding favorites. Run: node flatten-and-emitter.js

// ---------- Flatten a nested array (custom depth) ----------
function flatten(arr, depth = Infinity) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...flatten(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
}

console.log(flatten([1, [2, [3, [4]]]]));      // [1,2,3,4]
console.log(flatten([1, [2, [3, [4]]]], 1));   // [1,2,[3,[4]]]

// ---------- Flatten a nested object (dot notation) ----------
function flattenObject(obj, prefix = "") {
  return Object.keys(obj).reduce((acc, key) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], path));
    } else {
      acc[path] = obj[key];
    }
    return acc;
  }, {});
}

console.log(flattenObject({ a: 1, b: { c: 2, d: { e: 3 } } }));
// { a: 1, 'b.c': 2, 'b.d.e': 3 }

// ---------- EventEmitter (pub/sub) ----------
class EventEmitter {
  constructor() {
    this.events = {};
  }
  on(event, listener) {
    (this.events[event] ||= []).push(listener);
    return this;
  }
  off(event, listener) {
    this.events[event] = (this.events[event] || []).filter((l) => l !== listener);
    return this;
  }
  once(event, listener) {
    const wrap = (...args) => {
      listener(...args);
      this.off(event, wrap);
    };
    return this.on(event, wrap);
  }
  emit(event, ...args) {
    (this.events[event] || []).forEach((l) => l(...args));
    return this;
  }
}

const bus = new EventEmitter();
const handler = (msg) => console.log("got:", msg);
bus.on("data", handler);
bus.emit("data", "hello"); // got: hello
bus.off("data", handler);
bus.emit("data", "ignored"); // nothing

module.exports = { flatten, flattenObject, EventEmitter };
