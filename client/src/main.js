// import './assets/main.css'
import './assets/pico.css'
import './assets/pico.colors.min.css'
import './assets/pico.mod.css'

import { createApp } from "vue"
import router from "./router.js"

import App from './App.vue'

const app = createApp(App);
app.use(router);
app.mount('#app');
