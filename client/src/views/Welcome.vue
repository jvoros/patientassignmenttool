<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board.js';

const res = ref();
const store = useBoardStore();

async function test() {
  const response = await fetch('api/doctors');
  res.value = await response.json();
}

</script>

<template>
  <div class="column block">
    <h1>Welcome</h1>
    <button class="button is-primary" @click.prevent='test'>Test Route</button>
    <p>{{  res  }}</p>
  </div>
</template>
<style scoped></style>