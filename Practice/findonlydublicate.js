const array = [1, 2, 3, 2, 4, 5, 4, 5];
let dublicate = []

for(let i in array){
    for(let j in array){
        if(array[i] === array[j] && i !== j){
            if(!dublicate.includes(array[i])){
                dublicate.push(array[i])
                break
            }
        }
    }
}

console.log(dublicate)