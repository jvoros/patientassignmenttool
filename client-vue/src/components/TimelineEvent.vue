<script setup>
import { computed } from "vue";
import PopoverPickup from "./PopoverPickup.vue";
import { useAppStore } from "../stores/appStore";
import { socketData } from "../stores/socket";

const store = useAppStore();
const board = computed(() => {
  return socketData.board;
});

const props = defineProps({
  event: Object,
});

function reassign(eventId, shiftId) {
  store.reassign(eventId, shiftId);
}
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
        <div class="text-gray-400 text-sm" v-if="event.reassign">
          Reassigned to: <b>{{ event.reassign.last }}</b>
        </div>
      </div>

      <div
        class="flex items-center bg-gray-100 divide-x-2 border border-gray-200 rounded-full"
      >
        <div class="whitespace-nowrap font-semibold text-sm pl-4 pr-4 py-1">
          {{ event.patient.room }}
        </div>
        <div
          v-if="store.user.role === 'nurse' && !event.reassign"
          class="hover:bg-gray-200 pt-1 pb-2 rounded-e-full"
        >
          <PopoverPickup
            :eventId="event.id"
            :shifts="board.shifts"
            @reassign="reassign"
          />
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
