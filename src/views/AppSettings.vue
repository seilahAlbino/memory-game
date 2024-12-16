<template>
    <div class="container">
        <h1>App Settings</h1>
        <button class="home-button" @click.prevent="goToDashboard">Home</button>
        <div class="mainSettings">
            <div class="setting">
                <p class="setting-label">Notifications: </p>
                <button @click="toggleNotifications" :class="notificationClass" class="setting-button"> {{ notificationsStatus }} </button>
            </div>
        </div>
        <div v-if="showModal" class="modal-overlay">
            <div class="modal">
                <div class="nodal-header">
                    <h2>Notifications: {{ notificationsStatus }}</h2>
                </div>
                <div class="modal-actions">
                    <button @click="showModal = false">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useSettingsStore } from "@/stores/settings";

export default {
    setup() {
        const settingsStore = useSettingsStore();
        const showModal = ref(false);
        const router = useRouter();

        const notificationsStatus = computed(() => 
            settingsStore.notificationsEnabled ? 'On' : 'Off'
        );

        const modalToggleNotifications = () => {
            showModal.value = true
            settingsStore.toggleNotifications()
        }
        
        const notificationClass = computed(() => 
            settingsStore.notificationsEnabled ? 'on' : 'off'
        );

        const goToDashboard = () =>{
            router.push("\dashboard");
        }
        

        return {
            showModal,
            notificationsStatus,
            toggleNotifications: modalToggleNotifications,
            notificationClass,
            goToDashboard,
        };
    },
}
</script>

<style scoped>
a {
    color: rgba(235, 235, 235, 0.64);

}


.container {
    display: flex;
    flex-direction: column;
    align-items: center; /* Align items to the start */
}

.setting {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 10px;
}

.setting-label {
    font-size: 20px;
    margin-right: 15px;
}

.setting-button {
    padding: 5px 10px;
    font-size: 15px;
    font-weight: bold;
    cursor: pointer;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 5px;
}

.setting-button:hover {
    background-color: #0056b3;
}

.button {
    display: inline-block;
    padding: 5px 10px;
    color: #007bff;
    text-decoration: none;
}

.button:hover {
    text-decoration: underline;
}

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

.setting-button.on{
    background-color: green;    
    color: #FFF;
}

.setting-button.off{
    background-color: red;    
    color: #FFF;
}

.home-button{
    color: #FFF;
    background-color: #007bff;
    border-radius: 10px;
    border: none;
    font-size: large;
    height: 35px;
    width: 100px;
    font-weight: bold;   
    margin: 15px 0px 15px 0px;
    cursor: pointer;
}

.home-button:hover{
    background-color: #0056b3;
}

</style>
