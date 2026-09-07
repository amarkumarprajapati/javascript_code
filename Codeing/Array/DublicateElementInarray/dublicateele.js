let data = [1,2,4,5,6,5,1,1,455,2,5,84,1,2,3,54,4,8,66,1]

// Using Set (Simple & Fast)

// function removedublicate(dublicate){
//     return [...new Set(dublicate)]
// }

// console.log(removedublicate(data))


const fruits = ["apple", "banana", "apple", "mango","mango","mango"];

function removedublicate(arraydata){
      return arraydata.filter((item,index)=> arraydata.indexOf(item) === index)
}

console.log(removedublicate(fruits))