let data = [1, 35, 13515, 4655, 1354, 68435, 54, 4684, 8486, 684, 8, 46846];

function revers(data) {
  let revserarr = [];
  for (let i = data.length - 1; i >= 0; i--) {
    revserarr.push(data[i]);
  }
  revserarr.sort((main, data) => data - main);
  console.log("revserarr", revserarr);
  return revserarr;
}

let res = revers(data);
// console.log(res);
