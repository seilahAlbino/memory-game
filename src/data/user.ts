import { users } from "./users";

export default interface User {
    name: string;
    password: string;
}

export function login(user: User){
    return users.some(existingUser => existingUser.name === user.name && existingUser.password === user.password);
}