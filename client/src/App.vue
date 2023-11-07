<script setup>
import { ref, computed, onBeforeMount } from "vue";
import { useBoardStore } from "./stores/board.js";
import { socketData } from "./stores/socket.js";
import Navbar from "./components/Navbar.vue";
import Login from "./components/Login.vue";
import Message from "./components/Message.vue";
import Button from "./components/Button.vue";
import Icon from "./components/Icons.vue";
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
</script>

<template>
  <!-- not logged in -->
  <Login v-if="!store.user.loggedIn" />

  <!-- logged in -->
  <div v-if="store.user.loggedIn" class="relative">
    <Navbar
      :role="store.user.role"
      @logout="logout"
      @toggleUpdates="toggleUpdates"
    />
    <div class="mx-10">
      <Message severity="error" v-if="errorModal" @close="toggleError">
        {{ store.error.text }}
      </Message>
      <Message v-if="updatesMessage" closable @close="toggleUpdates">
        <h1>{{ socketConnect }}</h1>
        <h3 class="font-bold">Updates</h3>
        <hr />
        <ul class="m-4 list-disc list-outside flex flex-col gap-y-4">
          <li>
            Patients <strong>must</strong> have a patient type:
            <Icon icon="walk-in" /> walk-in, <Icon icon="ambo" /> ambo,
            <Icon icon="ft" /> fast track, or <Icon icon="bonus" /> bonus.
          </li>
          <li>
            Patients can be picked up by a physician, other than the one
            assigned to them, using the
            <Button left-icon="pickup" inline icon-color="muted"></Button>
            button on the Timeline.
            <ul class="list-disc flex flex-col gap-y-2 ml-4">
              <li>
                This means a doctor can pick up a patient assigned to another
                physician without changing the rotation.
              </li>
              <li>
                For example, if Dr. Mooth is in a code and has a patient
                assigned to him, Dr. Wiesley can volunteer to pickup that
                patient on behalf of Dr. Mooth.
              </li>
              <li>
                This <i>doesn't change the rotation</i>. The rotation should
                continue as if Dr. Mooth took that patient.
              </li>
            </ul>
          </li>
          <li>
            Patients can be added to any provider using the
            <Button inline leftIcon="walk-in"></Button> button.
            <ul class="list-disc flex flex-col gap-y-2 ml-4">
              <li>
                Doctors can pick up patients without changing the rotation.
              </li>
              <li>
                For example, a doctor may know about a simple transfer from TEC
                and ask to have that patient assigned to them, without changing
                the rotation.
              </li>
              <li class="">
                Patients added out of rotation should usually use the
                <strong>bonus</strong> <Icon icon="bonus" /> patient type.
              </li>
            </ul>
          </li>

          <li>
            The <strong>Undo</strong> button has been moved to the
            <strong>Timeline</strong> section, underneath the last timeline
            event.
          </li>
        </ul>
      </Message>
    </div>

    <div
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-10 gap-12 px-4 my-8"
    >
      <Timeline
        :events="store.board.timeline"
        :role="store.user.role"
        class="order-4 md:order-1 md:col-span-1 md:row-span-3 xl:col-span-3 xl:row-span-3"
      />
      <RotationPanel
        pointer
        primaryRotation
        :rotation="store.board.rotations.main"
        class="md:order-2 md:col-span-1 xl:col-span-4 xl:row-span-3"
      />
      <div class="md:order-3 md:col-span-1 xl:col-span-3">
        <RotationPanel :rotation="store.board.rotations.ft" variation="ft" />
        <RotationPanel :rotation="store.board.rotations.off" variation="off" />
      </div>
    </div>
  </div>
</template>
