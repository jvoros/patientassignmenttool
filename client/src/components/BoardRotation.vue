<script setup>
import { useBoardStore } from '../stores/board.js'
import BoardPanel from './BoardPanel.vue';
import BoardRotationControls from './BoardRotationControls.vue'
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

function countColor(count) {
  const c = {
    'total': "bg-gray-100",
    'ft': "bg-green-100",
    'walk-in': "bg-blue-50",
    'ambo': "bg-red-50"
  }
  return c[count];
}

</script>
<template>
  <BoardPanel :header="rotation.name + ' Rotation'">
    <div v-for="shift, index in rotation.shifts" :class="[isNext(index) ? 'shadow-md border-4 border-amber-300' : 'border-gray-300']" class="border  my-6 rounded-md bg-white hover:bg-gray-50" >
      <!-- flex: shift controls -->
      <div class="flex justify-between py-2 px-4 rounded-t items-center p-1 bg-gray-100">
        <div>
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
        <div v-if="isNext(index)" class="rounded-full px-4 py-2 bg-amber-300 text-yellow-50">Next<i class="ml-2 text-xl fa-solid fa-star"></i></div>
      </div>
      <ul class="pb-6 px-6 flex gap-x-2 text-xs">
        <li v-for="count, key in shift.counts" class="mt-2 py-1 px-2 rounded-full uppercase text-xs" :class="countColor(key)">
          {{ key }} 
          <span class="inline-flex items-center justify-center w-4 h-4 ml-1 text-xs font-semibold bg-gray-50 rounded-full">
            {{ count }}
          </span>
        </li>
      </ul>
    </div>
    <BoardRotationControls v-if="pointer" />
  </BoardPanel>
</template>