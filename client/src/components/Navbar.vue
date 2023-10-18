<script setup>
  import { ref } from 'vue'
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const addDoctorModal = ref(false);

  function toggleAddDoctorModal() {
    addDoctorModal.value = !addDoctorModal.value;
  }

  function logout() {
    store.logout();
  }
</script>

<template>
  <nav class="navbar has-background-white-ter mb-4" role="navigation">
    <div class="navbar-brand">
      <a href="/" class="navbar-item">
        <strong>Patient Assignment Tool</strong>
    </a>
    </div>
    <div class="navbar-end">
      <div class="navbar-item buttons">
        <button class="button" v-if="store.user.role === 'nurse'" @click="toggleAddDoctorModal">
          <span class="icon">
            <i class="fa-solid fa-user-doctor"></i>
          </span>
          <span>Add Doctor</span>
        </button>
        <button class="button is-danger is-outlined" v-if="store.user.loggedIn" @click="logout">
          <span>Logout</span>
          <span class="icon">
            <i class="fa-solid fa-arrow-right-from-bracket"></i>
          </span>
        </button>
      </div>
    </div>
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