// The .some() method checks if at least one element in an array passes a test (provided by a callback function).

const data = [1, 3, 5, 7, 8];

const hasEven = data.some(num => num % 2 === 0);

console.log(hasEven);
console.log(data)
