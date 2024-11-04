<template>
    <div class="game">
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
    data() {
      return {
        score: 0,
        cards: [
          { id: 1, value: 'A', flipped: false, matched: false },
          { id: 2, value: 'A', flipped: false, matched: false },
          { id: 3, value: 'B', flipped: false, matched: false },
          { id: 4, value: 'B', flipped: false, matched: false },
          // Add more cards as needed
        ],
        flippedCards: []
      };
    },
    methods: {
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
      this.shuffleCards();
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
  }
  .card-front {
    background-color: #fff;
  }
  .card-back {
    background-color: #000;
    color: #fff;
  }
  </style>