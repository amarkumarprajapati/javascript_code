function squareRoot(num) {
  let i = 1;

  while (i * i <= num) {
    if (i * i === num) {
      return i;
    }
    i++;
  }

  return -1;
}

console.log(squareRoot(25)); // 5