<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board'

const store = useBoardStore();
const role = ref('nurse');
const password = ref('');

function login() {
  store.login({ role: role.value, password: password.value });
}

</script>

<template>
  <section>
    <form @submit.prevent="login" class="tile secondary">
      <label>Role</label>
      <select v-model="role">
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
      </select>
      <label>Password</label>
      <input class="input" type="password" v-model="password">
      <button class="button" type="submit">Login</button>
    </form>
</section>
</template>

<style scoped>
  section {
    width: 400px;
    margin: 0 auto;
  }
</style>
