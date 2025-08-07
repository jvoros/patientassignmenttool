<script setup>
import { computed } from "vue";
import { board, dispatch } from "./store.js";
import ZoneHeader from "./ZoneHeader.vue";
import Shift from "./Shift.vue";

const { slug } = defineProps(["slug"]);
const zone = computed(() => board.value.zones[slug]);
const instructions = null;
const isRotation = computed(() =>
    ["rotation", "dual"].includes(zone.value.type),
);
const isSuperRot = computed(() => ["dual", "super"].includes(zone.value.type));
const isSuper = (ind) => zone.value.super === ind;
const isNext = (ind) => {
    const z = zone.value;
    return [z.next === ind, z.type === "simple" && ind === 0].some(
        (condition) => condition,
    );
};

const adjustRotation = (which, offset) => {
    dispatch("adjustRotation", { zoneSlug: slug, which, offset });
};
</script>

<template>
    <div class="zone">
        <ZoneHeader :title="zone.name" :inst="instructions" />
        <template v-for="(shiftId, index) in zone.shifts">
            <Shift
                :shiftId="shiftId"
                :zone="zone"
                :isNext="isNext(index)"
                :isSuper="isSuper(index)"
            />
        </template>
        <div class="zone-controls" v-if="isRotation">
            <wa-tooltip for="rotation-back">Move rotation back</wa-tooltip>
            <wa-button
                size="small"
                appearance="outlined filled"
                id="rotation-back"
                @click="adjustRotation('next', -1)"
            >
                <wa-icon name="chevron-left" slot="start"></wa-icon>
                Rotation
            </wa-button>
            <wa-tooltip for="rotation-forward">
                Move rotation forward
            </wa-tooltip>
            <wa-button
                size="small"
                appearance="outlined filled"
                id="rotation-forward"
                @click="adjustRotation('next', 1)"
            >
                Rotation
                <wa-icon name="chevron-right" slot="end"></wa-icon>
            </wa-button>
        </div>
        <div class="zone-controls" v-if="isSuperRot">
            <wa-tooltip for="super-back">Move supervisor back</wa-tooltip>
            <wa-button
                size="small"
                appearance="outlined filled"
                id="super-back"
                @click="adjustRotation('super', -1)"
            >
                <wa-icon name="chevron-left" slot="start"></wa-icon>
                Super
            </wa-button>
            <wa-tooltip for="super-forward">Move supervisor forward</wa-tooltip>
            <wa-button
                size="small"
                appearance="outlined filled"
                id="super-forward"
                @click="adjustRotation('super', 1)"
            >
                Super
                <wa-icon name="chevron-right" slot="end"></wa-icon>
            </wa-button>
        </div>
    </div>
</template>

<style scoped>
.zone {
    margin-bottom: 4rem;
}

.zone-controls {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
}
</style>
