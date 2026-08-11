<script setup lang="ts">
import type { BoardEvent } from "../../server/core/types";
import { timelineModes } from "../utils/modes";
import { convertTime } from "../utils/dates";

const { board } = useBoard();

const props = defineProps<{
    shiftId: string;
}>();

const events = computed(() => {
    const assigns = [];
    board.value?.timeline.forEach((eventId) => {
        const e = board.value?.events[eventId];
        if (e.super === props.shiftId) {
            assigns.push(e);
        }
        if ((e.assign === props.shiftId) & !e?.note?.includes("Reassigned:")) {
            assigns.push(e);
        }
    });
    return assigns.slice(0, 5);
});
</script>
<template>
    <div class="text-xs font-mono text-muted py-1 pl-3">
        <span>Latest Assignments:</span>
        <div v-for="event in events" class="flex items-center gap-2 my-2">
            <UBadge
                :icon="timelineModes[event.mode].icon"
                color="neutral"
                variant="soft"
                size="sm"
                :class="timelineModes[event.mode].style"
            />
            <span>{{ convertTime(event.time) }} -</span>
            <span class="text-lg font-bold font-sans">
                {{ event.room }}
            </span>
            <UBadge
                v-if="event.super === shiftId"
                color="info"
                variant="soft"
                label="S"
                size="sm"
            />
            <span v-if="event.note">- {{ event.note }}</span>
        </div>
    </div>
</template>
