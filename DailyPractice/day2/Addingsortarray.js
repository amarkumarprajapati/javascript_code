let data = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function addass(data) {
  let sum = [];
  for (let a = 0; a < data.length; a++) {
    sum += data[a];
    console.log(sum);
  }
  return sum;
}

let res = addass(data);
console.log("res", res);


// output - 
// 1
// 12
// 123
// 1234
// 12345
// 123456
// 1234567
// 12345678
// 123456789
// res 123456789