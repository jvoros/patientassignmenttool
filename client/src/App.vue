<script setup>
import { ref, onBeforeMount } from 'vue'
import { useBoardStore } from './stores/board.js'
import Navbar from './components/Navbar.vue'
import Login from './components/Login.vue'
import AddDoctor from './components/AddDoctor.vue'
import Message from './components/Message.vue'
import Timeline from './components/Timeline.vue'
import RotationPanel from './components/RotationPanel.vue'
import AssignPanel from './components/AssignPanel.vue'

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

// assign bar


</script>

<template>
  <Login v-if="!store.user.loggedIn" />
  <div v-if="store.user.loggedIn" class="relative">
    <Navbar :role="store.user.role" @add-doctor="toggleAddDoctor" @logout="logout" />
    <AddDoctor v-if="addDoctorModal" @close="toggleAddDoctor"/>
    <Message severity="error" class="w-1/2 mx-auto" v-if='errorModal' @close="toggleError">{{  store.error.text }}</Message>

    <!-- <AssignPanel /> -->

    <div class="grid grid-cols-1 md:grid-cols-10 gap-12 px-4 my-8">
      <Timeline :events="store.board.timeline" class="order-3 md:order-1 md:col-span-3" />
      <RotationPanel pointer :rotation="store.board.rotations.main" class="order-1 md:order-2 md:col-span-4" />
      <div class="bg-gray-50 md:col-span-3 order-2 md:order-2">
        <RotationPanel :rotation="store.board.rotations.ft" variation="ft" />
        <RotationPanel :rotation="store.board.rotations.off" variation="off" />
      </div>
    </div>
  </div>
</template>


