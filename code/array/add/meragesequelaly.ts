let arr3: Array<number> = [5,6,5,12,2,4,8,5,6,2,6]
let arr4: Array<number> = [63,4,1,2,6,3,1,5,6]


function sumoftwo(arr1: number[] ,arr2: number[]){
   let newsum: number[] = []
   let maxlength = Math.max(arr1.length, arr1.length)
   for(let i = 0; i < maxlength; i++){
       let val1 = arr1[i] ?? 0
       let val2 = arr2[i] ?? 0
       newsum.push(val1 + val2)
   }

   return newsum
}

console.log(sumoftwo(arr3, arr4));