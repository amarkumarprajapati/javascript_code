let arr = [5, 2, 1, 6, 9]

function checkdata(arr) {
    for (let a = 0; a < arr.length - 1; a++) {
        let minIndex = a;
        for (let b = a + 1; b < arr.length; b++) {
            if (arr[b] < arr[minIndex]) {
                minIndex = b;
            }
            
        }
        if (minIndex !== a) {
            [arr[a], arr[minIndex]] = [arr[minIndex], arr[a]];
        }
      
        // console.log(b)
    }
    return arr;

}

let res = checkdata(arr)
// console.log(res)