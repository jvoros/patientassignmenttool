<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import Login from './components/Login.vue'
import AddDoctor from './components/AddDoctor.vue'

const store = useBoardStore();

onBeforeMount(() => {
  store.checkLoginStatus();
});

function logout() {
  store.logout();
}

const addDoctorModal = ref(false);
function toggleAddDoctor() {
  console.log('toggle')
  addDoctorModal.value = !addDoctorModal.value;
}

</script>

<template>
  <Login v-if="!store.user.loggedIn" />
  <Navbar 
    v-if="store.user.loggedIn" 
    :role="store.user.role" 
    @add-doctor="toggleAddDoctor" 
    @logout="logout"
  />
  <AddDoctor v-if="addDoctorModal" @close="toggleAddDoctor"/>
  
  <div class="container">
    <Transition>
      <ErrorFlash v-if='store.error' :error="store.error"/>
    </Transition>
  </div>

</template>


