<script setup>
import BoardPanel from './BoardPanel.vue';
import Button from './Button.vue';
import TimelineIcon from './TimelineIcon.vue';
import TimelineEvent from './TimelineEvent.vue'
import { useBoardStore } from '../stores/board';

const store = useBoardStore();

const props = defineProps({
  events: Array
});
</script>

<template>
<BoardPanel header="Timeline" class="bg-gray-50 pb-4">
  <div class="mt-4"></div>
  <!-- outer box, contains border box that makes timeline -->
  <section v-for="(event, index) in events" class="relative flex flex-col px-4 ml-4 border-l-2 border-gray-200">
    <!-- event box -->
    <div class="flex items-center grow">
      <TimelineIcon :action="event.pt_type || event.action" class="absolute z-0 -left-4"/>
      <TimelineEvent :event="event" class="my-2 mx-4" />
    </div>
    <!-- undo for last event -->
    <div v-if="index === 0 && store.user.role === 'nurse'" class="pr-4">
      <Button class="ml-auto" leftIcon="undo">Undo</Button>
    </div>
  </section>
</BoardPanel>
</template>