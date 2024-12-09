<template>
  <div class="login">
    <h1>Memory Game</h1>
    <div v-if="error" class="error">
      <p>Invalid credentials, please try again.</p>
    </div>
    <form @submit.prevent="handleLogin">
      <div class="usernameDiv">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div class="passwordDiv">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button class="login-button" type="submit" @click.prevent="handleLogin">
        Login
      </button>
    </form>
    <h2>
      <a href="#" class="anonym" @click.prevent="playAnonymously"
        >Play anonymously</a
      >
    </h2>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { loginUser } from "../auth"; // Import the auth functions
import { canLogin, getCoins, getHistory } from "@/data/firebase";

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    let error = ref<boolean>(false);

    const handleLogin = async () => {
      if (username.value === "" || password.value === "") {
        alert("Please enter username and password");
        return;
      }

      const login = await canLogin({ name: username.value, password: password.value });

      if (!login) {
        error.value = true;
        return;
      }

      const coins = await getCoins(username.value);
      const history = await getHistory(username.value);

      loginUser(username.value, coins, false, history);
      router.push({ name: "Dashboard" });
    };
    
    const playAnonymously = () => {
      loginUser("Anonymous", 10, true);
      router.push({ name: "Dashboard" });
    };

    return { username, password, error, handleLogin, playAnonymously };
  },
});
</script>

<style scoped>
/* Add any login page specific styling here */
@import "../assets/login.css";
</style>
