const data = [1, [2], [3, 4, 5, 6, [7], [8], [[[[[[[[[[[9]]]]]]]]]]]]]


function extracteach(data){
    let singleelemnts = []
    for(let eachdata of data){
        if(Array.isArray(eachdata)){
            singleelemnts = singleelemnts.concat(extracteach(eachdata))
        }else{
            singleelemnts.push(eachdata)
        }
    }
    return singleelemnts
}

let res = extracteach(data)
console.log(res);