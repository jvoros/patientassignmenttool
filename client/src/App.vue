<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import Login from './components/Login.vue'
import AddDoctor from './components/AddDoctor.vue'
import Message from './components/Message.vue'
import Timeline from './components/Timeline.vue'
import MainRotation from './components/MainRotation.vue'

const store = useBoardStore();

onBeforeMount(() => {
  store.checkLoginStatus();
  store.getDoctorsAndShifts();
});

function logout() {
  store.logout();
}

const addDoctorModal = ref(false);
function toggleAddDoctor() {
  addDoctorModal.value = !addDoctorModal.value;
}

const errorModal = ref(store.error ? true : false);
function toggleError() {
  errorModal.value = !errorModal.value;
}

</script>

<template>
  <Login v-if="!store.user.loggedIn" />
  <div v-if="store.user.loggedIn" class="relative">
    <Navbar :role="store.user.role" @add-doctor="toggleAddDoctor" @logout="logout" />
    <AddDoctor v-if="addDoctorModal" @close="toggleAddDoctor"/>
    <Message severity="error" class="w-1/2 mx-auto" v-if='errorModal' @close="toggleError">{{  store.error.text }}</Message>
    <div class="grid grid-cols-7 gap-4 px-4 my-8">
      <Timeline :events="store.board.timeline" />
      <MainRotation :rotation="store.board.rotations.main" />
      <div class="bg-gray-50 col-span-2">other rotations</div>
    </div>
  </div>
</template>


