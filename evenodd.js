let data = [1, 2, 3, 4, 56, 7, 89, 56];

function oddeven() {
  let even = [];
  let odd = [];
  for (let a = 0; a < data.length; a++) {
    if (data[a] % 2 === 0) {
      even.push(data[a]);
    } else {
      odd.push(data[a]);
    }
  }


  return { even, odd };
  
}

let result = oddeven(data);

console.log("result", result);
