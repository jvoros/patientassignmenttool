<script setup lang="ts">
import { computed } from "vue";
import type { Shift } from "~/server/core/types";

const { board, config } = useBoard();

const getShiftTotal = (shift: Shift): number => {
    return (
        (shift.assigned || 0) + (shift.triaged || 0) + (shift.supervised || 0)
    );
};

const activeShifts = computed<Shift[]>(() => {
    if (!board.value?.shifts) return [];
    const shifts = Object.values(board.value.shifts);
    const schedule = config.value?.schedule || [];
    const scheduleMap = new Map(schedule.map((item, idx) => [item.name, idx]));

    return shifts.sort((a, b) => {
        const orderA = scheduleMap.get(a.name) ?? 999;
        const orderB = scheduleMap.get(b.name) ?? 999;
        return orderA !== orderB
            ? orderA - orderB
            : a.last.localeCompare(b.last);
    });
});

// Highest patient load across active shifts (at least 1 to prevent division by zero)
const maxShiftTotal = computed(() =>
    Math.max(...activeShifts.value.map((s) => getShiftTotal(s)), 0),
);

// Chart ceiling (adds 1 unit of breathing room above the highest bar)
const yMax = computed(() => Math.max(maxShiftTotal.value + 1, 1));

// Integer grid ticks from 0 up to yMax
const yTicks = computed(() =>
    Array.from({ length: yMax.value + 1 }, (_, i) => i),
);
</script>

<template>
    <div class="mt-8 p-4 select-none">
        <!-- Header -->
        <SectionHeader :title="`Distribution: ${activeShifts.length} shifts`" />

        <!-- Empty State -->
        <UEmpty
            v-if="activeShifts.length === 0"
            description="No shifts on rotation yet."
        />

        <!-- Bars Grid Container -->
        <div v-else class="w-full h-56 -mt-2">
            <svg
                class="w-full h-full overflow-visible"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <!-- Y-Axis Integer Grid Lines -->
                <g class="grid-lines">
                    <line
                        v-for="tick in yTicks"
                        :key="tick"
                        x1="0"
                        :y1="100 - (tick / yMax) * 100"
                        x2="100"
                        :y2="100 - (tick / yMax) * 100"
                        stroke="currentColor"
                        class="text-neutral-200 dark:text-neutral-800"
                        stroke-width="0.5"
                    />
                </g>

                <!-- Bars -->
                <g v-for="(shift, i) in activeShifts" :key="shift.id">
                    <rect
                        :x="i * (100 / activeShifts.length) + 1"
                        :y="100 - (getShiftTotal(shift) / yMax) * 100"
                        :width="100 / activeShifts.length - 2"
                        :height="(getShiftTotal(shift) / yMax) * 100"
                        class="fill-current transition-all duration-300"
                        :style="
                            shift.role === 'physician'
                                ? 'color: hsl(248, 87%, 79%)'
                                : 'color: hsl(248, 87%, 92%)'
                        "
                        rx="1"
                    />
                </g>
            </svg>

            <!-- Provider Labels Below -->
            <div class="flex justify-between mt-2">
                <div
                    v-for="shift in activeShifts"
                    :key="shift.id"
                    class="flex-1 min-w-0 text-center"
                >
                    <div class="text-xs truncate" :title="shift.last">
                        {{ shift.last }}
                    </div>
                    <div class="text-xs text-dimmed">
                        {{ getShiftTotal(shift) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
