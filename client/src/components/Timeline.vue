<script setup>
import TimelineIcon from './TimelineIcon.vue';
import BoardPanel from './BoardPanel.vue';
import Button from './Button.vue';
import { useBoardStore } from '../stores/board';

const store = useBoardStore();

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
  <!-- each timeline row -->
  <section v-for="(event, index) in events">
    <!-- outer box, contains icon and border box that makes timeline -->
    <div  class="flex items-center gap-x-6 px-4">
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
    <div v-if="index === 0 && store.user.role === 'nurse'" class="flex justify-end ml-8 pb-4 pr-4 border-l-2 border-gray-200">
      <button  class="flex items-center justify-center rounded-lg gap-x-2 bg-gray-100 border border-gray-300 px-8 py-2 border cursor-pointer hover:bg-gray-200">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-counterclockwise" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"/><path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z"/></svg>
        Undo Last Event
      </button>
    </div>

  </section>

</BoardPanel>
</template>