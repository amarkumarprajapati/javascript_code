interface product {
    id:Number,
    prodname:string,
    price:Number,
    desc:string
}

class prodcutorder implements product {
    id:Number;
    prodname:string;
    price:Number;
    desc:string

   constructor (id:Number, prodname:string, price:Number, desc:string){
    this.id = id;
    this.prodname = prodname;
    this.price = price
    this.desc = desc
   } 
}


let proddata: product = new prodcutorder(
    54,
    "sdfs",
    26,
    "asdfsfgd"
)

console.log(proddata)