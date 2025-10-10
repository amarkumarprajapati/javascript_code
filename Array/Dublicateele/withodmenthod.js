let data = [1, 2, 4, 5, 6, 5, 1, 1, 455, 2, 5, 84, 1, 2, 3, 54, 4, 8, 66, 1]


function removedublicate(newarr) {
    let unique = []
    let isduclate

    for (let a = 0; a < newarr.length; a++) {
        isduclate = false

        for (let b = 0; b < unique.length; b++) {
            if (newarr[a] === unique[b]) {
                isduclate = true
                break
            }
        }
        if (!isduclate) {
            unique[unique.length] = newarr[a]
        }

    }
    return unique
}

console.log(removedublicate(data))