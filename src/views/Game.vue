<template>
  
  <div class="game">
    <header>
      <h1>Memory Card Game</h1>
      <h2>{{selectedGridSize}}</h2>
    </header>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="nodal-header">
            <h2>You beat your personal best time</h2>
            <img src="@/assets/images/trofeu.png" alt="Trophy">
        </div>
        <p>Reward: +1 Coin</p>
        <div class="modal-actions">
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </div>
    <div class="back-button">
      <router-link to="/dashboard" class="button">Home</router-link>
    </div>
    <div class="score-board">
      <p>Score: {{ score }}</p>
      <p>Time: {{ timer }}s</p>
      <p>Turns: {{ turns }}</p>
      <button @click="resetGame">Reset Game</button>
    </div>
    <div class="card-grid" :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }">
      <div
        v-for="card in cards"
        :key="card.id"
        class="card"
        @click="flipCard(card)"
      >
        <div v-if="card.flipped || card.matched" class="card-front">
          <img :src="card.image" alt="Card Image" class="card-icon" />
        </div>
        <div v-else class="card-back">
          <img src="@/assets/images/default.png" alt="Card Image" class="card-icon"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import { addVictoryToHistory, getHistory, addCoins } from "@/data/firebase";
    import { isAnonymous, loggedInUser } from "../auth";

    export default {
        props: {
            selectedGridSize: {
                type: String,
                default: "3x4",
            },
        },
        data() {
            return {
                score: 0,
                cards: [],
                flippedCards: [],
                timer: 0,
                turns: 0,
                timerInterval: null,
                showModal: false,
            };
        },
        computed: {
            gridColumns() {
                return this.selectedGridSize.split("x")[1];
            },
            cardDimensions() {
                // Adjust card size for 6x6 grid
                return this.selectedGridSize === "6x6"
                    ? { width: "70px", height: "100px" }
                    : { width: "100px", height: "150px" };
            },
        },
        methods: {
            async initializeCards() {
                const gridSizeMap = {
                    "3x4": 6, // 6 pairs (12 cards)
                    "4x4": 8, // 8 pairs (16 cards)
                    "6x6": 18, // 18 pairs (36 cards)
                };

                const pairsCount = gridSizeMap[this.selectedGridSize];

                // Generate pairs of cards
                const values = [];
                const imageSources = import.meta.glob("/src/assets/images/*.png", { eager: true });
                for (let i = 0; i < pairsCount; i++) {
                    const imageSrc = imageSources[`/src/assets/images/${i}.png`].default;
                    values.push({ id: i * 2 + 1, image: imageSrc, flipped: false, matched: false });
                    values.push({ id: i * 2 + 2, image: imageSrc, flipped: false, matched: false });
                }

                this.cards = values;
                this.shuffleCards();
            },
            flipCard(card) {
                if (card.flipped || card.matched) return;
                card.flipped = true;
                this.flippedCards.push(card);
                if (this.flippedCards.length === 2) {
                    this.turns++;
                    this.checkForMatch();
                }
            },
            checkForMatch() {
                const [card1, card2] = this.flippedCards;
                if (card1.image === card2.image) {
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
                this.checkIfGameEnded();
            },
            async checkIfGameEnded() {
                if(isAnonymous.value) return;

                const allCardsMatched = this.cards.every(card => card.matched);
                if (allCardsMatched) {
                    await addVictoryToHistory(loggedInUser.value, this.selectedGridSize, this.timer, this.turns);
                    clearInterval(this.timerInterval);
                    console.log("game ended");
                    
                    const history = await getHistory(loggedInUser.value);
                    const isNewRecord = history.map(entry => this.timer < entry.time);
                    console.log(history);

                    console.log(isNewRecord);
                    if (isNewRecord) {
                      console.log("new record");
                      try {
                        const success = await addCoins(loggedInUser.value, 1);
                        this.showModal = true;
                      } catch (error) {
                        console.log("Error adding coin:", error);
                      }
                    }
                }
            },
            resetGame() {
                this.score = 0;
                this.cards.forEach((card) => {
                    card.flipped = false;
                    card.matched = false;
                    this.turns = 0;
                    this.timer = 0;
                });
                this.shuffleCards();
            },
            shuffleCards() {
                this.cards = this.cards.sort(() => Math.random() - 0.5);
            },
            startTimer() {
                this.timerInterval = setInterval(() => {
                    this.timer++;
                }, 1000);
            },
        },
        created() {
            this.initializeCards();
            this.startTimer();
        },
        beforeDestroy() {
            clearInterval(this.timerInterval);
        },
    };
</script>

<style scoped>
.game {
  break-inside: avoid;
  text-align: center;
}
.score-board {
  margin: 20px 0;
}
.card-grid {
  display: grid;
  gap: 10px;
}

.card {
  width: 100px;
  height: 139px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #000;
}

.button,
a {
  display: inline-block;
  padding: 10px 20px;
  margin-top: 20px;
  background-color: #007bff;
  color: #fff;
  text-align: center;
  text-decoration: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
}

.button:hover,
a {
  background-color: #0056b3;
}

.card-front {
  width: inherit;
  height: inherit;
  background-image: url("@/assets/images/front.png");
  background-size: cover;  
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.card-back {
  width: inherit;
  height: inherit;
  background-image: url("@/assets/images/back.png");
  background-size: cover;  
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
}

.card-icon{
  width: 60px;
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
    height: 112px;
  }
  
  .card-icon{
    width: 45px;
  }
}

@media (max-width: 480px) {
  .card-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  .card {
    width: 50px;
    height: 70px;
  }

  .card-icon{
    width: 30px;
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

.modal-header {
    display: inline-flex;
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
</style>
