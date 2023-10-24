<script setup>
import TimelineIcon from './TimelineIcon.vue';

const props = defineProps({
  events: Array
});
</script>

<template>
  <h1 class="p-4 mb-4 font-semibold text-2xl bg-stone-800 rounded-t text-gray-100">
    Timeline
  </h1>
  <ol class="p-4">
    <li v-for="(event, index) in events" class="flex items-center gap-x-6">
      <TimelineIcon :action="event.pt_type || event.action" />
      <div class="grow ml-4 pl-6 border-l-2 border-gray-200">
        <div class="my-2 px-4 py-2 grow flex items-center rounded" 
          :class="[event.action === 'assign' ? 'bg-white border border-gray-100 hover:bg-gray-50' : '']">
          <div class="grow">
            <span class="text-gray-400 text-sm">{{ event.time }}</span>
            <h4 class="font-semibold text-xl capitalize">
              {{ event.doctor.first }} {{ event.doctor.last }}
            </h4>
            <span v-if="event.action !== 'assign'" class="text-sm text-gray-400">
              {{ event.message }}
            </span>
          </div>
          <div v-if="event.room" class="whitespace-nowrap px-4 py-2 bg-gray-100 border border-gray-200  rounded-full font-semibold text-sm">
            {{  event.room }}
          </div>
        </div>
      </div>
    </li>
  </ol>
</template>