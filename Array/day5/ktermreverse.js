let data = [123, 1531321, 35, 13151, 48, 1321, 5135, 15, 1, 62, 1, 2, 32];
let k = 5;

function reverseatk(data, k) {
  let newarr = [];
  for (let a = k - 1; a >= 0; a--) {
    newarr.push(data[a]);
  }
  for (let i = k; i < data.length; i++) {
    newarr.push(data[i]);
  }

  return newarr;
}

let res = reverseatk(data, k);
console.log(res);
