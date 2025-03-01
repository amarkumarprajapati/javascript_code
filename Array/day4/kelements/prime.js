let data = [1, 2, 3, 54, 5465, 456, 484, 2, 1, 21, 5, 4, , 8, 874, 8];

function ktermdata(data) {
  let finalk = [];
  let notprime = [];
  for (let a = 0; a < data.length; a++) {
    if (checkprime(data[a])) {
      finalk.push(data[a]);
    } else {
      notprime.push(data[a]);
    }
  }
  return { finalk, notprime };
}

function checkprime(letcheck) {
  if (letcheck <= 1) return false;
  for (let a = 2; a <= Math.sqrt(letcheck); a++) {
    if (letcheck % a === 0) return false;
  }
  return true;
}

let { finalk, notprime } = ktermdata(data);
console.log("prime", finalk);
console.log("not prime", notprime);
