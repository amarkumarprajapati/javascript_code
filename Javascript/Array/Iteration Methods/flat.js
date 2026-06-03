// .flat() is a method used to flatten nested arrays — it removes inner arrays and returns a single-level array (or less nested, depending on depth).

// array.flat(depth)


let data = [1, 2, 3, 4, 5, 6, 7, [8, 9], 10, 11, [14, 16, 18, 20], [623]]


let res = data.flat()

console.log(res)


