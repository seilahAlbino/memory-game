import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
//import  { library } from "@fortawesome/fontawesome-svg-core";
//import { faCog } from "@fortawesome/free-solid-svg-icons";
//import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';

import App from './App.vue'
import router from './router'
import { loadAuthState } from "./auth"; // Import loadAuthState function

// Load the saved auth state from localStorage
loadAuthState();
const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions);
//library.add(faCog);

app.mount('#app')
