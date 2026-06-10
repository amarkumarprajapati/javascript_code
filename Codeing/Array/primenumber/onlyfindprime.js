let data = [2, 151, 3648, 531, 58, 354, 684, 531, 231, 15, 8448, 4, 51, 32, 0];

function findprime(data) {
  let primenum = [];
  for (let a = 0; a < data.length; a++) {
    if (checkprime(data[a])) {
      primenum.push(data[a]);
    }
  }
  return primenum;
}

function checkprime(checkdata) {
  if (checkdata <= 1) return false;
  for (let a = 2; a <= Math.sqrt(checkdata); a++) {
    if (checkdata % 2 === 0) {
      return false;
    }
  }
  return true;
}

let res = findprime(data);
console.log(res);
