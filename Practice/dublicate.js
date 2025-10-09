const array = [1, 5, 4, 8, 8, 4, 5, 4, 5, 10, 45, 45, 2, 10];
let dublicate = []

for(let i in array){
    for(let j in array){
        if(array[i] === array[j] && i != j){
            if(!dublicate.includes(array[i])){
                dublicate.push(array[j])
                break
            }
        }
    }
}

// bubble sort




console.log(dublicate)
