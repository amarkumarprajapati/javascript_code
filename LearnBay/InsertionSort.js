let arr = [525, 2211, 148, 66854, 9654]

function checkdata(arr) {
    for (let a = 0; a < arr.length; a++) {
        let key = arr[a]
        let j = a - 1
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key
    }
    return arr
}

let res = checkdata(arr)
console.log(res)