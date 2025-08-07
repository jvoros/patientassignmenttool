<script setup>
import { computed } from "vue";
import { Menu } from "lucide-vue-next";
import { board, dispatch } from "./store.js";

const { shift, isPaused, zoneSlug } = defineProps([
    "shift",
    "isPaused",
    "zoneSlug",
]);

const otherZones = computed(() => {
    return Object.keys(board.value.zones).filter(
        (z) => z !== zoneSlug && z !== "off",
    );
});

const togglePause = () => {
    dispatch("togglePause", { shiftId: shift.id });
};

const alsoJoin = (value) => {
    dispatch("joinZone", { shiftId: shift.id, zoneSlug: value });
};

const switchZone = (value) => {
    dispatch("switchZone", {
        shiftId: shift.id,
        leaveZoneSlug: zoneSlug,
        joinZoneSlug: value,
    });
};

const leaveZone = (value) => {
    dispatch("leaveZone", { shiftId: shift.id, zoneSlug: value });
};

const deleteShift = () => {
    dispatch("deleteShift", { shiftId: shift.id });
};

const signOut = () => {
    dispatch("signOut", { shiftId: shift.id });
};
</script>

<template>
    <wa-dropdown distance="10" placement="bottom">
        <button class="unbutton" slot="trigger">
            <Menu size="16" />
        </button>
        <h4>Shift Menu</h4>
        <wa-dropdown-item v-if="!isPaused" @click="togglePause">
            <wa-icon name="circle-pause" slot="icon"></wa-icon>
            Pause Shift
        </wa-dropdown-item>
        <wa-dropdown-item v-if="isPaused" @click="togglePause">
            <wa-icon name="circle-play" slot="icon"></wa-icon>
            Unpause Shift
        </wa-dropdown-item>
        <wa-divider></wa-divider>
        <wa-dropdown-item>
            <wa-icon name="arrow-right-arrow-left" slot="icon"></wa-icon>
            Switch to Zone
            <template v-for="zone in otherZones">
                <wa-dropdown-item
                    slot="submenu"
                    @click="switchZone(board.zones[zone].slug)"
                >
                    {{ board.zones[zone].name }}
                </wa-dropdown-item>
            </template>
        </wa-dropdown-item>
        <wa-dropdown-item>
            <wa-icon name="plus" slot="icon"></wa-icon>
            Also Join Zone
            <template v-for="zone in otherZones">
                <wa-dropdown-item
                    slot="submenu"
                    @click="alsoJoin(board.zones[zone].slug)"
                >
                    {{ board.zones[zone].name }}
                </wa-dropdown-item>
            </template>
        </wa-dropdown-item>
        <wa-dropdown-item @click="leaveZone(zoneSlug)">
            <wa-icon name="arrow-left" slot="icon"></wa-icon>
            Leave this Zone
        </wa-dropdown-item>
        <wa-divider></wa-divider>
        <wa-dropdown-item
            variant="danger"
            @click="deleteShift()"
            v-if="shift.assigned + shift.supervised === 0"
        >
            <wa-icon name="trash" slot="icon"></wa-icon>
            Delete Shift
        </wa-dropdown-item>
        <wa-dropdown-item @click="signOut()">
            <wa-icon name="smile" slot="icon"></wa-icon>
            Sign Out
        </wa-dropdown-item>
    </wa-dropdown>
</template>

<style scoped>
.shiftmenu {
    min-width: 10rem;
}

[role="menuitem"] {
    position: relative;
}
</style>
