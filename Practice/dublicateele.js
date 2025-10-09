let data = [1, 2, 4, 5, 2, 1, 4, 1, 2, 3, 4, 5, 8, 9, 5, 4, 1, 2, 5, 6, 4, 9, 8]
let duplicates = []


for (let i in data) {
    for (let j in data) {
        if (data[i] === data[j] && i !== j) {
            if (!duplicates.includes(data[j])) {
                duplicates.push(data[i])
                break
            }

        }
    }
}

duplicates.sort((a, b) => b - a)

console.log(duplicates)