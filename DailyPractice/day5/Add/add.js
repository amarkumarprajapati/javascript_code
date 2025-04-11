// let data = [154, 154132, 43, 2314, 1, 245, 135, 64, 351, 14];
// let data1 = [1, 354, 354, 1354, 531, 54, 5, 11, 13, 15, 212];

// let res = (data, data1) => {
//   let newarr = []
//   let mergedata = Math.max(data.length, data1.length);
//   for (let a = 0; a < mergedata; a++) {
//     if(a <data.length){
//         newarr.push(data[a])
//     }
//     if(a < data1.length){
//         newarr.push(data1[a])
//     }

//   }
//   return newarr
// };

// res(data, data1);

// console.log(res);


let data = [154, 154132, 43, 2314, 1, 245, 135, 64, 351, 14];
let data1 = [1, 354, 354, 1354, 531, 54, 5, 11, 13, 15, 212];

let res = (data, data1) => {
  let newarr = [];
  let mergedata = Math.max(data.length, data1.length);
  for (let a = 0; a < mergedata; a++) {
    if (a < data.length) {
      newarr.push(data[a]);
    }
    if (a < data1.length) {
      newarr.push(data1[a]);
    }
  }
  return newarr;
};

console.log(res(data, data1));
