let data = [1, 2, 215, 33, 2, 15, 3, 2, 1, 5, 23, 5, 5, 5, 6, 56, 5, 1, 1, 44, 55, 15, 5, 12, 5, 5, 6, 999, 6]


function primenum(data) {
    let myprime = []
    for (let i = 0; i < data.length; i++) {
        if (checkprimenumb(data[i])) {
            myprime.push(data[i])
        }
    }
    return myprime
}

function checkprimenumb(checkdata) {
    if (checkdata <= 1) return false
    for (j = 0; j <= Math.sqrt(checkdata); j++) {
        if (checkdata % 2 === 0) return false
    }
    return true
}

let res = primenum(data)
console.log(res)