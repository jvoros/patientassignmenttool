<script setup>
import { useBoardStore } from '../stores/board.js'
import BoardPanel from './BoardPanel.vue';
import RotationPanelControls from './RotationPanelControls.vue'
import Button from './Button.vue';

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
  }
});

function isNext(shift_index) {
  if (props.pointer) return shift_index === props.rotation.pointer;
  return false;
}

function getStyles() {
  const c = {
    'default': 'bg-white border-gray-200',
    'ft': 'bg-green-50 border-green-300 text-gray-600 hover:bg-green-50',
    'off': 'text-gray-500'
  }
  return c[props.variation];
}

function countColor(count) {
  const c = {
    'total': "bg-gray-200",
    'ft': "bg-green-200",
    'walk-in': "bg-blue-50",
    'ambo': "bg-red-50"
  }
  return c[count];
}

</script>
<template>
  <BoardPanel :header="rotation.name + ' Rotation'">
    <div v-for="shift, index in rotation.shifts"  
      class="my-6 rounded-md hover:bg-gray-50 border transition-colors duration-150" 
      :class="[getStyles(), isNext(index) ? 'shadow-md border-2 !border-amber-200' : '']"
    >
      <!-- flex: shift controls -->
      <div v-if="store.user.role === 'nurse'" class="flex py-2 px-4 rounded-t items-center p-1 bg-gray-100" :class="[pointer ? 'justify-between' : 'justify-end']">
        
        <div v-if="pointer">
          <button class="px-2 py-1 rounded-s bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4Z"></path></svg>
          </button>
          <button class="px-2 py-1 rounded-e bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"></path></svg>
          </button>
        </div>

        <div class="text-xs">
          <select class="py-1 px-2 rounded border border-gray-300 text-sm">
            <option>Move to:</option>
            <option v-for="r in store.board.rotations" :disabled="rotation.name === r.name">{{ r.name }}</option>
          </select>
        </div>
      </div>

      <!-- flex: shift details and next pill -->
      <div class="flex items-center px-6 py-4">
        
        <!-- shift details box -->
        <div class="grow flex flex-col">
          <div class="text-gray-400 text-base">{{ shift.name }}</div>
          <h4 class="font-semibold text-2xl">{{ shift.doctor.first }} {{ shift.doctor.last }}</h4>
        </div>
        
        <!-- next pill box -->
        <div v-if="isNext(index)" class="rounded-full px-4 py-2 bg-amber-300 text-yellow-50 text-sm">Next<i class="ml-2 fa-solid fa-star"></i></div>
      </div>

      <!-- patient counts -->
      <ul class="pb-6 px-6 flex gap-x-2 text-xs">
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