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
        <button class="PlayButton" @click="goToGame">Play Game</button>
      </div>


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
        selectedGameMode: 'single',
        selectedGridSize: '3x4'
      };
    },
    methods: {
      goToScoreboard() {
        this.$router.push({ name: 'Scoreboard' });
      }
    }
  };
  </script>
  
  <style scoped>
  .dashboard {
    text-align: center;
    padding: 20px;
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