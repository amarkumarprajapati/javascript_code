let data = [123, 1531321, 35, 13151, 48, 1321, 5135, 15, 1, 62, 1, 2, 32];
let data1 = [1321, 1, 541131, 54, 5, 15, 6484, 564];

function add(data, data1) {
  let finalarr = [];
  let length = Math.max(data.length, data1.length);
  for (let a = 0; a < length; a++) {
    let sum = data[a] + data1[a] || 0;
    finalarr.push(sum);
  }
  return finalarr;
}

let res = add(data, data1);
console.log(res);
