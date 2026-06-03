let data = [1, 3, 5, 6, 8, 4, 5, 2, 5, 4, 6, 8, 4, 5, 2, 6, 8, 9, 5]

function bubblesort(newarray) {
    const n = newarray.length
    for (let a = 0; a < n - 1; a++) {
        for (let b = 0; b < n - a - 1; b++) {
            if (newarray[b] > newarray[b + 1]) {
                // swap
                [newarray[b], newarray[b + 1]] = [newarray[b + 1], newarray[b]];
            }
        }
    }
    return newarray
}

console.log(bubblesort(data))