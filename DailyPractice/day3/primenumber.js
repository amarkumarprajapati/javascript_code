let data = [135, 151516, 46, 8, 41534, 6854, 6484, 31, 35, 484, 684, 435, 5];

function primenumber(data) {
  let primenumbr = [];
  let nonprime = []

  for (let a = 0; a < data.length; a++) {
    if (isprimenumber(data[a])) {
      primenumbr.push(data[a]);
    }else{
      nonprime.push(data[a])
    }
  }
  return {primenumbr,nonprime}
}

function isprimenumber(numberdata) {
  if (numberdata <= 1) return false;
  for (let a = 2; a <= Math.sqrt(numberdata); a++) {
    if (numberdata % a === 0) return false;
  }
  return true;
}

let {primenumbr,nonprime} = primenumber(data);

console.log(primenumbr);
console.log(nonprime)





