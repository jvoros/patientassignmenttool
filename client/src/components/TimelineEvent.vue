<script setup>
import PopoverPickup from "./PopoverPickup.vue";
const props = defineProps({
  event: Object,
  role: String,
});
</script>

<template>
  <section class="grow flex justify-between items-center mb-4">
    <!-- time, message -->
    <div
      v-if="event.type === 'assign'"
      class="grow flex justify-between items-center px-4 py-3 bg-white rounded border border-gray-200 hover:shadow-lg"
    >
      <div>
        <div class="text-gray-400 text-sm">{{ event.time }}</div>
        <h4 class="font-semibold text-gray-600">
          {{ event.shift.doctor.first }} {{ event.shift.doctor.last }}
        </h4>
      </div>

      <div
        class="flex items-center bg-gray-100 divide-x-2 border border-gray-200 rounded-full"
      >
        <div class="whitespace-nowrap font-semibold text-sm pl-4 pr-4 py-1">
          {{ event.patient.room }}
        </div>
        <div
          v-if="role === 'nurse'"
          class="hover:bg-gray-200 py-1 rounded-e-full"
        >
          <PopoverPickup />
        </div>
      </div>
    </div>

    <div v-else class="px-4">
      <div class="text-gray-400 text-sm">{{ event.time }}</div>
      <div class="text-gray-400">
        {{ event.message }}
      </div>
    </div>
  </section>
</template>
