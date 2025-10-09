const array = [1, 2, 3, 2, 4, 5, 4, 5];
let duplicates = [];

for (let i in array) {
    for (let j in array) {
        if (array[i] === array[j] && i !== j) {
            if (!duplicates.includes(array[i])) {
                duplicates.push(array[i]);
                break; 
            }
        }
    }
}

console.log(duplicates); 