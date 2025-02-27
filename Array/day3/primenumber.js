let data = [
  135, 151516, 46, 8, 41534, 6854, 6484, 531231, 31, 35, 484, 684, 435, 5,
];

function isprimenumber(numberdata) {
  if (numberdata <= 1) return false;
  for (let a = 2; a <= Math.sqrt(numberdata); a++) {
    if (numberdata % a === 0) return false;
  }
  return true;
}

function primenumber(data) {
  let primenumbr = [];

  for (let a = 0; a < data.length; a++) {
    if (isprimenumber(data[a])) {
        primenumbr.push(data[a]);
    }
  }
  return primenumbr;
}

let res = primenumber(data);

console.log(res);
