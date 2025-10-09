// The .entries() method returns an iterator of an array's index-value pairs, where each item is an array: [index, value]

let fruits = ["apple", "banana", "cherry"];
let entries = fruits.entries();

for (let [index, value] of entries) {
    console.log(index, value)
}

console.log(entries)