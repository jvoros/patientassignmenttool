<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board'

const store = useBoardStore();
const role = ref('');
const password = ref('');

function login() {
  store.login({ role: role.value, password: password.value });
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
