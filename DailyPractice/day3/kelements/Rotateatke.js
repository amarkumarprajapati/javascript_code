let data = [1, 21, 155, 21, 554, 56, 35, 3, 61, 5, 1, 5, 4, 12, 1, 4, 8];
let k = 7;

function kterm(data, k) {
  let newkterm = [];
  for (let a = data.length - 1; a >= k - 1; a--) {
    newkterm.push(data[a]);
  }
  for (let a = 0; a < k; a++) {
    newkterm.push(data[a]);
  }
  return newkterm;
}

let res = kterm(data, k);
console.log(res);
