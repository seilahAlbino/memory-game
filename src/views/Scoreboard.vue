<template>
  <div class="scoreboard">
    <div class="container return-btn"><RouterLink to="/dashboard">Home</RouterLink></div>
    <header><h1 class="title">Scoreboard</h1></header>
    <ul>
      <li v-for="score in scores" :key="score.id">
        {{ score.name }}: {{ score.points }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      scores: [],
    };
  },
  created() {
    this.fetchScores();
  },
  methods: {
    async fetchScores() {
      try {
        const response = await fetch("https://your-database-api.com/scores");
        const data = await response.json();
        this.scores = data;
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    },
  },
};
</script>

<style scoped>
.scoreboard {
  text-align: center;
  padding: 20px;
}

header {
  /* Remove the negative margin and add padding to position at the top */
  position: sticky;
  top: 0;

  padding: 10px 0;
  z-index: 10;
  width: 100%;
}

.title {
  margin: 0;
  font-size: 2em;
}

ul {
  list-style-type: none;
  padding: 20px 0 0; /* Adjust padding to align with header */
  margin: 0;
}

li {
  margin: 5px 0;
  font-size: 1.2em;
}

.return-btn{
  
  display: inline-block;
  padding: 10px 20px;
  margin: 25px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  text-decoration: none; 
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

a{
  color: #fff;
  text-decoration: none;
}
</style>