<script setup>
import { ref } from 'vue'

const res = ref();

async function testPost() {
  const response = await fetch('http://localhost:5173/api/testauth', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
  });
  res.value = await response.json();
}
</script>

<template>
  <div class="column block">
    <h1>Welcome</h1>
    <button class="button is-primary" @click.prevent='testPost'>Test Route</button>
    <p>{{  res  }}</p>
  </div>
</template>
<style scoped></style>