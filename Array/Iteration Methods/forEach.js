// .forEach() is a method in JavaScript that lets you run a function on every element of an array, one by one.

// array.forEach(function(element, index, array) {

// });


let data = [1, 2, 3]


function foreachdata(data){
     let sum = 0
     data.forEach((element,index)=>{
        sum += element
     })
     return sum
}

let res = foreachdata(data)
console.log(res)




