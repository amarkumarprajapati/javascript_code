let data = [1, 2, 3, 4, 5, 2, 4, 5, 2, 4, 5, 56, 6, 58, 8, 5];
let reversedarray = [];

for (let a = data.length - 1; a >= 0; a--) {
  reversedarray.push(data[a]);
}

console.log(reversedarray);
