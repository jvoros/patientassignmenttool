<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import Login from './components/Login.vue'
import AddDoctor from './components/AddDoctor.vue'
import Message from './components/Message.vue'
import Timeline from './components/Timeline.vue'

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
  <div v-if="store.user.loggedIn">
    <Navbar :role="store.user.role" @add-doctor="toggleAddDoctor" @logout="logout" />
    <AddDoctor v-if="addDoctorModal" @close="toggleAddDoctor"/>
    <Message severity="error" class="w-1/2 mx-auto" v-if='errorModal' @close="toggleError">{{  store.error.text }}</Message>
    <div class="flex flex-row gap-x-4 px-4">
      <div class="basis-1/4 bg-gray-50 rounded shadow">
      <Timeline :events="store.board.timeline" />
      </div>
      <div class="bg-gray-50 basis-1/3">
        <div v-for="shift in store.board.rotations.main.shifts">{{ shift.name }}</div>
      </div>
      <div class="bg-gray-50 basis-1/3">other rotations</div>
    </div>
  </div>
  



</template>


