import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import  { library } from "@fortawesome/fontawesome-svg-core";
//import { faCog } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import App from './App.vue'
import router from './router'
import { loadAuthState } from "./auth"; // Import loadAuthState function

// Load the saved auth state from localStorage
loadAuthState();
const app = createApp(App)

app.use(createPinia())
app.use(router)
//library.add(faCog);

app.mount('#app')
