let arraydata = [1, 2, 3, 4, 5, 6];
let k = 3;

function rotateRight(arr, k) {
    let n = arr.length;
    k = k % n; 

    if (k < 0) k += n; 

    let rotatedArr = [...arr.slice(-k), ...arr.slice(0, -k)];
    return rotatedArr;
}

console.log(rotateRight(arraydata, k)); 
