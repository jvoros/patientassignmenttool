<script setup>
import { ref } from 'vue';
import { useBoardStore } from '../stores/board.js'
import BoardPanel from './BoardPanel.vue';
import RotationPanelControls from './RotationPanelControls.vue'
import AssignPopover from './AssignPopover.vue'
import Button from './Button.vue'
import Icon from './Icons.vue'

const store = useBoardStore();

const props = defineProps({
  rotation: Object,
  pointer: {
    type: Boolean,
    default: false
  },
  variation: {
    type: String,
    default: 'default'
  },
  primaryRotation: {
    type: Boolean,
    default: false
  }
});

function isNext(shift_index) {
  if (props.rotation.name === 'Off') return false;
  if (props.pointer) return shift_index === props.rotation.pointer;
  if (shift_index === 0) return true;
  return false;
}

function getStyles() {
  const c = {
    'default': 'bg-white border-gray-200 hover:bg-gray-50',
    'ft': 'bg-green-50 border-green-300 text-gray-600 hover:bg-green-100',
    'off': 'text-gray-500 hover:bg-gray-100'
  }
  return c[props.variation];
}

function countColor(count) {
  const c = {
    'total': "bg-gray-200",
    'ft': "bg-green-200",
    'walk-in': "bg-blue-100",
    'ambo': "bg-red-100"
  }
  return c[count];
}

</script>

<template>
  <BoardPanel :header="rotation.name + ' Rotation'">
    <div v-for="shift, index in rotation.shifts" 
      class="my-6 rounded-md border transition-colors duration-150" 
      :class="[getStyles(), isNext(index) && primaryRotation ? 'shadow-lg border-2 !border-amber-300 !bg-yellow-50 hover:!bg-amber-100' : '']"
    >
      <div v-if="isNext(index) && primaryRotation" class="bg-amber-300 text-white px-2 py-1 text-sm text-center">
        NEXT UP
      </div>
      <!-- flex: shift controls -->
      <div v-if="store.user.role === 'nurse'" class="flex py-2 px-2 rounded-t items-center p-1 bg-gray-100" :class="[pointer ? 'justify-between' : 'justify-end']">
        
        <div v-if="pointer">
          <button class="px-2 py-1 rounded-s bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4Z"></path></svg>
          </button>
          <button class="px-2 py-1 rounded-e bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"></path></svg>
          </button>
        </div>

        <div class="text-xs flex gap-x-2">
          <select class="py-1 px-2 rounded border border-gray-300 text-sm">
            <option>Move to:</option>
            <option v-for="r in store.board.rotations" :disabled="rotation.name === r.name">{{ r.name }}</option>
          </select>
        </div>
      </div>

      <!-- flex: shift details and Assign Button -->
      <div class="flex items-center px-6 py-4">
        <div class="grow flex flex-col">
          <div class="text-gray-400 text-base">{{ shift.name }}</div>
          <h4 class="font-semibold text-2xl">{{ shift.doctor.first }} {{ shift.doctor.last }}</h4>
        </div>
        <AssignPopover v-if="store.user.role==='nurse'" :variety="isNext(index) && primaryRotation ? 'next' : 'default'" :shift="{rotationName: rotation.name, shiftIndex: index}" />
      </div>

      <!-- patient counts -->
      <ul class="pb-4 px-4 flex gap-x-2 text-xs">
        <li v-for="count, key in shift.counts" class="mt-2 py-1 px-2 rounded-full uppercase text-xs" :class="countColor(key)">
          {{ key }} 
          <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold bg-gray-50 rounded-full">
            {{ count }}
          </span>
        </li>
      </ul>
    </div>
    <RotationPanelControls v-if="pointer && store.user.role ==='nurse'" />
  </BoardPanel>
</template>