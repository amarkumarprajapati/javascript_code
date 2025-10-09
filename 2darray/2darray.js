const array = [1,2,3,4,5,6,7,8,9]
// const newarr = [[1,2,3],[4,5,6],[7,8,9]]

function twodarr (array,size){
    let newarray = []
    for(let a = 0; a < array.length; a += size ){
        newarray.push(array.slice(a, a + size))
    }
    return newarray
}

console.log(twodarr(array,3))