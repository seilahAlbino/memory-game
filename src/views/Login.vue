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
      <button class="login-button" type="submit" @click.prevent="handleLogin">Login</button>
    </form>
    <h2><a href="#" class="anonym"  @click.prevent="playAnonymously">Play anonymously</a></h2>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { login } from "../data/user";

export default defineComponent({
  name: "Login",
  setup() {
    const username = ref("");
    const password = ref("");
    const router = useRouter();

    let error = ref<boolean>(false);

    const handleLogin = () => {
      // Add login logic (API call, validation, etc.)
      console.log(`Logging in: ${username.value}`)

      if(username.value === "" || password.value === "") {
        alert("Please enter username and password");
        return;
      }
      
      // Navigate to dashboard after successful login
      if(!login({name: username.value, password: password.value})){
        error.value = true;
        return;
      }  
      
      router.push({ name: "Dashboard" });
      
    };

    const playAnonymously = () => {
      // Navigate to dashboard directly
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
