let data = [1, 2654, 35, 464, 51, 2, 351, 154];
let revdata = [];

function revassd(data) {
  for (let a = data.length - 1; a >= 0; a--) {
    revdata.push(data[a]);
  }

  revdata.sort((a, b) => a - b);
  return revdata;

}

let res = revassd(data);
console.log(res);
