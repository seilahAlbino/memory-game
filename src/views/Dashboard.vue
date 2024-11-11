<template>
  <div class="dashboard">
  <a v-if="!isAnonymous" id="logout_button" @click.prevent="Logout">Logout</a>
    <header>
      <h1>Welcome to the Dashboard</h1>
    </header>
    <div class="user-info">
      <p v-if="isAnonymous">
        You are playing anonymously and have limited access.
      </p>
      <p v-else>Welcome, {{ loggedInUser }}</p>
      <p v-if="!isAnonymous">Coins: {{ coins }}</p>
    </div>
    <div class="scoreboard">
      <button  v-if="!isAnonymous" @click="goToScoreboard">View Scoreboard</button>
    </div>

    <div  v-if="!isAnonymous"  class="grid-size">
      <label for="grid-size">Select Grid Size:</label>
      <select id="grid-size" v-model="selectedGridSize">
        <option value="3x4">3x4</option>
        <option value="4x4">4x4</option>
        <option value="6x6">6x6</option>
      </select>
    </div>
    <div class="scoreboard">
      <button class="PlayButton" @click.prevent="startGame">Play Game</button>
    </div>
    <div class="scoreboard">
      <button  v-if="!isAnonymous" class="GameHistoryButton" @click.prevent="goToHistory">
        Game History
      </button>
    </div>
    <footer>
    <button v-if="!isAnonymous" class="appSettings" @click.prevent="goToSettings">App Settings</button>
    </footer>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed,ref } from "vue";
import { useRouter } from "vue-router";
import { isAnonymous, loggedInUser, coins } from "../auth"; // Import the auth state
import {logoutUser} from "../auth";

export default defineComponent({
  name: "Dashboard",
  setup() {

    const router = useRouter();
    const selectedGridSize = ref("3x4"); // Default value for grid size
    console.log(isAnonymous);
    const startGame = () => {
     router.push({
        name: "Game",
        params: { gridSize: selectedGridSize.value },
      });
    };
    const goToScoreboard = () => {
      router.push({ name: "Scoreboard" });
    };
    const goToHistory = () => {
      router.push({ name: "GameHistory" });
    };
    const goToSettings = () => {
      router.push({ name: "GameSettings" });
    };

    const Logout = () => {
      logoutUser();
      router.push("/");
    };

    return { isAnonymous, loggedInUser, startGame, goToScoreboard,goToHistory, coins,selectedGridSize, Logout,goToSettings};
  },
});
</script>

<style scoped>
.dashboard {
  text-align: center;
  padding: 20px;
}

.buttons {
  display: flex;
  flex-direction: column;
  width: 35%;
  justify-content: center;
  margin-left: 32%;
  margin-top: 5%;
}



header h1 {
  font-size: 1.5em;
}

.user-info,
.game-mode,
.scoreboard {
  margin: 20px 0;
}

label {
  display: block;
  margin-bottom: 10px;
}

select {
  width: 100%;
  padding: 10px;
  font-size: 1em;
}

button {
  width: 100%;
  padding: 10px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

a {
  text-decoration: none;
  color: white;
}

a:hover {
  text-decoration: underline;
  color: white;
}

.PlayButton {
  background-color: green;
}

.PlayButton:hover {
  background-color: darkgreen;
}

button:hover {
  background-color: #0056b3;
}

.GameHistoryButton {
  background-color: white;
  color: black;
}

.GameHistoryButton:hover {
  background-color: #ccc;
  color: black;
}

@media (min-width: 600px) {
  .dashboard {
    max-width: 600px;
    margin: 0 auto;
  }

  header h1 {
    font-size: 2em;
  }

  select,
  button {
    width: auto;
  }
}
</style>
