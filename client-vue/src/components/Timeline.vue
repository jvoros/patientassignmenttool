<script setup>
import { ref, computed } from "vue";
import BoardHeader from "./BoardHeader.vue";
import Button from "./Button.vue";
import TimelineIcon from "./TimelineIcon.vue";
import TimelineEvent from "./TimelineEvent.vue";
import Blank from "./Blank.vue";
import { useAppStore } from "../stores/appStore";
import { socketData } from "../stores/socket";

const store = useAppStore();
const board = computed(() => {
  return socketData.board;
});

const props = defineProps({
  events: {
    type: Object,
    default: [],
  },
});

const getEventAction = (event) => {
  if (event.type !== "assign") return event.type;
  if (event.reassign) return "reassign";
  return event.patient.type;
};

async function undo() {
  store.undo();
}
</script>

<template>
  <section>
    <BoardHeader>Timeline</BoardHeader>
    <div class="mt-4"></div>
    <Blank v-if="events.length === 0" message="No events." />
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
        <TimelineEvent :event="event" class="my-2 ml-4" />
      </div>
      <!-- undo for last event -->
      <div v-if="index === 0 && store.user.role === 'nurse'">
        <Button class="ml-auto" leftIcon="undo" @click="undo">Undo</Button>
      </div>
    </div>
  </section>
</template>
