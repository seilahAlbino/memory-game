<template>
  <div class="container">
    <button class="home" @click="goToDashboard">Home</button>
    <h1>Notifications</h1>

    <div class="table-container">
      <div class="personal">
        <table v-if="sortedNotifications.length && !isAnonymous">
          <thead>
            <tr>
              <th @click="sortBy('date')">Date {{ getSortIcon('date') }}</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(notification, index) in sortedNotifications" :key="index">
              <td>{{ formatDate(notification.date) }}</td>
              <td>{{ notification.message }} {{  sortOrder }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>{{ noNotificationsMessage }}</p>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref, onMounted } from "vue";
import { isAnonymous, loggedInUser } from "../auth"; 
import { getNotifications } from "@/data/firebase";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "Scoreboard",
  setup() {
    const router = useRouter();
    const notifications = ref([]);
    const noNotificationsMessage = ref("No notifications available.");
    const currentSort = ref<string | null>("date");
    const sortOrder = ref("desc");
    const user = ref<any>(null);

    onMounted(() => {
      updateNotifications();
    });

    const updateNotifications = async () => {
      try {
        if (!loggedInUser.value) throw new Error("User not logged in!");

        let [allNotifications] = await Promise.all([
          getNotifications(loggedInUser.value),
        ]);

        notifications.value = allNotifications;
      } catch (error) {
        console.error("Error fetching notifications:", error);
        noNotificationsMessage.value = "Error fetching notifications.";
      }
    };

    const sortBy = (key: string) => {
      sortOrder.value = currentSort.value === key && sortOrder.value === "asc" ? "desc" : "asc";
      currentSort.value = key;
    };

    const sortedNotifications = computed(() => {
      return [...notifications.value].sort((a, b) => {
        const fieldA = currentSort.value === "date" ? new Date(a[currentSort.value]).getTime() : a[currentSort.value || ""];
        const fieldB = currentSort.value === "date" ? new Date(b[currentSort.value]).getTime() : b[currentSort.value || ""];
        return sortOrder.value === "asc" ? fieldA - fieldB : fieldB - fieldA;
      });
    });

    const formatDate = (date: string) => new Date(date).toLocaleString();
    const getSortIcon = (key: string) => (currentSort.value === key ? (sortOrder.value === "asc" ? "▲" : "▼") : "");
    const goToDashboard = () => router.push({ name: "Dashboard" });

    return {
      isAnonymous,
      user,
      currentSort,
      sortOrder,
      sortedNotifications,
      noNotificationsMessage,
      sortBy,
      formatDate,
      getSortIcon,
      updateNotifications,
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
