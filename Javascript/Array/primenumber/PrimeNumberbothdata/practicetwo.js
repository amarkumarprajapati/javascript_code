let data = [13, 525135, 1313, 24513, 521, 21, 321, 1, 54648, 94, 65468, 6];

function primenumor(data) {
  let primenumberdata = [];
  let notprime = []
  for (let a = 0; a < data.length; a++) {
    if (twocheck(data[a])) {
      primenumberdata.push(data[a]);
    }else{
        notprime.push(data[a])
    }
  }
  return {primenumberdata,notprime};
}

function twocheck(primedata) {
  if (primedata < 1) return false;
  for (let a = 2; a <= Math.sqrt(primedata); a++) {
    if (primedata % 2 === 0) {
      return false;
    }
  }
  return true;
}

let {primenumberdata,notprime} = primenumor(data);
console.log('Prime Numbers:', primenumberdata);
console.log('Non-Prime Numbers:', notprime);
