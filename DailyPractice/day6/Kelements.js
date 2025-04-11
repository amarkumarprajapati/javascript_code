let data = [1,6,5,3,5,1,8,4,8,8,];

function findMissingNumbers(data) {
  let missingNumbers = [];
  for (let i = 0; i < data.length - 1; i++) {
    let diff = data[i + 1] - data[i];
    if (diff > 1) {
      for (let j = 1; j < diff; j++) {
        missingNumbers.push(data[i] + j);
      }
    }
  }
  return missingNumbers;
}

let res = findMissingNumbers(data);
console.log(res); 
