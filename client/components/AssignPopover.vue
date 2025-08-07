<script setup>
import { ref, computed, useTemplateRef } from "vue";
import { site, dispatch } from "./store.js";
import IconMode from "./IconMode.vue";

const { id, zoneSlug, variant } = defineProps(["id", "zoneSlug", "variant"]);

const assignPopover = useTemplateRef("assignPopover");
const selectedMode = ref("");
const selectedRoom = ref("");
const resets = [selectedMode, selectedRoom];
const isComplete = computed(() => resets.every((el) => el.value !== ""));
const onHide = () => {
    resets.forEach((r) => {
        r.value = "";
    });
};

const setMode = (mode) => {
    selectedMode.value = mode;
};

const modes = [
    { tool: "Walk In", slug: "walkin", icon: "user-plus" },
    { tool: "Fast Track", slug: "ft", icon: "bolt" },
    { tool: "Ambo", slug: "ambo", icon: "truck-medical" },
    { tool: "Police", slug: "police", icon: "shield-halved" },
];

const assign = () => {
    console.log("assign variant:", variant);

    if (variant === "zone") {
        dispatch("assignToZone", {
            zoneSlug,
            mode: selectedMode.value,
            room: selectedRoom.value,
        });
    } else {
        dispatch("assignToShift", {
            shiftId: id,
            zoneSlug,
            mode: selectedMode.value,
            room: selectedRoom.value,
        });
    }
    assignPopover.value.hide();
};
</script>

<template>
    <span :id="'popover__assign_' + id + zoneSlug + variant">
        <wa-button size="small" with-caret v-if="variant === 'zone'">
            <wa-icon name="user-plus" slot="start"></wa-icon>
            Assign
        </wa-button>
        <wa-icon name="user-plus" slot="icon" v-else></wa-icon>
    </span>

    <wa-popover
        :for="'popover__assign_' + id + zoneSlug + variant"
        ref="assignPopover"
        placement="bottom"
        style="--arrow-size: 0; --max-width: 15rem"
        @wa-after-hide.self="onHide"
    >
        <div>
            <h3 v-if="variant === 'shift'">Assign Off Rotation</h3>
            <wa-button-group size="small">
                <wa-button
                    v-for="mode in modes"
                    :appearance="
                        mode.slug === selectedMode ? 'outline' : 'filled'
                    "
                    @click="setMode(mode.slug)"
                >
                    <IconMode :mode="mode.slug" />
                </wa-button>
            </wa-button-group>
            <wa-select placeholder="Room" v-model="selectedRoom">
                <template v-for="room in site?.rooms">
                    <wa-option :value="room.toString()">
                        {{ room }}
                    </wa-option>
                </template>
            </wa-select>
            <wa-button
                size="small"
                style="width: 100%"
                :disabled="!isComplete"
                @click="assign()"
            >
                Assign
            </wa-button>
        </div>
    </wa-popover>
</template>

<style scoped>
div {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
}

h3 {
    font-weight: 600;
    font-size: 0.9rem;
    margin-bottom: 0;
}
</style>
