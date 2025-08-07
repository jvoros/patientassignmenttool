<script setup>
import { formatTime, board } from "./store.js";
import TimelineReassignPopover from "./TimelineReassignPopover.vue";
const { event } = defineProps(["event"]);
</script>

<template>
    <div class="assign">
        <div>
            <div class="time">{{ formatTime(event.time) }}</div>
            <TimelineReassignPopover
                :value="event.assign"
                :eventId="event.id"
                heading="Reassign to"
                which="provider"
                align="start"
            />
            <div class="message" v-if="event.super">
                Supervisor:
                {{ board.shifts[event.super].first }}
                {{ board.shifts[event.super].last }}
            </div>
            <!-- <div class="message" v-if="event.message">{{ event.message }}</div> -->
            <div class="message" v-if="event.note">{{ event.note }}</div>
        </div>

        <TimelineReassignPopover
            :value="event.room"
            :eventId="event.id"
            heading="New Room"
            which="room"
            align="center"
        />
    </div>
</template>

<style scoped>
.assign {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--bg-highlight);
    padding: var(--padding-half);
}

.assign:hover .reassign-chevron {
    visibility: visible;
}

.time,
.message {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    color: var(--text-muted);
}
</style>
