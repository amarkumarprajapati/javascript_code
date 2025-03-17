data = [1, 2, 3, 4, 5, 6, 7, 8]


function reverse(data) {
    let reverse = []
    let skipdatasum = []
    let odd = []
    for (let a = data.length - 1; a >= 0; a--) {
        let sumdata = data[a] * 2
        reverse.push(sumdata)
    }

    for (let i = 0; i < reverse.length; i++) {
        if (reverse[i] % 2 === 0) {
            skipdatasum.push(reverse[i])
        } else {
            odd.push(reverse[i])
        }
    }
    return { reverse, skipdatasum, odd }
}

let res = reverse(data)
console.log(res)


