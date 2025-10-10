// first 50 prime number

function prime(tocheck) {
    if (tocheck <= 1) return false;
    if (tocheck <= 3) return true;
    if (tocheck % 2 === 0 || tocheck % 3 === 0) return false;
    for (let a = 5; a * a <= tocheck; a += 6) {
      if (tocheck % a === 0 || tocheck % (a + 2) === 0) return false;
    }
    return true;
  }
  
  function firstNPrimes(n) {
    const primes = [];
    let num = 2;
    while (primes.length < n) {
      if (prime(num)) {
        primes.push(num);
      }
      num++;
    }
    return primes;
  }
  
  const first50Primes = firstNPrimes(10);
  console.log(first50Primes);
  