<script setup>
import { ref, computed } from "vue";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverOverlay,
} from "@headlessui/vue";
import Button from "./Button.vue";
import Message from "./Message.vue";
import PopoverTransition from "./PopoverTransition.vue";
import { useAppStore } from "../stores/appStore";
import { socketData } from "../stores/socket";

const store = useAppStore();
const board = computed(() => {
  return socketData.board;
});

const emit = defineEmits(["addDoctor"]);

const doctor = ref(null);
const shift = ref({});
const rotationId = ref(null);
rotationId.value = board.rotations ? board.rotations.main.id : null;

async function addDoctor(close) {
  store.addShift(doctor.value, {
    ...shift.value,
    rotationId: rotationId.value,
  });
  doctor.value = null;
  shift.value = {};
  rotationId.value = null;
  close();
}
</script>

<template>
  <Popover class="relative">
    <PopoverButton class="focus:outline-none">
      <Button class="w-36" leftIcon="doctor">Add Doctor</Button>
    </PopoverButton>

    <PopoverTransition>
      <PopoverOverlay class="z-10 fixed inset-0 bg-black/30" />
    </PopoverTransition>

    <PopoverTransition>
      <PopoverPanel
        v-slot="{ close }"
        class="absolute z-10 mt-3 w-80 right-0 p-4 bg-gray-100 shadow-xl rounded-md border-2 border-gray-300"
      >
        <div class="flex flex-col gap-y-4">
          <select
            class="py-2 px-4 rounded border border-gray-200"
            v-model="shift"
          >
            <option :value="{}" disabled>Select Shift:</option>
            <option v-for="shift in store.shift_details" :value="shift">
              {{ shift.name }}
            </option>
          </select>
          <Message
            severity="warn"
            :closable="false"
            :icon="false"
            v-if="shift.id === 1"
            >Adding a doctor to the 6 am shift will reset the board.</Message
          >
          <select
            class="py-2 px-4 w-full rounded border border-gray-200"
            v-model="doctor"
          >
            <option :value="null" disabled>Select Doctor:</option>
            <option v-for="doctor in store.doctors" :value="doctor">
              {{ doctor.last }}, {{ doctor.first }}
            </option>
          </select>
          <select
            class="py-2 px-4 w-full rounded border border-gray-200"
            v-model="rotationId"
          >
            <option :value="null" disabled>Select Rotation:</option>
            <option v-for="rotation in board.rotations" :value="rotation.id">
              {{ rotation.name }}
            </option>
          </select>
          <div class="flex items-center gap-4 self-end">
            <Button variety="ghost" @click="close">Cancel</Button>
            <Button variety="contrast" @click="addDoctor(close)"
              >Add to Rotation</Button
            >
          </div>
        </div>
      </PopoverPanel>
    </PopoverTransition>
  </Popover>
</template>
