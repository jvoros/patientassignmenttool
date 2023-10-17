import { createRouter, createWebHashHistory } from "vue-router"
import { ref } from "vue"

import Theme from "./views/Theme.vue"
import Login from "./views/Login.vue"
import Welcome from "./views/Welcome.vue"

// holds the user value for the app
export const user = ref({});

const routes = [
  {
    path: "/",
    name: "Home",
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

// simple middleware that always redirects to login until authenticated
router.beforeEach(async (to, from) => {
  if (!user.value.role && to.name !== 'Login') {
    return { name: 'Login'}
  }
})

export default router;