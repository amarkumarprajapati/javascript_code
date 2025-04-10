const data = [1, [2], [3, 4, 5, 6, [7], [8], [[[[[[[[[[[9]]]]]]]]]]]]];

function extractech(data) {
  let allarray = [];
  for (let eachdataelemnt of data) {
    if (Array.isArray(eachdataelemnt)) {
      allarray = allarray.concat(extractech(eachdataelemnt));
    } else {
      allarray.push(eachdataelemnt);
    }
  }
  return allarray;
}
let res = extractech(data);
console.log(res);
