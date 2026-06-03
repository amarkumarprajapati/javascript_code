// The .filter() method creates a new array with only the elements that pass a test (return true) from a provided function.

// array.filter(function(element, index, array) {
//   // return true to keep element
// });


let data = [1, 2, 3, 4, 5, 6, 7, 8, 90, 10]

let res = data.filter(data => data % 2 === 0)
console.log(res)