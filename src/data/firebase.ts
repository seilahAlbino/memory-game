import { initializeApp } from "firebase/app";
import { Database, getDatabase, ref, set, get, DataSnapshot } from "firebase/database";
import type User from "./user";

const firebaseConfig = {
    apiKey: "AIzaSyCq_3e8CN3Q_NIPvtsL0EOlmCrUZSUppxM",
    authDomain: "memory-game-a5cf1.firebaseapp.com",
    databaseURL: "https://memory-game-a5cf1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "memory-game-a5cf1",
    storageBucket: "memory-game-a5cf1.firebasestorage.app",
    messagingSenderId: "624773553627",
    appId: "1:624773553627:web:3a7d1bc8dbcc2843059bfe",
    measurementId: "G-BN43ZVNH1B"
};


const app = initializeApp(firebaseConfig);
const db = getDatabase(app); 

function createUser(name: string, password: string, coins: number){
  let userRef = ref(db, `users/${name}`);
  set(userRef, {
    password: password,
    coins: coins
  })
}

async function getUser(name: string): Promise<DataSnapshot | null> {
  const userRef = ref(db, `users/${name}`);
  const user = await get(userRef);

  if (!user.exists()) {
    return null;
  }

  return user;
}

export async function getCoins(name: string): Promise<number>{
    const userSnapshot = await getUser(name);

    if(!userSnapshot){
        return 0;
    }

    const userData = userSnapshot.val();

    return userData.coins;
}

export async function canLogin(user: User): Promise<boolean>{
    const userSnapshot = await getUser(user.name);

    if(!userSnapshot){
        return false;
    }

    const userData = userSnapshot.val();
    if (userData.password !== user.password) {
        return false;
    } 

    return true;
}