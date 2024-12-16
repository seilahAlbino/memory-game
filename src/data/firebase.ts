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

export async function addVictoryToHistory(name: string, gridSize: string, time: number, turns: number) {
  const victory = {
    date: new Date().toISOString(),
    gridSize: gridSize,
    time: time,
    turns: turns
  };

  const userSnapshot = await getUser(name);

  if(!userSnapshot){
    return 0;
  }

  const currentHistory = userSnapshot.exists() ? userSnapshot.val().history || [] : [];
  currentHistory.push(victory);

  const userRef = ref(db, `users/${name}/history`);
  set(userRef, currentHistory);
}

export async function getHistory(name: string) {
    const userSnapshot = await getUser(name);
    if(!userSnapshot){
        return 0;
    }
    const currentHistory = userSnapshot.exists() ? userSnapshot.val().history || [] : [];

    return currentHistory;
}

export async function getTopScoresFromUser(gridSize: string, name: string): Promise<{ bestTimes: any[], bestTurns: any[] }> {
  const userSnapshot = await getUser(name);
  if(!userSnapshot){
      return { bestTimes: [], bestTurns: [] };
  }

  const currentHistory = userSnapshot.exists() ? userSnapshot.val().history || [] : [];


    const filteredHistory = currentHistory.filter((victory: any) => victory.gridSize === gridSize);

  // Sort and slice for best times
  const bestTimes = [...filteredHistory]
    .sort((a: any, b: any) => a.time - b.time)
    .slice(0, 3);

  // Sort and slice for best turns
  const bestTurns = [...filteredHistory]
    .sort((a: any, b: any) => a.turns - b.turns)
    .slice(0, 3);

  return { bestTimes, bestTurns };
  //const topScores = currentHistory.filter((victory: any) => victory.gridSize === gridSize).sort((a: any, b: any) => a.time - b.time).slice(0, 3);

  //return topScores;
}


export async function getGlobalScores(gridSize: string, type: 'time' | 'turns'): Promise<any[]> {
  const usersRef = ref(db, `users`);
  const snapshot = await get(usersRef);

  if (!snapshot.exists()) {
      return [];
  }

  const usersData = snapshot.val();
  let allScores: any[] = [];

  for (const username in usersData) {
      const history = usersData[username].history || [];
      const filteredScores = history.filter((game: any) => game.gridSize === gridSize).map((game: any) => ({
        ...game,
        username,
      }));

      allScores = allScores.concat(filteredScores);
  }

  return allScores.sort((a, b) => {
    if (type == 'time') return a.time - b.time;
    return a.turns - b.turns;
  });
}

export async function getCoins(name: string): Promise<number>{
    const userSnapshot = await getUser(name);

    if(!userSnapshot){
        return 0;
    }

    const userData = userSnapshot.val();

    return userData.coins;
}

export async function addCoins(name: string, amount: number): Promise<boolean> {
    const userSnapshot = await getUser(name);
    if (!userSnapshot) {
        return false; 
    }

    const currentCoins = userSnapshot.val().coins;
    const newCoins = currentCoins + amount;

    const userRef = ref(db, `users/${name}/coins`);
    await set(userRef, newCoins);

    return true;
}

export async function removeCoins(name: string, amount: number): Promise<boolean> {
  const userSnapshot = await getUser(name);

  if (!userSnapshot) {
    return false; 
  }

  const userData = userSnapshot.val();
  const currentCoins = userData.coins;

  if (currentCoins < amount) {
    return false;
  }

  const newCoins = currentCoins - amount;

  const userRef = ref(db, `users/${name}/coins`);
  await set(userRef, newCoins);

  return true;
}

export async function addNotification(name: string, message: string) {
  const notification = {
    date: new Date().toISOString(),
    message: message,
    readed: false
  };

  const userSnapshot = await getUser(name);

  if(!userSnapshot){
    return 0;
  }

  const currentNotifications = userSnapshot.exists() ? userSnapshot.val().notifications || [] : [];
  currentNotifications.push(notification);

  const userRef = ref(db, `users/${name}/notifications`);
  set(userRef, currentNotifications);
}

export async function getNotifications(name: string) {
  const userSnapshot = await getUser(name);
  if(!userSnapshot){
      return 0;
  }
  const currentNotifications = userSnapshot.exists() ? userSnapshot.val().notifications || [] : [];

  return currentNotifications;
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

export async function buyCoins(name: string, coins: number): Promise<boolean> {
  const userSnapshot = await getUser(name);

  if(!userSnapshot){
      return false;
  }

  const userData = userSnapshot.val();

  const currentCoins = userData.coins || 0;
  const newCoins = currentCoins + coins;

  const coinsRef = ref(db, `users/${name}/coins`);
  const buyCoinsRef = ref(db, `users/${name}/buyCoins`);

  await set(coinsRef, newCoins);
  await set(buyCoinsRef, 0);
  
  return true;
}

export async function getUserRef(name: string) {
  return ref(db, `users/${name}/buyCoins`);
}

export async function areNotificationsEnabled(name: string): Promise<boolean> {
  const userSnapshot = await getUser(name);

  if (!userSnapshot) {
      return false;
  }

  const userData = userSnapshot.val();

  return userData.getNotifications !== undefined ? userData.getNotifications : true;
}
