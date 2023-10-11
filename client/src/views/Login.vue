<script setup>
import { ref, onMounted } from 'vue'

const username = ref('username');
const password = ref('Pass');
const res = ref('')

async function login() {
  res.value = "Login Fired";
  const response = await fetch('http://localhost:5173/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ username: username, password: password })
  });
  res.value = await response.json();
}

</script>

<template>
  <div>
    <h1>LOGIN</h1>
    <h3>{{ res }}</h3>
    <p><a href="/login">Login</a></p>
    <form @submit.prevent="login">
      <input v-model="username" />
      <br />
      <br />
      <input v-model="password" type="password" />
      <br />
      <br />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<style scoped></style>