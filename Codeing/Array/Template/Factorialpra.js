let data = [1,2,3,4,5,6,7,8,9];

function fact(num) {
  if (num === 0 || num === 1) {
    return 1;
  }
  return num * fact(num - 1);
}

function check(factorialdata) {
  return factorialdata.map(fact);
}

let final = check(data);

console.log(final);


