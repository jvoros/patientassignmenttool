<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import ErrorFlash from './components/ErrorFlash.vue'
import Login from './components/Login.vue'
import Welcome from './views/Welcome.vue'

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
  <main class="columns">
    <Login v-if="!store.user.loggedIn" />
    <Welcome v-if="store.user.loggedIn" />
  </main>
</template>


