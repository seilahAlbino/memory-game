<template>
  <div class="game">
    <header>
      <h1>Memory Card Game</h1>
      <h2>{{ selectedGridSize }}</h2>
    </header>
    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <div class="nodal-header">
          <h2>You beat your personal best time</h2>
          <img src="@/assets/images/trofeu.png" alt="Trophy" />
        </div>
        <p>Reward: +1 Coin</p>
        <div class="modal-actions">
          <button @click="showModal = false">Close</button>
        </div>
      </div>
    </div>

    <div v-if="showModalNoRecord" class="modal-overlay">
      <div class="modal">
        <div class="nodal-header">
          <h2>You Won!</h2>
          <img src="@/assets/images/trofeu.png" alt="Trophy" />
          <p>Would you like to play again?</p>
        </div>
        <div class="modal-actions">
          <button @click.prevent="restartGame">Yes</button>
          <button @click.prevent="returnToDashboard">No</button>
        </div>
      </div>
    </div>

    <div v-if="showModalHint" class="modal-overlay">
      <div class="modal">
        <h2>Spend 1 Coin?</h2>
        <p>Are you sure you want to spend 1 coin to use a hint?</p>
        <div class="modal-actions">
          <button @click="useHint()">Yes</button>
          <button @click="showModalHint = false">No</button>
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
      <button @click.prevent="resetGame">Reset Game</button>
    </div>
    <div
      class="card-grid"
      :style="{ gridTemplateColumns: `repeat(${gridColumns}, 1fr)` }"
    >
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
          <img
            src="@/assets/images/default.png"
            alt="Card Image"
            class="card-icon"
          />
        </div>
      </div>
    </div>

    <div v-if="!isAnonymous">
      <button @click="showModalHint = true" class="hint"></button>
    </div>
  </div>
</template>

<script>
import {
  addVictoryToHistory,
  getHistory,
  addCoins,
  addNotification,
  getGlobalScores,
  areNotificationsEnabled,
  removeCoins,
  getCoins,
} from "@/data/firebase";
import { isAnonymous, loggedInUser } from "../auth";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

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
      showModalNoRecord: false,
      showModalHint: false,
    };
  },
  computed: {
    gridColumns() {
      return this.selectedGridSize.split("x")[1];
    },
    cardDimensions() {
      return this.selectedGridSize === "6x6"
        ? { width: "70px", height: "100px" }
        : { width: "100px", height: "150px" };
    },
    isAnonymous() {
      return isAnonymous.value;
    },
    loggedInUser() {
      return loggedInUser.value;
    },
    coins() {
      return getCoins(loggedInUser.value);
    },
  },
  methods: {
    async initializeCards() {
      const gridSizeMap = {
        "3x4": 6,
        "4x4": 8,
        "6x6": 18,
      };

      const pairsCount = gridSizeMap[this.selectedGridSize];
      const values = [];
      const imageSources = import.meta.glob("/src/assets/images/*.png", {
        eager: true,
      });

      for (let i = 0; i < pairsCount; i++) {
        const imageSrc = imageSources[`/src/assets/images/${i}.png`].default;
        values.push({
          id: i * 2 + 1,
          image: imageSrc,
          flipped: false,
          matched: false,
        });
        values.push({
          id: i * 2 + 2,
          image: imageSrc,
          flipped: false,
          matched: false,
        });
      }

      this.cards = values;
      this.shuffleCards();
    },
    shuffleCards() {
      this.cards = this.cards.sort(() => Math.random() - 0.5);
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
      const allCardsMatched = this.cards.every((card) => card.matched);

      if (allCardsMatched) {
        clearInterval(this.timerInterval);
        if (isAnonymous.value) {
          this.showModalNoRecord = true;
          return;
        }

        const history = await getHistory(loggedInUser.value);
        const isNewRecord =
          history.every((entry) => this.timer < entry.time) ||
          history.every((entry) => this.turns < entry.turns);

        const globalTimeRecords = await getGlobalScores(
          this.selectedGridSize,
          "time"
        );
        const isGlobalTimeRecord = globalTimeRecords
          .slice(0, 3)
          .every((record) => this.timer < record.time);

        const globalTurnsRecords = await getGlobalScores(
          this.selectedGridSize,
          "turns"
        );
        const isGlobalTurnsRecord = globalTurnsRecords
          .slice(0, 3)
          .every((record) => this.turns < record.turns);

        await addVictoryToHistory(
          loggedInUser.value,
          this.selectedGridSize,
          this.timer,
          this.turns
        );

        const notificationsEnabled = await areNotificationsEnabled(
          loggedInUser.value
        );

        if (isGlobalTimeRecord || isGlobalTurnsRecord) {
          await addNotification(
            loggedInUser.value,
            "Congratulations! You've broken a global record"
          );
          if (notificationsEnabled) {
            toast("Congratulations! You've broken a global record", {
              autoClose: 10000,
            });
          }
        }

        if (isNewRecord) {
          try {
            await addCoins(loggedInUser.value, 1);
            this.showModal = true;

            await addNotification(
              loggedInUser.value,
              "Congratulations! You've beaten a record."
            );
            await addNotification(loggedInUser.value, "You’ve won 1 coin.");

            if (notificationsEnabled) {
              toast("Congratulations! You've beaten a record.", {
                autoClose: 10000,
              });
              toast("You’ve won 1 coin.", {
                autoClose: 10000,
              });
            }
          } catch (error) {
            console.error("Error adding coin:", error);
          }
        } else {
          this.showModalNoRecord = true;
        }
      }
    },
    async useHint() {
      if (isAnonymous.value) {
        alert("Hints are not available in anonymous mode.");
        return;
      }

      const userCoins = await getCoins(loggedInUser.value);

      if (userCoins < 1) {
        alert("Not enough coins to use a hint.");
        this.showModalHint = false;
        return;
      }

      try {
        const success = await removeCoins(loggedInUser.value, 1);
        if (!success) {
          alert("Error deducting coins.");
          this.showModalHint = false;
          return;
        }

        const unmatchedPairs = this.cards
          .filter((card) => !card.matched)
          .reduce((pairs, card) => {
            pairs[card.image] = pairs[card.image] || [];
            pairs[card.image].push(card);
            return pairs;
          }, {});

        const pair = Object.values(unmatchedPairs).find(
          (cards) => cards.length === 2
        );

        if (pair) {
          pair[0].flipped = true;
          pair[1].flipped = true;

          setTimeout(() => {
            pair[0].flipped = false;
            pair[1].flipped = false;
          }, 2000);
        } else {
          alert("No unmatched pairs found.");
        }

        this.showModalHint = false;
      } catch (error) {
        console.error("Error using hint:", error);
        alert("An error occurred while using the hint. Please try again.");
      }
    },
    resetGame() {
      this.score = 0;
      this.showModalNoRecord = false;
      this.cards.forEach((card) => {
        card.flipped = false;
        card.matched = false;
      });
      this.turns = 0;
      this.timer = 0;
      this.shuffleCards();
    },
    startTimer() {
      this.timerInterval = setInterval(() => {
        this.timer++;
      }, 1000);
    },
    returnToDashboard() {
      this.$router.push({ name: "Dashboard" });
    },
    restartGame() {
      this.resetGame();
      this.startTimer();
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

.card-icon {
  width: 60px;
}

.return-btn {
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

a {
  color: #fff;
  text-decoration: none;
}

.return-btn:hover {
  background-color: #0056b3;
}

.hint {
  margin-top: 15%;
  background-image: url("@/assets/images/hint.png");
  background-size: cover;
  background-color: transparent;
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
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

  .card-icon {
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

  .card-icon {
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
