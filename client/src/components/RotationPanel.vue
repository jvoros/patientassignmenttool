<script setup>
import { computed } from "vue";
import { useAppStore } from "../stores/appStore.js";
import { socketData } from "../stores/socket";
import PopoverAssign from "./PopoverAssign.vue";
import PopoverMove from "./PopoverMove.vue";
import Button from "./Button.vue";
import Blank from "./Blank.vue";
import BoardHeader from "./BoardHeader.vue";

const store = useAppStore();
const board = computed(() => {
  return socketData.board;
});

const props = defineProps({
  header: String,
  rotation: {
    type: Object,
    default: {},
  },
  blank: {
    type: String,
    default: "No shifts in this rotation.",
  },
  pointer: {
    type: Boolean,
    default: false,
  },
  variation: {
    type: String,
    default: "default",
  },
  primaryRotation: {
    type: Boolean,
    default: false,
  },
});

function isNext(shift_index) {
  if (props.rotation.name === "Off") return false;
  if (props.pointer) return shift_index === props.rotation.pointer;
  if (shift_index === 0) return true;
  return false;
}

function isPrimaryNext(shift_index) {
  return isNext(shift_index) && props.primaryRotation;
}

function isNurse() {
  return store.user.role === "nurse";
}

function getStyles() {
  const c = {
    default: "bg-white border-gray-200",
    fasttrack: "bg-green-50 border-green-300 text-gray-600",
    off: "text-gray-500",
  };
  return c[props.variation];
}

function countColor(count) {
  const c = {
    total: "bg-gray-200",
    fasttrack: "bg-green-200",
    "walk-in": "bg-blue-100",
    ambo: "bg-red-100",
  };
  return c[count];
}

function moveShift(shiftId, offset) {
  store.moveShift(shiftId, offset);
}

function onMoveShiftToRotation(rotationId, shiftId) {
  store.moveShiftToRotation(rotationId, shiftId);
}

function movePointer(offset) {
  store.moveRotationPointer(props.rotation.id, offset);
}

function assignPatient(shiftId, type, room) {
  store.assignPatient(shiftId, type, room);
}
</script>

<template>
  <section>
    <BoardHeader>{{ header }}</BoardHeader>
    <Blank :message="blank" v-if="rotation.shifts?.length === 0" />
    <div
      v-else
      v-for="(shift, index) in rotation.shifts"
      class="my-6 rounded-md border transition-colors duration-150 hover:shadow-lg"
      :class="[
        getStyles(),
        isPrimaryNext(index)
          ? 'shadow-md border-2 !border-amber-300 !bg-yellow-50'
          : '',
      ]"
    >
      <div
        v-if="isPrimaryNext(index)"
        class="bg-amber-300 text-white px-2 py-1 text-sm text-center font-bold uppercase"
      >
        Next in Rotation
      </div>

      <!-- flex: shift controls -->
      <div
        v-if="isNurse()"
        class="flex py-2 px-2 rounded-t items-center p-1 bg-gray-100"
        :class="[pointer ? 'justify-between' : 'justify-end']"
      >
        <div v-if="pointer">
          <button
            class="px-2 py-1 rounded-s bg-gray-100 border border-gray-300"
            @click="moveShift(shift.id, -1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              width="12"
              height="12"
            >
              <path
                d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4Z"
              ></path>
            </svg>
          </button>
          <button
            class="px-2 py-1 rounded-e bg-gray-100 border border-gray-300"
            @click="moveShift(shift.id, 1)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 12"
              width="12"
              height="12"
            >
              <path
                d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"
              ></path>
            </svg>
          </button>
        </div>

        <div class="text-xs flex gap-x-2">
          <PopoverMove
            :rotations="board.rotations"
            :rotationId="rotation.id"
            :shiftId="shift.id"
            @move-shift-to-rotation="onMoveShiftToRotation"
          />
          <!-- <select
            class="py-1 px-2 rounded border border-gray-300 text-sm bg-gray-100"
          >
            <option>Move to:</option>
            <option
              v-for="r in board.rotations"
              :disabled="rotation.name === r.name"
            >
              {{ r.name }}
            </option>
          </select> -->
          <PopoverAssign :shiftId="shift.id" @assign="assignPatient" />
        </div>
      </div>

      <!-- flex: shift details and Assign Button -->
      <div class="flex items-center px-6 py-4">
        <div class="grow flex flex-col">
          <div class="text-gray-400 text-base">{{ shift.name }}</div>
          <h4 class="font-semibold text-2xl">
            {{ shift.doctor.first }} {{ shift.doctor.last }}
          </h4>
        </div>

        <PopoverAssign
          v-if="isNurse() && isNext(index)"
          variety="next"
          :shiftId="shift.id"
          @assign="assignPatient"
        />
      </div>

      <!-- patient counts -->
      <ul class="pb-4 px-4 flex gap-x-2 text-xs">
        <li
          v-for="(count, key) in shift.counts"
          class="mt-2 py-1 px-2 rounded-full uppercase text-xs"
          :class="countColor(key)"
        >
          {{ key }}
          <span
            class="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold bg-gray-50 rounded-full"
          >
            {{ count }}
          </span>
        </li>
      </ul>
    </div>
    <div
      v-if="pointer && isNurse() && rotation.shifts?.length > 1"
      class="flex gap-2 text-sm justify-between"
    >
      <Button leftIcon="left-arrow" @click="movePointer(-1)"
        >Back Doctor</Button
      >
      <Button rightIcon="right-arrow" @click="movePointer(1)"
        >Skip Doctor</Button
      >
    </div>
  </section>
</template>
