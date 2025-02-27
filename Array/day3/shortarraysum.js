let data = [1, 2, 315, 135, 15, 41135, 456, 1, 52, 15];

function sortarr(data) {
  let sortdata = [];
  for (let a = data.length - 1; a >= 0; a--) {
    sortdata.push(data[a]);
  }
  sortdata.sort((main, sortdata) => main - sortdata);

  return sortdata;
}

let res = sortarr(data);
console.log(res);
