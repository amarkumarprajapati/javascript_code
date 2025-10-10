data = [121, 5135, 1515, 464, 68, 5, 1, 123];
data1 = [1351, 12, 135, 484, 21, 21, 5, 46, 48];

function sumtwo(data, data1) {
  let sumnew = [];
  let maxlength = Math.max(data.length, data1.length);
  for (let a = 0; a < maxlength; a++) {
    let sumval = data[a];
    let sumval2 = data[a];
    sumnew.push(sumval + sumval2);
  }
  return sumnew;
}

let res = sumtwo(data, data1);
console.log("res", res);

