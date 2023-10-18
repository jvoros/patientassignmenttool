<script setup>
import { ref } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/TheNavbar.vue'
import ErrorFlash from './components/ErrorFlash.vue'
import Login from './components/Login.vue'
import Welcome from './views/Welcome.vue'

const store = useBoardStore();

</script>

<template>
  <Navbar />
  <Transition>
    <ErrorFlash v-if='store.error' :error="store.error"/>
  </Transition>
  <main class="columns">
    <Login v-if="!store.user.role" />
    <Welcome v-if="store.user.role" />
  </main>
</template>


