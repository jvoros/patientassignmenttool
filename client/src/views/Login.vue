<script setup>
import { ref } from 'vue'

const emit = defineEmits(['loggedIn']);

const role = ref('');
const password = ref('');
const res = ref('')

async function login() {
  const response = await fetch('http://localhost:5173/api/login', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ role: role.value, password: password.value })
  });
  res.value = await response.json();
  emit('loggedIn', res.value.user);
  
}

</script>

<template>
  <section class="section column is-3 is-offset-4">
    <p class="box">
      response: {{ res }}
    </p>
    <form @submit.prevent="login" class="notification">
      <div class="field">
        <label class="label">Role</label>
        <div class="control">
          <div class="select">
            <select v-model="role">
              <option value="nurse">Nurse</option>
              <option value="doctor">Doctor</option>
            </select>
          </div>
        </div>
      </div>

      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input class="input" type="password" v-model="password">
        </div>
      </div>

      <button class="button" type="submit">Login</button>
    </form>
  </section>
</template>

<style scoped></style>