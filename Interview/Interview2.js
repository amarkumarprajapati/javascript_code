// let str = ["india won world cup sdvs sev eedewded ewd edwed ed fwedf sdvcsd evevev"];
// let capitalized = str[0] 
//     .split(' ') 
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
//     .join(' ');

// console.log(capitalized);



// let data = ["dsv svesvef efewffs dv sdv svwefwef sefsefsefsvs v ssdvsdvds"]
// let upperletter = data[0]
//     .split(' ')
//     .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ')

// console.log(upperletter)    



let data = ["vfdsvv efe asdc dv sdv svsd vsdv sdv eaf ef cvadsv sdv sef efcsev sefqewd adscvdv"]

let res = data[0]
   .split(' ')
   .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1))
   
   .join(' ')
   
   console.log(res);