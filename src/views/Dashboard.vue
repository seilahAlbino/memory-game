<template>
    <div class="dashboard">
      <header>
        <h1>Memory Card Game Dashboard</h1>
      </header>
      <div class="user-info">
        <p>User: {{ user.name }}</p>
        <p>Coins: {{ user.coins }}</p>
      </div>
      <div class="scoreboard">
        <button @click="goToScoreboard">View Scoreboard</button>
      </div>


      <div class="grid-size">
        <label for="grid-size">Select Grid Size:</label>
        <select id="grid-size" v-model="selectedGridSize">
          <option value="3x4" >3x4</option>
          <option value="4x4">4x4</option>
          <option value="6x6">6x6</option>
        </select>
      </div>
      <div class="scoreboard">
        <button class="PlayButton" @click.prevent="goToGame">Play Game</button>
        <button class="GameHistory" @click.prevent="goToGameHistory">Game History</button>
      </div>
      <div class="scoreboard"> 
        <button class="GameHistoryButton" @click.prevent="goToHistory">Game History</button>
      </div>
      <footer>
        <router-link to="/settings"><font-awesome-icon :icon="['fas', 'gear']"/>&nbsp;App Settings</router-link>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: {
          name: 'John Doe',
          coins: 100
        },        
        selectedGridSize: '3x4'
      };
    },
    methods: {
      goToScoreboard() {
        this.$router.push({ name: 'Scoreboard' });
      },
      goToGame() {
        this.$router.push({ name: 'Game', params: { gridSize: this.selectedGridSize } });
      },
      goToHistory() {
        this.$router.push({ name: 'GameHistory' });
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 20px;
  }
  
  .buttons{
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
  
  .user-info, .game-mode, .scoreboard {
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
    background-color: #007BFF;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin: 5px;
  }

  a{
    text-decoration: none;
    color: white;
  }

  a:hover{
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
    background-color: #CCC;
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
  
    select, button {
      width: auto;
    }
  }

 
  </style>