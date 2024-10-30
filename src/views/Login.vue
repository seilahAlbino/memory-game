<template>
  <div class="login">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <div class="usernameDiv">
        <label for="username">Username</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div class="passwordDiv">
        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button class="login-button" type="submit">Login</button>
    </form>
    <h3><a href="#">Play anonymously</a></h3>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");

    const handleLogin = () => {
      // Add login logic (API call, validation, etc.)
      console.log(`Logging in: ${username.value}`);
    };

    return { username, password, handleLogin };
  },
});
</script>

<style scoped>
/* Add any login page specific styling here */
@import "../assets/login.css";
</style>
