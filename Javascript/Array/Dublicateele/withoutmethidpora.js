let data = [1, 2, 4, 5, 4, 6, 5, 1, 1]



function dublicateeach(newarr) {
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

console.log(dublicateeach(data))