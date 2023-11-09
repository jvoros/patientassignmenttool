<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useBoardStore } from "./stores/board.js";
import { socketData } from "./stores/socket.js";
import Navbar from "./components/Navbar.vue";
import Login from "./components/Login.vue";
import Timeline from "./components/Timeline.vue";
import RotationPanel from "./components/RotationPanel.vue";

const store = useBoardStore();

const socketConnect = computed(() => {
  return socketData.connected;
});

onBeforeMount(() => {
  store.checkLoginStatus();
  store.getDoctorsAndShifts();
});

function logout() {
  store.logout();
}

const errorModal = ref(store.error ? true : false);
function toggleError() {
  errorModal.value = !errorModal.value;
}

const updatesMessage = ref(true);
function toggleUpdates() {
  console.log("toggleUpdates");
  updatesMessage.value = !updatesMessage.value;
}

const rotationMain = store.board.rotations?.main || {};
const rotationFt = store.board.rotations?.ft || {};
const rotationOff = store.board.rotations?.off || {};
</script>

<template>
  <!-- not logged in -->
  <Login v-if="!store.user.loggedIn" />

  <!-- logged in -->
  <div v-else class="relative">
    <Navbar
      :role="store.user.role"
      @logout="logout"
      @toggleUpdates="toggleUpdates"
    />

    <main class="mainGrid">
      <Timeline
        class="order-4 md:order-1 md:col-span-1 md:row-span-3 xl:col-span-3 xl:row-span-3"
      />

      <RotationPanel
        pointer
        primaryRotation
        :rotation="rotationMain"
        header="Main Rotation"
        class="md:order-2 md:col-span-1 xl:col-span-4 xl:row-span-3"
      />
      <section class="md:order-3 md:col-span-1 xl:col-span-3">
        <RotationPanel :rotation="rotationFt" header="Fast Track Rotation" />
        <RotationPanel :rotation="rotationOff" header="Off Rotation" />
      </section>
    </main>
  </div>
</template>
<style>
.mainGrid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-10 gap-12 px-4 my-8;
}
</style>
