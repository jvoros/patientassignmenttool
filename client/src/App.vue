<script setup>
import { ref, onBeforeMount, computed } from "vue";
import { useAppStore } from "./stores/appStore.js";
import { socketData } from "./stores/socket.js";
import Navbar from "./components/Navbar.vue";
import Login from "./components/Login.vue";
import Timeline from "./components/Timeline.vue";
import RotationPanel from "./components/RotationPanel.vue";
import Message from "./components/Message.vue";

const store = useAppStore();
const board = computed(() => {
  return socketData.board;
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

function makeRotationWithShifts(board, rotationName) {
  const details = board.rotations
    ? board.rotations.filter((r) => r.name === "Main")
    : {};
  const shifts = board.shifts
    ? board.shifts.filter((shift) => shift.rotationId === details.id)
    : [];
  return { details, shifts };
}

// const main = computed(() => {
//   const details = board.rotations ? board.rotations.filter(r=>r.name === "Main");
//   const shifts =
//   return store.board.shifts
//     ? store.board.shifts.filter(
//         (shift) => shift.rotationId === props.rotation.id
//       )
//     : null;
// });
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
    <Message v-if="store.error">{{ error }}</Message>
    <main class="mainGrid">
      <Timeline
        :events="board.events"
        :shifts="board.shifts"
        class="order-4 md:order-1 md:col-span-1 md:row-span-3 xl:col-span-3 xl:row-span-3"
      />

      <RotationPanel
        pointer
        primaryRotation
        :rotation="board.rotations.main"
        header="Main Rotation"
        class="md:order-2 md:col-span-1 xl:col-span-4 xl:row-span-3"
      />
      <section class="md:order-3 md:col-span-1 xl:col-span-3">
        <RotationPanel
          :rotation="board.rotations.fasttrack"
          variation="fasttrack"
          header="Fast Track Rotation"
        />
        <RotationPanel
          :rotation="board.rotations.off"
          variation="off"
          header="Off Rotation"
        />
      </section>
    </main>
  </div>
</template>
<style>
.mainGrid {
  @apply grid grid-cols-1 md:grid-cols-2 xl:grid-cols-10 gap-12 px-4 my-8;
}
</style>
