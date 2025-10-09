const data = [1, [2], [3, 4, 5, 6, [7], [8], [[[[[[[[[[[9]]]]]]]]]]]]]

function extractElements(nestedArray) {
    let result = [];
    for (let element of nestedArray) {
        if (Array.isArray(element)) {
          
        } else {
            result.push(element);
        }
    }
    return result;
}


const flattenedData = extractElements(data);
console.log(flattenedData);