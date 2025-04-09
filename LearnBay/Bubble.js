class Solution {
    bubbleSort(arr) {
        for (let a = 0; a < arr.length; a++) {
            for (let b = 0; b < arr.length - a - 1; b++) {
                if (arr[b] > arr[b + 1]) {
                    let temp = arr[b];
                    arr[b] = arr[b + 1];
                    arr[b + 1] = temp;
                }
            }
        }
        return arr;
    }
}

let data = [1, 35, 151, 54, 58, 68, 53, 13, 516, 886, 263];
let solution = new Solution();
let sortedData = solution.bubbleSort(data);
console.log("Sorted Data:", sortedData);