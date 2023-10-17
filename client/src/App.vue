<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { user } from './router.js'
import Navbar from './components/navbar.vue'

const router = useRouter();

function loggedIn(newUser) {
  user.value = newUser;
  router.push({ name: 'Home' });
}

function logOut() {
  user.value = {};
  router.push({ name: 'Login' });
}

</script>

<template>
  <Navbar :role='user.role' @logout='logOut' />
  <div class="column">User: {{  user  }}</div>
  <main class="columns">

    <router-view @logged-in='loggedIn' />
  </main>
</template>


