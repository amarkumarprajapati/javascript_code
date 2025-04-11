let data = [1, 12341, 566468, 464, 6842, 354685, 468, 5, 465, 464, 658, 4684];

// sum of array

function sumofarrr(data) {
  let sum = 0;
  for (let a = 0; a < data.length; a++) {
    sum +=data[a];
  }
  return sum;
}

let res = sumofarrr(data);
console.log(res);
