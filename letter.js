let data = ["dsvdsfv srv ewfv wef sd sdv sv wrg reb sdfv sbf srb te"]


let res = data[0]
    .split(' ')
    .map(letter => letter.charAt(0).toUpperCase() + letter.slice(1))
    .join(' ')

    console.log(res);