<script setup>
import { computed } from "vue";
import TimelineIcon from "./TimelineIcon.vue";
import TimelineInfo from "./TimelineInfo.vue";
import TimelineAssign from "./TimelineAssign.vue";
import { formatTime } from "./store.js";

const { event, filter } = defineProps(["event", "filter"]);

const mode = computed(() => (event.assign ? event.mode : "info"));

const shouldShow = computed(
    () => filter === "" || filter === event?.assign || filter === event?.super,
);
</script>
<template>
    <div class="tl-node" v-if="shouldShow">
        <TimelineIcon :mode="mode" />
        <div class="tl-event">
            <TimelineAssign :event="event" v-if="event.assign" />
            <TimelineInfo
                :time="formatTime(event.time)"
                :message="event.message"
                v-else
            />
        </div>
    </div>
</template>

<style scoped>
.tl-node {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding-bottom: 2rem;
}

.tl-node:first-of-type {
    padding-bottom: 1rem;
}

.tl-event {
    width: 100%;
}
</style>
