<template>
  <div class="dashboard">    
    <header>
      <h1>Welcome to the Dashboard</h1>
    </header>
    <a v-if="!isAnonymous" id="logout_button" @click.prevent="Logout">Logout</a>
    <div class="user-info">
      <div v-if="isAnonymous">
      <a @click.prevent="exitApp">Exit App</a>
        <header>You are playing anonymously and have limited access.</header>
      </div>
      <p v-else>Welcome, {{ loggedInUser }}</p>
      <p v-if="!isAnonymous">Coins: {{ coins }}</p>
    
    </div>
    <div class="scoreboard">
      <button  @click="goToScoreboard">
        View Scoreboard
      </button>
    </div>
    <div v-if="!isAnonymous" class="grid-size">
      <label for="grid-size">Select Grid Size:</label>
      <select id="grid-size" v-model="selectedGridSize">
        <option value="3x4">3x4</option>
        <option value="4x4">4x4</option>
        <option value="6x6">6x6</option>
      </select>
    </div>
    <div class="scoreboard">
      <button class="PlayButton" @click.prevent="triggerModal">
        Play Game
      </button>
    </div>
    <div class="scoreboard">
      <button
        v-if="!isAnonymous"
        class="GameHistoryButton"
        @click.prevent="goToHistory"
      >
        Game History
      </button>
    </div>
    <div class="notifications">
      <button
        v-if="!isAnonymous"
        class="NotificationsButton"
        @click.prevent="goToNotifications"
      >
        Notifications
      </button>
    </div>
    <footer>
      <button
        v-if="!isAnonymous"
        class="appSettings"
        @click.prevent="goToSettings"
      >
        App Settings
      </button>
    </footer>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Spend 1 Coin?</h2>
        <p>Are you sure you want to spend 1 coin to play this game?</p>
        <div class="modal-actions">
          <button @click="confirmPlayGame">Yes</button>
          <button @click="showModal = false">No</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import { isAnonymous, loggedInUser, coins } from "../auth"; // Import the auth state
import { logoutUser } from "@/auth";
import { removeCoins, getCoins } from "@/data/firebase";
import { getDatabase, get, ref as dbRef } from "firebase/database";

export default defineComponent({
  name: "Dashboard",
  setup() {
    const router = useRouter();
    const selectedGridSize = ref("3x4"); // Default value for grid size
    const showModal = ref(false);
    const user = ref<any>(null);
    
    
    const updateCoins = async () => {
        coins.value = await getCoins(loggedInUser.value);
        localStorage.setItem("coins",coins.value);
    }
    updateCoins()

    const triggerModal = () => {
      if (selectedGridSize.value !== "3x4") {
        showModal.value = true;
      } else {
        confirmPlayGame();
      }
    };


    const confirmPlayGame = async () => {
      if (selectedGridSize.value !== "3x4") {
        const success = await removeCoins(loggedInUser.value, 1);
        if (!success) {
          alert("You need at least 1 coin to play this game mode!");
          showModal.value = false;
          return;
        }
      }  
      showModal.value = false; // Close modal          
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
    const goToNotifications = () => {
      router.push({ name: "Notifications" });
    };

    async function getUser(name: string) {
      const db = getDatabase();
      const rootRef = ref(db);
      const userRef = dbRef(db, `users/${loggedInUser.value}`); // Path to the user in Realtime Database
      const snapshot = await get(userRef);
      
      if (!snapshot.exists()) {
        console.log("User not found");
        return null;
      }else{
        console.log("Database is populated:", snapshot.val());
      }
    };

    const Logout = () => {
      logoutUser();
      router.push("/");
    };

    const exitApp = () => {
      router.push("/");
    };

    return {
      isAnonymous,
      showModal,
      loggedInUser,
      confirmPlayGame,
      goToScoreboard,
      goToHistory,
      goToNotifications,
      coins,
      selectedGridSize,
      Logout,
      goToSettings,
      triggerModal,
      getUser,
      user,
      exitApp
    };
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

.GameHistoryButton, .NotificationsButton {
  background-color: white;
  color: black;
}

.GameHistoryButton:hover, .NotificationsButton:hover {
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

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  color: white;
}

.modal {
  background: #181818;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  width: 300px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal h2 {
  margin-top: 0;
}

.modal-actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.modal-actions button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
}

.modal-actions button:first-child {
  background-color: green;
  color: white;
}

.modal-actions button:first-child:hover {
  background-color: #0056b3;
}

.modal-actions button:last-child {
  background-color: white;
  color: black;
}

.modal-actions button:last-child:hover {
  background-color: #aaa;
}

#logout_button {
    color: white;
}
</style>
