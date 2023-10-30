<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  event: Object
});
</script>

<template>
  <section class="px-4 py-2 grow flex justify-between items-center" 
    :class="[event.action === 'assign' ? 'bg-white rounded border border-gray-200' : '']" 
  >
    <!-- time, message -->
    <div>
      <div class="text-gray-400 text-sm">{{ event.time }}</div>
      <h4 v-if="event.action === 'assign'" class="font-semibold text-gray-600">
        {{ event.doctor.first }} {{ event.doctor.last }}
      </h4>
      <div v-if="event.action !== 'assign'" class="text-gray-400">
            {{ event.message }}
      </div>
    </div>
    <!-- room -->
    <div v-if="event.room" class="whitespace-nowrap px-4 py-2 bg-gray-100 border border-gray-200 rounded-full font-semibold text-xs">
      {{  event.room }}
    </div>
  </section>
</template>