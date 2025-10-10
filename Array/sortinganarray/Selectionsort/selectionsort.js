let data = [1, 3, 5, 6, 8, 4, 5, 2, 5, 4, 6, 8, 4, 5, 2, 6, 8, 9, 5]


function selectionsort(arr) {
    let n = arr.length
    for (let a = 0; a < n - 1; a++) {
        let minn = a

        for (let b = a + 1; b < n; b++) {
            if (arr[b] < arr[minn]) {
                minn = b
            }
        }
        if (minn !== a) {
            [arr[a], arr[minn]] = [arr[minn], arr[a]]
        }
    }


    return arr
}

console.log(selectionsort(data))