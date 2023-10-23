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
    <h1>Patient Assignment Tool</h1>

    <form @submit.prevent="login" class="tile secondary">

      <select v-model="role">
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
      </select>

      <input class="input" type="password" v-model="password" placeholder="Password">
      
      <div v-if="store.loginError" class="error">
        {{ store.loginError.text }}
      </div>

      <button class="contrast" type="submit">Login</button>

    </form>
    
  </section>
</template>

<style scoped>
section {
  width: 400px;
  padding: var(--space-md) var(--space-md);
  margin: var(--space-lg) auto;
  background-color: var(--color-near-white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}

h1 {
  font-size: var(--f3);
  font-weight: 700;
  text-align: center;
  margin-bottom: var(--space-md);
}

form {
  display: flex;
  flex-direction: column;
  gap: var(--space);
}

input, select {
  width: 100%;
}

</style>
