<template>
  
  <div class="game">
    <div class="container return-btn"><RouterLink to="/dashboard">Home</RouterLink></div>
    <header>
      <h1>Memory Card Game</h1>
    </header>
    <div class="score-board">
      <p>Score: {{ score }}</p>
      <button @click="resetGame">Reset Game</button>
    </div>
    <div class="card-grid">
      <div v-for="card in cards" :key="card.id" class="card" @click="flipCard(card)">
        <div v-if="card.flipped || card.matched" class="card-front">
          {{ card.value }}
        </div>
        <div v-else class="card-back">
          ?
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedGridSize: {
      type: String,
      default: '3x4'
    }
  },
  data() {
    return {
      score: 0,
      cards: [],
      flippedCards: []
    };
  },
  methods: {
    initializeCards() {
      const gridSizeMap = {
        '3x4': 6,  // 6 pairs (12 cards)
        '4x4': 8,  // 8 pairs (16 cards)
        '6x6': 18  // 18 pairs (36 cards)
      };
      const pairsCount = gridSizeMap[this.selectedGridSize] || 6;

      console.log(pairsCount);

      // Generate pairs of cards
      const values = [];
      for (let i = 0; i < pairsCount; i++) {
        const value = String.fromCharCode(65 + i); // 'A', 'B', 'C', etc.
        values.push({ id: i * 2 + 1, value, flipped: false, matched: false });
        values.push({ id: i * 2 + 2, value, flipped: false, matched: false });
      }

      this.cards = values;
      this.shuffleCards();
    },
    flipCard(card) {
      if (card.flipped || card.matched) return;
      card.flipped = true;
      this.flippedCards.push(card);
      if (this.flippedCards.length === 2) {
        this.checkForMatch();
      }
    },
    checkForMatch() {
      const [card1, card2] = this.flippedCards;
      if (card1.value === card2.value) {
        card1.matched = true;
        card2.matched = true;
        this.score += 10;
      } else {
        setTimeout(() => {
          card1.flipped = false;
          card2.flipped = false;
        }, 1000);
      }
      this.flippedCards = [];
    },
    resetGame() {
      this.score = 0;
      this.cards.forEach(card => {
        card.flipped = false;
        card.matched = false;
      });
      this.shuffleCards();
    },
    shuffleCards() {
      this.cards = this.cards.sort(() => Math.random() - 0.5);
    }
  },
  created() {
    this.initializeCards();
  }
};
</script>


<style scoped>
.game {
  text-align: center;
}
.score-board {
  margin: 20px 0;
}
.card-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}
.card {
  width: 100px;
  height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccc;
  cursor: pointer;
  color: #000;
  font-size: large;
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

.return-btn:hover {
  background-color: #0056b3;
}

@media (max-width: 768px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .card {
    width: 80px;
    height: 120px;
    font-size: medium;
  }
}

@media (max-width: 480px) {

  .card {
    width: auto;
    height: 100px;
    font-size: small;
  }
}

</style>
