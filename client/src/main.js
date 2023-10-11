import './assets/main.css'
// Vue
import { createApp } from "vue"
import { createRouter, createWebHashHistory } from "vue-router";
// // Templates
import App from './App.vue'
import Login from "./views/Login.vue"
import Welcome from "./views/Welcome.vue"

const routes = [
  {
    path: "/welcome",
    name: "Welcome",
    component: Welcome,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);
app.mount('#app');
