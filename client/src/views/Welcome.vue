<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board.js';

const res = ref();
const store = useBoardStore();

async function checkLogin() {
  res.value = await store.checkLoginStatus();
}


</script>

<template>
  <div class="column block">
    <h1>Welcome</h1>
    <button class="button is-primary" @click.prevent='checkLogin'>Test Route</button>
    <p>{{  res  }}</p>
  </div>
</template>
<style scoped></style>