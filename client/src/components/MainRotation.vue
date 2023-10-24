<script setup>
import BoardPanel from './BoardPanel.vue';

const props = defineProps({
  rotation: Object
});

function isNext(shift_index) {
  return shift_index === props.rotation.pointer;
}

</script>
<template>
  <BoardPanel :header="rotation.name + ' Rotation'" class="col-span-3">
    <div v-for="shift, index in rotation.shifts" class="border border-gray-200 m-4 rounded bg-white hover:bg-gray-50" :class="[isNext(index) ? 'bg-yellow-50 border-2 border-amber-200' : '']">
      <!-- flex: shift controls -->
      <div class="flex justify-between items-center p-2 bg-gray-100">
        <div class="px-2 py-1">
          <button class="px-2 py-1 rounded-s bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 4c-.2 0-.4.1-.5.2L2.2 7.5c-.3.3-.3.8 0 1.1.3.3.8.3 1.1 0L6 5.9l2.7 2.7c.3.3.8.3 1.1 0 .3-.3.3-.8 0-1.1L6.6 4.3C6.4 4.1 6.2 4 6 4Z"></path></svg>
          </button>
          <button class="px-2 py-1 rounded-e bg-gray-100 border border-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" width="12" height="12"><path d="M6 8.825c-.2 0-.4-.1-.5-.2l-3.3-3.3c-.3-.3-.3-.8 0-1.1.3-.3.8-.3 1.1 0l2.7 2.7 2.7-2.7c.3-.3.8-.3 1.1 0 .3.3.3.8 0 1.1l-3.2 3.2c-.2.2-.4.3-.6.3Z"></path></svg>
          </button>
        </div>
        <div class="px-2 py-1 text-xs">
          <button class="px-2 py-1 rounded-s bg-gray-100 border border-gray-300">
            Off Rotation
          </button>
          <button class="px-2 py-1 rounded-e bg-gray-100 border border-gray-300">
            Fast Track
          </button>
        </div>
        
      </div>
      <!-- flex: shift details and next pill -->
      <div class="flex items-center px-6 pt-2 pb-6">
        <!-- shift details box -->
        <div class="grow">
          <div class="text-gray-400 text-sm">{{ shift.name }}</div>
          <h4 class="font-semibold text-2xl">{{ shift.doctor.first }} {{ shift.doctor.last }}</h4>
          <div class="mt-2">
            <span class="rounded-full px-2 py-1 bg-gray-100 border border-gray-300 text-xs font-semibold text-gray-600">Patients: {{ shift.counts.total }}</span>
          </div>
        </div>
        <!-- next pill box -->
        <div v-if="isNext(index)" class="rounded-full px-4 py-2 bg-amber-300 text-yellow-50">Next<i class="ml-2 text-xl fa-solid fa-star"></i></div>

      </div>

    </div>
  </BoardPanel>
</template>