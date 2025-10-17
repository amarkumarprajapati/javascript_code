let data = [1,2,3,4,5,1,2,3,4,5,6,1,2,3,5,6,6,1,2,3,]

// function checkdata(data) {
//     if (data <= 1) {
//         return false
//     }
//     else {
//         return true
//     }
// }

// console.log(checkdata(data)) 


// function timeout(data) {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             resolve(data + 1)
//         }, 3000)
//     })

// }

// // timeout(data).then((result) => console.log(result)); 
// console.log(timeout(data))

let frequecy = {}

for(let extarct of data){
    frequecy[extarct] = (frequecy[extarct] || 0) + 1
}


console.log(frequecy)




