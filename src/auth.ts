// src/auth.ts

import { ref } from "vue";

// Store the logged-in user's information and login state
export const isLoggedIn = ref(false);
export const isAnonymous = ref(false);
export const loggedInUser = ref<string | null>(null);
export const coins = ref(0);

export function loginUser(username: string, anonymous = false) {
  isLoggedIn.value = true;
  isAnonymous.value = anonymous;
  loggedInUser.value = username;
}

export function logoutUser() {
  isLoggedIn.value = false;
  isAnonymous.value = false;
  loggedInUser.value = null;
}
