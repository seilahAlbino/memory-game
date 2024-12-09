<template>
    <div class="game-history">
      <h1>Game History</h1>

      <button class="home" @click.prevent="goToDashboard">Home</button>

      <table v-if="sortedGameHistory.length">
        <thead>
          <tr>
            <th @click="sortBy('date')">Date <span v-if="currentSort === 'date'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortBy('gridSize')">Board Size <span v-if="currentSort === 'gridSize'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortBy('time')">Time <span v-if="currentSort === 'time'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
            <th @click="sortBy('turns')">Turns <span v-if="currentSort === 'turns'">{{ sortOrder === 'asc' ? '▲' : '▼' }}</span></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(game, index) in sortedGameHistory" :key="index">
            <td>{{ new Date(game.date).toLocaleString() }}</td>
            <td>{{ game.gridSize }}</td>
            <td>{{ game.time }} s</td>
            <td>{{ game.turns }}</td>
          </tr>
        </tbody>
        <tbody>

        </tbody>
      </table>
      <p v-else> 
        No games played yet!
      </p>
    </div>
  </template>

  <script lang="ts">
    import { defineComponent, computed, ref } from "vue";
    import { gameHistory, loggedInUser } from "../auth";
    import { getHistory } from "@/data/firebase";
    import { useRouter } from "vue-router";
  
    export default defineComponent({
      name : "GameHistory",
      setup() {
        const currentSort = ref<string | null>('date'); // Initially no column is sorted
        const sortOrder = ref<'asc' | 'desc'>('asc'); // Default sorting order is ascending
        const router = useRouter();

        const updateHistory = async () => {
          gameHistory.value = await getHistory(loggedInUser.value);
          localStorage.setItem("gameHistory", JSON.stringify(gameHistory.value));
        }
        updateHistory()


        const goToDashboard = () => {
          router.push({ name: "Dashboard" });
        };

        const sortBy = (key: string) =>{
          if (currentSort.value === key) {
            sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
          } else {
            currentSort.value = key;
            sortOrder.value = 'asc';
            
          }
        };

        const sortedGameHistory = computed(() => {
          if(!currentSort.value){
            return gameHistory.value;
          };

          return [...gameHistory.value].sort((a,b) =>{
            let fieldA = a[currentSort.value];
            let fieldB = b[currentSort.value];

            if(currentSort.value === "date"){
              fieldA = new Date(fieldA).getTime();
              fieldB = new Date(fieldB).getTime();
            }
            else if(currentSort.value === "gridSize"){
              fieldA = parseInt(fieldA.split("x")[0]);
              fieldB = parseInt(fieldB.split("x")[0]);
            }

            if(sortOrder.value === "asc"){
              return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
            }
            else{
              return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
            }
          })
        });

        return { sortedGameHistory, currentSort, sortOrder, sortBy, goToDashboard };
      },
    })

  </script>
  
<style scoped>
  a {
    color: rgba(235, 235, 235, 0.64);
    
  }

  
  .game-history {
    text-align: center;
    padding: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 20px 0;
  }

  th, td{
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

  th span{
    margin-left: 5px;
    color: #ccc;
  }

  th:hover{
    color: #fff;
    background-color: #666;
  }

  h1 {
  font-size: 35px;
  margin-bottom: 1.5rem;
  text-align: center;
}
button {
  width: 50%;
  padding: 10px;
  font-size: 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
}


</style>