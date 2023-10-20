<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import ErrorFlash from './components/ErrorFlash.vue'
import Login from './components/Login.vue'
import Welcome from './views/Welcome.vue'
import Theme from './views/Theme.vue'

const store = useBoardStore();

onBeforeMount(() => {
  store.checkLoginStatus();
})

</script>

<template>
  <Navbar />
  <Transition>
    <ErrorFlash v-if='store.error' :error="store.error"/>
  </Transition>
  <Login v-if="!store.user.loggedIn" />
  <Theme v-if="store.user.loggedIn" />
</template>


