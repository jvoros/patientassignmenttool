<script setup>
import TimelineIcon from './TimelineIcon.vue';
const props = defineProps({
  events: Array
});

const assignments = props.events.filter(e => ['walk-in', 'ambo', 'ft'].includes(e.action));
console.log(assignments);

</script>
<template>
  <h1 class="p-4 mb-4 font-semibold text-2xl bg-stone-800 rounded-t text-gray-100">Timeline</h1>
  <ol class="p-4">
    <li v-for="(event, index) in events" class="flex items-center gap-x-6 pr-4">
      <TimelineIcon :action="event.action" />
      <div class="grow ml-4 p-8 border-l-2 border-gray-200">
          <div class="text-gray-600 text-sm">{{ event.time }}</div>
          <h4 class="font-semibold text-xl capitalize">{{ event.doctor.first }} {{ event.doctor.last }}</h4>
      </div>
        <div class="whitespace-nowrap bg-gray-200 px-4 py-2 rounded-full capitalize font-semibold text-base">{{  event.message }}</div>
    </li>
  </ol>
</template>