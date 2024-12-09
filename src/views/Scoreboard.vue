<template>
  <div class="container">
    <button class="home" @click="goToDashboard">Home</button>
    <h1>Scoreboard</h1>

    <div class="controls">
      <div class="gridSizeContainer">
        <label for="grid-size">Select Grid Size:</label>
        <select id="grid-size" v-model="selectedGridSize" @change="updateScores">
          <option value="3x4">3x4</option>
          <option value="4x4">4x4</option>
          <option value="6x6">6x6</option>
        </select>
      </div>
      <button v-if="!isAnonymous" class="personalScores" @click="toggleTable('personal')">Personal Scores</button>
      <button class="globalScores" @click="toggleTable('global')">Global Scores</button>
    </div>

    <div class="table-container">
      <div class="personal" v-if="showTable === 'personal' && Array.isArray(sortedScores)">
        <table v-if="sortedScores.length && !isAnonymous">
          <thead>
            <tr>
              <th @click="sortBy('date')">Date {{ getSortIcon('date') }}</th>
              <th>Board Size</th>
              <th @click="sortBy('time')">Time {{ getSortIcon('time') }}</th>
              <th @click="sortBy('turns')">Turns {{ getSortIcon('turns') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(game, index) in sortedScores" :key="index">
              <td>{{ formatDate(game.date) }}</td>
              <td>{{ game.gridSize }}</td>
              <td>{{ game.time }} s</td>
              <td>{{ game.turns }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>{{ noGamesMessage }}</p>
      </div>

      <div class="global">
        <div v-if="!Array.isArray(sortedScores)">
          <h2>Top Scores (Turns)</h2>
          <table v-if="sortedScores.turns.length">
            <thead>
              <tr>
                <th>Player</th>
                <th @click="sortBy('date')">Date {{ getSortIcon('date') }}</th>
                <th>Board Size</th>
                <th @click="sortBy('turns')">Turns {{ getSortIcon('turns') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(game, index) in sortedScores.turns" :key="index">
                <td>{{ game.username }}</td>
                <td>{{ formatDate(game.date) }}</td>
                <td>{{ game.gridSize }}</td>
                <td>{{ game.turns }}</td>
              </tr>
            </tbody>
          </table>
          <p v-else>No scores available.</p>

          <h2>Top Scores (Time)</h2>
          <table v-if="sortedScores.times.length">
            <thead>
              <tr>
                <th>Player</th>
                <th @click="sortBy('date')">Date {{ getSortIcon('date') }}</th>
                <th>Board Size</th>
                <th @click="sortBy('time')">Time {{ getSortIcon('time') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(game, index) in sortedScores.times" :key="index">
                <td>{{ game.username }}</td>
                <td>{{ formatDate(game.date) }}</td>
                <td>{{ game.gridSize }}</td>
                <td>{{ game.time }} s</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p v-if="showTable === 'global' && !Array.isArray(sortedScores) && !sortedScores.times.length && !sortedScores.turns.length">
          {{ noGamesMessage }}
        </p>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { isAnonymous, loggedInUser, coins } from "../auth"; // Import the auth state
import { getTopScoresFromUser, getGlobalScores } from "@/data/firebase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Scoreboard",
  setup() {
    const router = useRouter();
    const selectedGridSize = ref("3x4");
    const showTable = ref<string | null>("global");
    const gameHistory = ref([]);
    const timeGlobalScores = ref<any[]>([]);
    const turnsGlobalScores = ref<any[]>([]);
    const noGamesMessage = ref("No games available.");
    const currentSort = ref<string | null>(null);
    const sortOrder = ref("asc");
    const user = ref<any>(null);

    onMounted(() => {
      updateScores();
    });

    const updateScores = async () => {
      try {
        if (!loggedInUser.value) throw new Error("User not logged in!");

        let [personalScores, timeScores, turnScores] = await Promise.all([
          getTopScoresFromUser(selectedGridSize.value, loggedInUser.value),
          getGlobalScores(selectedGridSize.value, 'time'),
          getGlobalScores(selectedGridSize.value, 'turns')
        ]);

        timeScores = timeScores.slice(0, 3);
        turnScores = turnScores.slice(0, 3);

        gameHistory.value = personalScores;
        timeGlobalScores.value = timeScores;
        turnsGlobalScores.value = turnScores;
      } catch (error) {
        console.error("Error fetching scores:", error);
        noGamesMessage.value = "Error fetching scores.";
      }
    };

    const sortBy = (key: string) => {
      sortOrder.value = currentSort.value === key && sortOrder.value === "asc" ? "desc" : "asc";
      currentSort.value = key;
    };

    type GameScore = {
      date: string;
      gridSize: string;
      time: number;
      turns: number;
      username?: string;
    };

    type SortedScores =
      | GameScore[]
      | {
          times: GameScore[];
          turns: GameScore[];
        };

    const sortedScores = computed<SortedScores | []>(() => {
      if (showTable.value === "global") {
        const sortedTimeScores = [...timeGlobalScores.value].sort((a, b) => {
          const fieldA = currentSort.value === "date" ? new Date(a[currentSort.value]).getTime() : a[currentSort.value || ""];
          const fieldB = currentSort.value === "date" ? new Date(b[currentSort.value]).getTime() : b[currentSort.value || ""];
          return sortOrder.value === "asc" ? fieldA - fieldB : fieldB - fieldA;
        });

        const sortedTurnScores = [...turnsGlobalScores.value].sort((a, b) => {
          const fieldA = currentSort.value === "date" ? new Date(a[currentSort.value]).getTime() : a[currentSort.value || ""];
          const fieldB = currentSort.value === "date" ? new Date(b[currentSort.value]).getTime() : b[currentSort.value || ""];
          return sortOrder.value === "asc" ? fieldA - fieldB : fieldB - fieldA;
        });

        return { times: sortedTimeScores, turns: sortedTurnScores };
      }

      return [...gameHistory.value].sort((a, b) => {
        const fieldA = currentSort.value === "date" ? new Date(a[currentSort.value]).getTime() : a[currentSort.value || ""];
        const fieldB = currentSort.value === "date" ? new Date(b[currentSort.value]).getTime() : b[currentSort.value || ""];
        return sortOrder.value === "asc" ? fieldA - fieldB : fieldB - fieldA;
      });
    });

    const toggleTable = (type: string) => {
      currentSort.value = null;
      showTable.value = type;
    } 
    const formatDate = (date: string) => new Date(date).toLocaleString();
    const getSortIcon = (key: string) => (currentSort.value === key ? (sortOrder.value === "asc" ? "▲" : "▼") : "");
    const goToDashboard = () => router.push({ name: "Dashboard" });

    return {
      isAnonymous,
      user,
      selectedGridSize,
      showTable,
      currentSort,
      sortOrder,
      sortedScores,
      toggleTable,
      sortBy,
      formatDate,
      getSortIcon,
      noGamesMessage,
      updateScores,
      goToDashboard,
    };
  },
});
</script>

<style scoped>
a {
  color: rgba(235, 235, 235, 0.64);
}

.hidden {
    display: none;
}


.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#parent-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.gridSizeContainer {
  margin: 10px 0;
  font-size: large;
}

.home {
  width: 25%;
  padding: 10px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}

.home:hover {
  background-color: #0056b3;
}

select {
  padding: 2px 2px;
  border: 2px solid #ccc;
  border-radius: 8px;
  margin-left: 5px;
  background-color: #f5f5f5;
  transition: border-color 0.3s ease, background-color 0.3s ease;
  cursor: pointer;
}

select:focus {
  outline: none;
  border-color: #007bff;
  background-color: #e9f5ff;
}

select:hover {
  background-color: #f0f0f0;
}

button {
  width: 100%;
  height: 35px;
  color: black;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px;
  border: none;
}

.controls button:hover {
  background-color: #aaa;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

th,
td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

th {
  background-color: #484848;
  position: relative;
  padding: 10px;
  user-select: none;
  cursor: pointer;
}

th span {
  margin-left: 5px;
  color: #ccc;
}

th:hover {
  color: #fff;
  background-color: #666;
}
</style>
