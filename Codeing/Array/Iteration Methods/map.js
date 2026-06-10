// Using map - 

let data = [1,2,3,4,5,6,7,8,9]

let res = data.map((item)=> item * 5)
console.log(res)

// using for loop - 


function withoutmethod(){
    let output = []
    for(let a = 0; a < data.length; a++){
        output.push(data[a] * 5)
    }
    return output
}

let check = withoutmethod(data)
console.log(check)