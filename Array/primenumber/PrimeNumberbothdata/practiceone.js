let data = [2, 151, 3648, 531, 58, 354, 684, 531, 231, 15, 8448, 4, 51, 32, 0];

function primenum(data){
    let primenumberare = []
    for(let a = 0 ; a < data.length; a++){
         if(checkprime(data[a])){
            primenumberare.push(data[a])
         }
    }
    return primenumberare
}

function checkprime(primeornot){
    if(primeornot < 1) 
        return false
    for(let a = 0; a < Math.sqrt(primeornot); a++){
        if(primeornot % 2 === 0){
            return false
        }
    }
    return true
}

let res = primenum(data)
console.log(res)