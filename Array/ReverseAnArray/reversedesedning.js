let data = [1, 2, 3, 4, 5, 2, 4, 5, 2, 4, 5, 56, 6, 58, 8, 5];


for (let i = 0; i < data.length; i++) {
    for (let j = i + 1; j < data.length; j++) {
        if (data[i] > data[j]) {
            let temp = data[i]
            data[i] = data[j]
            data[j] = temp
        }

    }
}

console.log(data)