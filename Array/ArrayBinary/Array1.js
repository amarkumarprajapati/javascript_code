let data = [1,2,1,51,51,51,1,16,165,4,684]

function convert(data){
    let newbin = []
    for(let a = 0 ; a < data.length; a++ ){
       let binary = data[a].toString(2)
        newbin.push(binary)
    } 
    return newbin
}

let res = convert(data)
console.log(res)