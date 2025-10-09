// The .find() method returns the first element in an array that satisfies a given condition (returns true in the callback function).
// If no match is found, it returns undefined.

let data = [1,11,3,4,5,6,7,8,9,10]

let res = data.find(data => data % 2 === 0)

console.log(res)
 