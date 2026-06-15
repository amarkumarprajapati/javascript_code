// prototype

function letcreateuser(name){
       return {
         name,
         greet(){
            return "how are you?"
         }

       }
}

const uname = letcreateuser("amar")
const uname2 = letcreateuser("john")
console.log(uname.greet())
console.log(uname2.greet())