const data = [1, [2], [3, 4, 5, 6, [7], [8], [[[[[[[[[[[9]]]]]]]]]]]]]

function shortdata(data){
    let newdata = []
    for(let arraydata of data){
        if(Array.isArray(arraydata)){
           newdata = newdata.concat(shortdata(arraydata))
        }
        else{
            newdata.push(arraydata)
        }
    }
    return newdata
}

let res = shortdata(data)
console.log(res);