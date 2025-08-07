<script setup>
import { ListFilter } from "lucide-vue-next";
import { board, getShiftIdsAlphabetized } from "./store.js";

const { setFilter, filteredShiftId } = defineProps([
    "setFilter",
    "filteredShiftId",
]);
</script>

<template>
    <wa-dropdown placement="bottom-end" distance="10">
        <button slot="trigger" class="unbutton">
            <span v-if="filteredShiftId !== ''">
                {{ board.shifts[filteredShiftId]?.first }}
                {{ board.shifts[filteredShiftId]?.last }}
            </span>
            <span v-else> FILTER </span>
            <ListFilter size="14" slot="end" />
        </button>

        <template v-if="!filteredShiftId">
            <h4>Show only:</h4>
            <wa-dropdown-item
                v-for="shiftId in getShiftIdsAlphabetized()"
                @click="setFilter(shiftId)"
            >
                {{ board?.shifts[shiftId].first }}
                {{ board?.shifts[shiftId].last }}
            </wa-dropdown-item>
        </template>
        <wa-dropdown-item @click="setFilter('')" v-else>
            <wa-icon name="xmark" slot="icon"></wa-icon> Clear Filter
        </wa-dropdown-item>
    </wa-dropdown>
</template>
