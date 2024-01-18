<script setup>
import { ref } from "vue";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverOverlay,
} from "@headlessui/vue";
import PopoverTransition from "./PopoverTransition.vue";
import Button from "./Button.vue";
import Icon from "./Icons.vue";

const props = defineProps({
  shifts: Object,
  eventId: String,
});

const emit = defineEmits(["reassign"]);

const newShiftId = ref("");

function getShifts() {
  return [
    ...props.shifts.toSorted((a, b) => {
      const nameA = a.doctor.last.toUpperCase();
      const nameB = b.doctor.last.toUpperCase();
      return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
    }),
  ];
}

async function reassign(close) {
  emit("reassign", props.eventId, newShiftId.value);
  newShiftId.value = "";
  close();
}
</script>

<template>
  <Popover class="relative" v-slot="{ close }">
    <PopoverButton class="focus:outline-none b-1 px-2">
      <Icon icon="pickup" color="dimgray" />
    </PopoverButton>

    <PopoverTransition>
      <PopoverOverlay class="z-10 fixed inset-0 bg-black/30" />
    </PopoverTransition>

    <PopoverTransition>
      <PopoverPanel
        class="absolute z-10 -left-10 w-72 p-4 bg-gray-100 shadow-xl rounded-md border-2 border-gray-300"
      >
        <div class="flex flex-col gap-y-4 text-md">
          <h3 class="font-bold">Picked up by:</h3>
          <select
            class="py-2 px-4 w-full rounded border border-gray-200"
            v-model="newShiftId"
          >
            <option v-for="shift in getShifts()" :value="shift.id">
              {{ shift.doctor.first }} {{ shift.doctor.last }}
            </option>
          </select>

          <div class="flex items-center gap-4 self-end">
            <Button variety="ghost" @click="close" class="hover:text-gray-600"
              >Cancel</Button
            >
            <Button
              variety="contrast"
              @click="reassign(close)"
              :disabled="!newShiftId"
              >Ok</Button
            >
          </div>
        </div>
      </PopoverPanel>
    </PopoverTransition>
  </Popover>
</template>
<style>
.typeButton:hover > span {
  visibility: visible;
}
</style>
