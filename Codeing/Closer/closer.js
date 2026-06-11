function createbal(){
    let bal = 1000

    return {
        deposit(amount){
            bal += amount
        },

        getbal(){
            return bal
        }
    }
}

const account = createbal()

account.deposit(500)

console.log(account.getbal())