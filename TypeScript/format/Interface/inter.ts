interface user {
    id: number;
    name: string;
    email: string;
    age: number;
}

class username implements user {
    id: number;
    name: string;
    email: string;
    age: number;

    constructor(id: number, name: string, email: string, age: number) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.age = age;
    }
}

let userdatanew: user = new username(
    56,
    "Amar",
    "amar@gmail.com",
    23
);

console.log(userdatanew);