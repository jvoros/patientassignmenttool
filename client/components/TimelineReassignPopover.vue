<script setup>
import { computed } from "vue";
import { site, board, getShiftIdsAlphabetized, dispatch } from "./store.js";
const { value, heading, align, which, eventId } = defineProps([
    "value",
    "heading",
    "which",
    "align",
    "eventId",
]);

const getName = (shiftId) => {
    return `${board.value.shifts[shiftId].first} ${board.value.shifts[shiftId].last}`;
};

const name = computed(() => {
    if (which === "room") return value;
    return getName(value);
});

const items = computed(() => {
    if (which === "room") {
        return site.value?.rooms.map((room) => ({ value: room, text: room }));
    }
    return getShiftIdsAlphabetized().map((shiftId) => ({
        value: shiftId,
        text: getName(shiftId),
    }));
});

const handleClick = (item) => {
    if (which === "room") {
        dispatch("changeRoom", { eventId, newRoom: item.value });
    } else {
        dispatch("reassign", { eventId, newShiftId: item.value });
    }
};
</script>

<template>
    <wa-dropdown distance="10" class="reassign-popover">
        <button class="unbutton" slot="trigger">
            <span class="name">
                {{ name }}
            </span>
            <wa-icon name="angle-down" class="reassign-chevron"></wa-icon>
        </button>
        <h4>{{ heading }}</h4>
        <wa-scroller orientation="vertical" style="max-height: 300px">
            <wa-dropdown-item v-for="item in items" @click="handleClick(item)">
                {{ item.text }}
            </wa-dropdown-item>
        </wa-scroller>
    </wa-dropdown>
</template>

<style scoped>
.name {
    font-weight: 700;
    font-size: 1.25rem;
    color: var(--text-color);
}

.reassign-chevron {
    visibility: hidden;
}

.reassign-popover:hover .reassign-chevron {
    visibility: visible;
}
</style>
