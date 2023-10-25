<script setup>
import TimelineIcon from './TimelineIcon.vue';
import BoardPanel from './BoardPanel.vue';

const props = defineProps({
  events: Array
});

function isAssignClasses(event) {
  if (event.action === 'assign') return 'bg-white rounded border border-gray-200';
  return
}
</script>

<template>
<BoardPanel header="Timeline" class="bg-gray-50 pb-4">
  <div class="mt-4"></div>
  <!-- outer box, contains icon and border box that makes timeline -->
  <div v-for="(event, index) in events" class="flex items-center gap-x-6 px-4">
    <TimelineIcon :action="event.pt_type || event.action" />
    <!-- border box -->
    <div class="grow ml-4 pl-6 border-l-2 border-gray-200">
      <!-- event box -->
      <div class="my-2 px-4 py-2 grow flex items-center" :class="isAssignClasses(event)">
        <!-- time, name, message -->
        <div class="grow mb-2">
          <div class="text-gray-400 text-sm">{{ event.time }}</div>
          <h4 v-if="event.action === 'assign'" class="font-semibold text-gray-600">
            {{ event.doctor.first }} {{ event.doctor.last }}
          </h4>
          <span v-if="event.action !== 'assign'" class="text-gray-400">
            {{ event.message }}
          </span>
        </div>
        <!-- room tag -->
        <div v-if="event.room" class="whitespace-nowrap px-4 py-2 bg-gray-100 border border-gray-200 rounded-full font-semibold text-xs">
          {{  event.room }}
        </div>
      </div>
    </div>
  </div>
</BoardPanel>
</template>