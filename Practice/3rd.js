let data = ['ewv wefwef wef wef ewfwef sdvs wefwe fvr rvrv']

let res = data[0]
    .split(' ')
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1))
    .join(' ')


console.log(res);    