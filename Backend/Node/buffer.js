// What is the Buffer Module?
// The Buffer module in Node.js is used to handle binary data.

// Buffers are similar to arrays of integers but are fixed-length and correspond to raw memory allocations outside the V8 JavaScript engine.

// Node.js provides the Buffer class as a global object, so you don't need to require or import it explicitly.



// 1. Buffer.alloc()
// Creates a new Buffer of the specified size, initialized with zeros.

// This is the safest way to create a new buffer as it ensures no old data is present.


const buffer1 = Buffer.alloc(10);
console.log(buffer1);



// 2. Buffer.allocUnsafe()
// Creates a new Buffer of the specified size, but doesn't initialize the memory.

// This is faster than Buffer.alloc() but may contain old or sensitive data.

// Always fill the buffer before use if security is a concern.

const buffer2 = Buffer.allocUnsafe(10);
console.log(buffer2);



// 3. Buffer.from()
// Creates a new Buffer from various sources like strings, arrays, or ArrayBuffer. This is the most flexible way to create buffers from existing data.



const buffer3 = Buffer.from('Hello, World!');
console.log(buffer3);