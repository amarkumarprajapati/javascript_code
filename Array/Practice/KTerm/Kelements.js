let data = [13, 135, 11, 123, 551, 31, 5, 351, 54, 84635, 18, 46, 584];

let k = 7;

function getkele(data, k) {
  let revdata = [];
  for (let a = data.length - 1; a >= k - 1; a--) {
    revdata.push(data[a]);
  }

  for (let a = k - 2; a >= 0; a--) {
    revdata.push(data[a]);
  }
  return revdata;
}

let res = getkele(data, k);
console.log(res);
