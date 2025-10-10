//  Explanation:
// data.unshift(2) adds 2 to the start of the array.
// res stores the new length of the array → 10.
// The updated array becomes → [2, 1, 2, 3, 4, 5, 6, 7, 8, 9].


let data = [1,2,3,4,5,6,7,8,9]

let res = data.unshift(2)

console.log("res",res)
console.log(data)