let data = [1, 21, 321315, 21321, 5, 54686845, 34684];
let k = 2;

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
