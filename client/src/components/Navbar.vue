<script setup>
  import { ref } from 'vue'
  import { useBoardStore } from '../stores/board';
  import AddDoctor from './AddDoctor.vue'

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
  <nav role="navigation">
    <ul class="nav-start">
      <li><h3 class="brand">Patient Assignment Tool</h3></li>
      <li><a>Home</a></li>
    </ul>
    <ul class="nav-end">
      <li>
        <button class="small secondary" v-if="store.user.role === 'nurse'" @click="toggleAddDoctorModal">
            <i class="fa-solid fa-user-doctor"></i>
            <span>Add Doctor</span>
        </button>
      </li>
      <li>
        <button class="small outline danger" v-if="store.user.loggedIn" @click="logout">
          <span>Logout</span>
          <i class="fa-solid fa-arrow-right-from-bracket"></i>
        </button>
      </li>
    </ul>

  </nav>
  <AddDoctor @close-modal="toggleAddDoctorModal" v-if="addDoctorModal" />
</template>

<style scoped>
* {
  margin: 0;
}
  nav {
    margin-bottom: var(--xl-pad);
    display: flex;
    flex-direction: row;
    background-color: var(--pico-color-grey-50);
  }

  ul {
    padding: var(--md-pad);
  }

  li {
    display: inline-block;
    margin-right: var(--md-pad)
  }
  
  ul.nav-start {
    flex-grow: 1;
  }

</style>