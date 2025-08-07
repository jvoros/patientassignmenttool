<script setup>
import { computed } from "vue";
import { board } from "./store.js";
import ShiftMenu from "./ShiftMenu.vue";
import AssignPopover from "./AssignPopover.vue";

const { shiftId, zone, isNext, isSuper } = defineProps([
    "shiftId",
    "isNext",
    "isSuper",
    "zone",
]);
const shift = computed(() => board.value.shifts[shiftId]);
const isRot = computed(() => zone.type === "rotation" || zone.type === "dual");
const useNextFlag = computed(() => isNext && isRot.value);
const isSkipped = computed(() => shift.value.status === "skip" && isRot);
const isPaused = computed(() => shift.value.status === "paused" && isRot);
const isOffRot = computed(() => zone.slug === "off");
</script>

<template>
    <div class="shift" :class="{ next: useNextFlag, off: isOffRot }">
        <div v-if="useNextFlag" class="nextFlag">NEXT</div>
        <div class="menubar">
            <div class="shiftName">
                {{ shift.name }}
                <span class="bonus" v-if="shift.bonus > shift.assigned">
                    <b>Bonus:</b> {{ shift.bonus - shift.assigned }}
                </span>
            </div>

            <div class="menu">
                <AssignPopover
                    :id="shift.id"
                    :zoneSlug="zone.slug"
                    variant="shift"
                />
                <ShiftMenu
                    :isPaused="isPaused"
                    :shift="shift"
                    :zoneSlug="zone.slug"
                />
            </div>
        </div>
        <div class="content">
            <div>
                <div class="provider">{{ shift.first }} {{ shift.last }}</div>
                <div class="counts">
                    Total: {{ shift.assigned + shift.supervised }} • Supervised:
                    {{ shift.supervised }}
                </div>
            </div>
            <div class="buttons">
                <div class="badge skip-badge" v-if="isSkipped && isRot">
                    SKIP
                </div>
                <div class="badge pause-badge" v-if="isPaused && isRot">
                    PAUSED
                </div>
                <div class="badge super-badge" v-if="isSuper">SUPER</div>
                <AssignPopover
                    :id="shift.id"
                    :zoneSlug="zone.slug"
                    variant="zone"
                    v-if="isNext"
                />
            </div>
        </div>
    </div>
</template>

<style scoped>
.shift {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    margin-bottom: 1rem;
    background-color: var(--bg-highlight);
}

.menubar {
    display: flex;
    justify-content: space-between;
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
    background-color: var(--bg-muted);
    color: var(--text);
}

.menubar:first-child {
    border-top-left-radius: var(--radius);
    border-top-right-radius: var(--radius);
}

.next > .menubar {
    background-color: var(--bg-next-menu);
}

.shiftName {
    text-transform: uppercase;
    font-weight: 500;
}

.menu {
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.bonus {
    color: var(--color-amber-500);
    margin-left: 1rem;
}

.content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--padding-half);
    border-bottom-right-radius: var(--border);
    border-bottom-left-radius: var(--border);
}

.provider {
    font-weight: 700;
    font-size: 1.5rem;
    margin-bottom: 0.3rem;
}

.counts {
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 300;
    color: var(--text-muted);
}

.next {
    border-color: var(--color-amber-300);
    /* box-shadow: 0px 0px 2px 5px var(--color-amber-100); */
    background-color: var(--bg-next);
}

.nextFlag {
    background-color: var(--color-amber-300);
    color: white;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
}

.off {
    color: var(--text-muted);
    background-color: var(--bg-muted);
}

.buttons {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.badges {
    display: flex;
    gap: 0.25rem;
}

.badge {
    font-weight: 700;
    font-size: 0.7em;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius);
    color: white;
}

.super-badge {
    background-color: var(--color-sky-500);
}

.pause-badge {
    background-color: var(--color-alert);
}

.skip-badge {
    background-color: var(--color-orange-400);
}
</style>
