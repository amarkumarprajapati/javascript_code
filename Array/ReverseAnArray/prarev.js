let data = [1, 3, 5, 458, 6, 3, 15, 3];

function pract(data) {
  let revarr = [];
  for (let a = data.length - 1; a >= 0; a--) {
    revarr.push(data[a]);
  }
  return revarr;
}
let res = pract(data);
console.log("res", res);
