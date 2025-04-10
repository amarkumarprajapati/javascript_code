let data = ["aesdveg wrgver rgwef wcs dvsvwrf wf rwgersf vrvegrf erg vfv er rg esc5 6"]

let res = data[0]
    .split(' ')
    .map(singlewords => singlewords.charAt(0).toLocaleUpperCase() + singlewords.slice(1)) 
    .join(' ')

console.log(res);