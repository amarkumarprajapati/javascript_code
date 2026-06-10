let data = [1,2,3]

// sum - 
let sum  = data.reduce((acc,curr)=>{
      return acc + curr
})

// console.log(sum)

// avg - 
let avg = data.reduce((acc,curr)=>{
    return acc + curr
})

let newavg = avg / data.length

// console.log(newavg)

// product - 

let product = data.reduce((acc,curr)=>{
    return acc * curr
})

// console.log(product)


// using loop  - 

function sumloop(data){
    let sum = 0
    for(let a = 0; a < data.length; a++){
        sum += data[a]
    }
    return sum
}
let sumres = sumloop(data)
// console.log(sumres)


function avgloop(data){
    let avg = 0
    for(let a = 0; a < data.length; a++){
        avg += data[a] / data.length
    }
    return avg
}

let avgres = avgloop(data)

// console.log(avgres)

function productloop(data){
    let product = 1
    for(let a = 0; a < data.length; a++){
        product = product * data[a]
    }
    return product
}

let productres = productloop(data)
console.log(productres)