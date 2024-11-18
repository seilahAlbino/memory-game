// src/auth.ts

import { ref } from "vue";

// Reactive state for login
export const isLoggedIn = ref(false);
export const isAnonymous = ref(false);
export const loggedInUser = ref<string | null>(null);
export const coins = ref(0);
export const gameHistory = ref<Array<{ date: string; boardSize: string; time: number, turns: number }>>([]);


// Check localStorage on app load to set initial values
export function loadAuthState() {
  const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const storedIsAnonymous = localStorage.getItem("isAnonymous") === "true";
  const storedUser = localStorage.getItem("loggedInUser");
  const storedCoins = Number(localStorage.getItem("coins")) || 0;
  const storedHistory = JSON.parse(localStorage.getItem("gameHistory") || "[]");

  isLoggedIn.value = storedIsLoggedIn;
  isAnonymous.value = storedIsAnonymous;
  loggedInUser.value = storedUser;
  coins.value = storedCoins;
  gameHistory.value = storedHistory;
}

export function loginUser(username: string, initialCoins: number, anonymous = false, history: Array<{ date: string; boardSize: string; time: number, turns: number }> = []) {
  isLoggedIn.value = true;
  isAnonymous.value = anonymous;
  loggedInUser.value = username;
  coins.value = initialCoins;
  gameHistory.value = history;

  // Save to localStorage
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("isAnonymous", anonymous.toString());
  localStorage.setItem("loggedInUser", username);
  localStorage.setItem("coins", initialCoins.toString());
  localStorage.setItem("gameHistory", JSON.stringify(history));
}

export function logoutUser() {
  isLoggedIn.value = false;
  isAnonymous.value = false;
  loggedInUser.value = null;
  coins.value = 0;
  gameHistory.value = [];

  // Clear from localStorage
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("isAnonymous");
  localStorage.removeItem("loggedInUser");
  localStorage.removeItem("coins");
  localStorage.removeItem("gameHistory");
}
