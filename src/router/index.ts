import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import Login from "../views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import Game from "@/views/Game.vue";
import Scoreboard from "@/views/Scoreboard.vue";
import GameHistory from "@/views/GameHistory.vue";
import GameSettings from "@/views/AppSettings.vue";
import Notifications from "@/views/Notifications.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Login",
      component: Login,
    },
    {
      path: "/dashboard",
      name: "Dashboard",
      component: Dashboard,
    },
    {
      path: "/game/:gridSize", // Define gridSize as a route parameter
      name: "Game",
      component: Game,
      props: (route) => ({ selectedGridSize: route.params.gridSize }), // Pass gridSize as selectedGridSize prop
    },
    {
      path: "/scoreboard",
      name: "Scoreboard",
      component: Scoreboard,
    },
    {
      path: "/gamehistory",
      name: "GameHistory",
      component: GameHistory,
    },
    {
      path: "/settings",
      name: "GameSettings",
      component: GameSettings,
    },
    {
      path: "/scoreboard",
      name: "Scoreboard",
      component: Scoreboard,
    },
    {
      path: "/notifications",
      name: "Notifications",
      component: Notifications,
    },
    {
      path: "/about",
      name: "about",
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import("../views/AboutView.vue"),
    },
  ],
});

export default router;
