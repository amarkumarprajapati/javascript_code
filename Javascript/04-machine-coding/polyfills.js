// Common polyfills asked in mid-level JS interviews.
// Run: node polyfills.js

// ---------- Array.prototype.map ----------
Array.prototype.myMap = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this) result[i] = callback.call(thisArg, this[i], i, this);
  }
  return result;
};

// ---------- Array.prototype.filter ----------
Array.prototype.myFilter = function (callback, thisArg) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    if (i in this && callback.call(thisArg, this[i], i, this)) {
      result.push(this[i]);
    }
  }
  return result;
};

// ---------- Array.prototype.reduce ----------
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue;
  let startIndex = 0;
  if (acc === undefined) {
    acc = this[0];
    startIndex = 1;
  }
  for (let i = startIndex; i < this.length; i++) {
    acc = callback(acc, this[i], i, this);
  }
  return acc;
};

// ---------- Function.prototype.bind ----------
Function.prototype.myBind = function (context, ...bound) {
  const fn = this;
  return function (...args) {
    return fn.apply(context, [...bound, ...args]);
  };
};

// ---------- Promise.all ----------
function myPromiseAll(promises) {
  return new Promise((resolve, reject) => {
    const results = [];
    let completed = 0;
    if (promises.length === 0) return resolve(results);
    promises.forEach((p, i) => {
      Promise.resolve(p)
        .then((val) => {
          results[i] = val;
          completed++;
          if (completed === promises.length) resolve(results);
        })
        .catch(reject); // fail fast
    });
  });
}

// ---------- Quick tests ----------
console.log([1, 2, 3].myMap((x) => x * 2));        // [2,4,6]
console.log([1, 2, 3, 4].myFilter((x) => x % 2));  // [1,3]
console.log([1, 2, 3].myReduce((a, b) => a + b, 0)); // 6

function greet(greeting, name) { return `${greeting}, ${name}`; }
const hello = greet.myBind(null, "Hello");
console.log(hello("Amar"));                         // "Hello, Amar"

myPromiseAll([Promise.resolve(1), Promise.resolve(2), 3]).then(console.log); // [1,2,3]

module.exports = { myPromiseAll };
