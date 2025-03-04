let data = [1,321,21,32132,154,515,1,23135,15315,32,135,151,531,351,1]


function finprime(data){
    let primenumber = []
    let notprime = []
    for(let a = 0; a < data.length; a++){
        if(checkprime(data[a])){
            primenumber.push(data[a])
        }
        else{
            notprime.push(data[a])
        }
    }
    return {primenumber,notprime}
}

function checkprime(primenum){
    if(primenum === 1 ) return false
    for(let a = 0; a < Math.sqrt(primenum); a++ ){
        if(primenum % 2 === 0){
            return false
        }
    }
    return true
}

let res = finprime(data)
console.log(res)