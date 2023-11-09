<script setup>
import { useBoardStore } from "../stores/board.js";
import BoardHeader from "./BoardHeader.vue";
import Button from "./Button.vue";
import TimelineIcon from "./TimelineIcon.vue";
import TimelineEvent from "./TimelineEvent.vue";
import Blank from "./Blank.vue";

const store = useBoardStore();
const events = store.board.events || "";
const getEventAction = (event) => {
  if (event.type !== "assign") return event.type;
  return event.patient.type;
};
</script>

<template>
  <section>
    <BoardHeader>Timeline</BoardHeader>
    <div class="mt-4"></div>
    <Blank v-if="!events" message="No events." />
    <!-- outer box, contains border box that makes timeline -->
    <div
      v-else
      v-for="(event, index) in events"
      class="relative flex flex-col pl-4 ml-4 border-l-2 border-gray-200"
    >
      <!-- event box -->
      <div class="flex items-center grow">
        <TimelineIcon
          :action="getEventAction(event)"
          class="absolute z-0 -left-4"
        />
        <TimelineEvent
          :event="event"
          :role="store.user.role"
          class="my-2 ml-4"
        />
      </div>
      <!-- undo for last event -->
      <div v-if="index === 0 && store.user.role === 'nurse'">
        <Button class="ml-auto" leftIcon="undo">Undo</Button>
      </div>
    </div>
  </section>
</template>
