<script setup>
import { ref } from 'vue'
import Navbar from './components/TheNavbar.vue'
import ErrorFlash from './components/ErrorFlash.vue'
import Login from './components/Login.vue'
import Welcome from './views/Welcome.vue'

const user = ref({});
const error = ref();

function displayError(err) {
  error.value = err;
  setTimeout(() => {
    error.value = null;
  }, 5000);
}

function login(newUser) {
  user.value = newUser;
}

function logout() {
  user.value = {};
}

</script>

<template>
  <Navbar :role="user.role" @logout='logout' />
  <Transition>
    <ErrorFlash v-if='error' :error="error"/>
  </Transition>
  <main class="columns">
    <Login v-if="!user.role" @login="login" @login-error="displayError" />
    <Welcome v-if="user.role" />
  </main>
</template>


