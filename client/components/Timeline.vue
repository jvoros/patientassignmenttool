<script setup>
import { ref, computed } from "vue";

import { board, dispatch } from "./store.js";
import ZoneHeader from "./ZoneHeader.vue";
import TimelineFilter from "./TimelineFilter.vue";
import TimelineNode from "./TimelineNode.vue";

const timeline = computed(() =>
    board.value.timeline.map((eventId) => board.value.events[eventId]),
);

const filterShiftId = ref("");
const setFilter = (shiftId) => {
    filterShiftId.value = shiftId;
};

const undo = () => {
    dispatch("undo");
};
</script>

<template>
    <ZoneHeader
        title="Timeline"
        inst="Click a name or room number to reassign."
    >
        <TimelineFilter
            :setFilter="setFilter"
            :filteredShiftId="filterShiftId"
        />
    </ZoneHeader>
    <section class="tl-line">
        <template v-for="(event, index) in timeline">
            <TimelineNode :event="event" :filter="filterShiftId" />
            <div class="undo" v-if="index === 0">
                <wa-button
                    id="tl-undo"
                    appearance="outlined filled"
                    size="small"
                    @click="undo"
                >
                    <wa-icon name="undo"></wa-icon>
                </wa-button>
                <wa-tooltip for="tl-undo">Undo</wa-tooltip>
            </div>
        </template>
    </section>
</template>

<style scoped>
.tl-line {
    border-left: 2px solid var(--border);
    margin-left: calc(var(--tl-icon-size) * 1.5 / 2);
}

.undo {
    display: flex;
    justify-content: end;
    margin-top: -0.5rem;
    margin-bottom: 1rem;
}
</style>
