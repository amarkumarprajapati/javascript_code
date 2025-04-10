const data = [1, [2], [3, 4, 5, 6, [7], [8], [[[[[[[[[[[9]]]]]]]]]]]]]


function allelemnts(data){
    let singledata  = []
    for(let eachelement of data){
        if(Array.isArray(eachelement)){
            singledata = singledata.concat(allelemnts(eachelement))
        }else{
            singledata.push(eachelement)
        }
    }
    return singledata
}

let res = allelemnts(data)
console.log(res);