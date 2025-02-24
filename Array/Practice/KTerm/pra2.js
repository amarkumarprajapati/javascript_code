let data = [1,231,5,131,35,4,15,85,35,484,351,84,31,68,431,5,1,435,1,4]
let k = 6


function krev(data,k){
    let revk = []
   for(let a = data.length - 1 ; a >=k; a--){
       revk.push(data[a])
   }
   for(let a = k - 1 ; a>=0 ; a--){
      revk.push(data[a])
   }
   return revk
}

let res = krev(data,k)
console.log("res",res)