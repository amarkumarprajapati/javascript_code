let data = [1,2,3,4,5,6,7,8,9]

let res = data.toReversed()

console.log(res)

function revarr(data){
    let revdata = []
    for(let a = data.length - 1; a >= 0; a-- ){
        revdata.push(data[a])
    }
    return revdata
}

let revres = revarr(data)
console.log(revres)