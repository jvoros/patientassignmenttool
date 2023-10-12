import { createRouter, createWebHashHistory } from "vue-router";

import Theme from "./views/Theme.vue"
import Welcome from "./views/Welcome.vue"
import Login from "./views/Login.vue"

const routes = [
  {
    path: "/",
    name: "Theme",
    component: Theme,
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

export default router;