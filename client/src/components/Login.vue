<script setup>
import { ref } from 'vue'
import { apiCall } from '../helpers.js'

const emit = defineEmits(['login', 'loginError']);

const role = ref('');
const password = ref('');

async function login() {
  const res = await apiCall('api/login', {role: role.value, password: password.value });
  if (res.type === 'success') {
    emit('login', res.payload)
  } else {
    console.log(res);
    emit('loginError', res)
  }
}

</script>

<template>
  <section class="section column is-3 is-offset-4">
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
