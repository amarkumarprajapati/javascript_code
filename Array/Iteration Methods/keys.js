// The .keys() method returns a new array iterator that contains the keys (indexes) of the array.

let data = [1, 2, 3, 4, 5, 6, 7, 8, 9]

let res = data.keys()

for (let key of res) {
    console.log(key)
}

console.log(data)

