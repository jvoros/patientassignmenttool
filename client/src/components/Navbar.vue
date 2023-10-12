<script setup>
  import { ref } from 'vue'

  defineProps({
    admin: Boolean
  });

  const addDoctorModal = ref(false);

  function toggleAddDoctorModal() {
    addDoctorModal.value = !addDoctorModal.value;
  }
</script>

<template>
  <nav>
    <ul>
      <li><strong>Patient Assignment Tool</strong></li>
    </ul>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
      <li v-if="admin">
        <router-link to="/">
          <button class="secondary small" @click="toggleAddDoctorModal">
            <svg class="octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M7.9 8.548h-.001a5.528 5.528 0 0 1 3.1 4.659.75.75 0 1 1-1.498.086A4.01 4.01 0 0 0 5.5 9.5a4.01 4.01 0 0 0-4.001 3.793.75.75 0 1 1-1.498-.085 5.527 5.527 0 0 1 3.1-4.66 3.5 3.5 0 1 1 4.799 0ZM13.25 0a.75.75 0 0 1 .75.75V2h1.25a.75.75 0 0 1 0 1.5H14v1.25a.75.75 0 0 1-1.5 0V3.5h-1.25a.75.75 0 0 1 0-1.5h1.25V.75a.75.75 0 0 1 .75-.75ZM5.5 4a2 2 0 1 0-.001 3.999A2 2 0 0 0 5.5 4Z"></path></svg>
            Add Doctor
          </button>
        </router-link>
      </li>
      <li>
        <router-link to="/">
          <button class="contrast small">
            Logout
            <svg class="ml-2 octicon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path></svg>
          </button>
        </router-link>
      </li>
    </ul>
  </nav>

  <dialog :open="addDoctorModal">
    <article>
      <header>
        <Link to="#" aria-label="Close" class="close" @click="toggleAddDoctorModal"/>
        <p>
          <strong>Add Doctor to Rotation</strong>
        </p>
      </header>
      <p>
        We're excited to have you join us for our
        upcoming event. Please arrive at the museum 
        on time to check in and get started.
      </p>
      <ul>
        <li>Date: Saturday, April 15</li>
        <li>Time: 10:00am - 12:00pm</li>
      </ul>
    </article>
  </dialog>
</template>

<style scoped>
  nav {
    margin-left: calc(var(--spacing)*-1);
    margin-right: calc(var(--spacing)*-1);
    padding: 0 var(--spacing);
  }

  li {
    margin-right: var(--pico-spacing)
  }
</style>