// .flatMap() is a method that first maps each element of an array, then flattens the result by one level.
// It's like doing .map() followed by .flat(1), but faster and cleaner.

// array.flatMap(callbackFn)


let data = [1, 2, 3, 6, 7, 8, 9]

let res = data.flatMap(x => [x, x * 2])

console.log(res)