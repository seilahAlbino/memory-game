import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        notificationsEnabled: JSON.parse(localStorage.getItem('notificationsEnabled') || 'true'),
    }),
    actions: {
        toggleNotifications() {
            this.notificationsEnabled = !this.notificationsEnabled;
            localStorage.setItem('notificationsEnabled', JSON.stringify(this.notificationsEnabled));
        },
    },
})
