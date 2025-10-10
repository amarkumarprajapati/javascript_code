let data = [64654, 464, 65412, 5415, 44, 46, 13, 11, 354, 31, 3, 5351];

function primenum(data) {
  let primenumor = [];
  let not_prime = [];
  for (let a = 0; a < data.length; a++) {
    if (checkprimeor(data[a])) {
      primenumor.push(data[a]);
    } else {
      not_prime.push(data[a]);
    }
  }
  return { primenumor, not_prime };
}

function checkprimeor(testprime) {
  if (testprime < 1) return false;
  for (let a = 2; a < Math.sqrt(testprime); a++) {
    if (testprime % 2 === 0) {
      return false;
    }
  }
  return true;
}

let { primenumor, not_prime } = primenum(data);

console.log("prime", primenumor);
console.log("not", not_prime);
