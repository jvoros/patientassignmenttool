<script setup lang="ts">
import { clsx } from "clsx";
import type { Shift } from "../../server/core/types";
import type { ShiftFlags } from "../utils/shiftFlags";

const { board } = useBoard();
const props = defineProps<{
    shiftId: string;
    flags: ShiftFlags | null;
    zoneSlug: string | null;
}>();

const shift = computed<Shift | undefined>(
    () => board.value?.shifts[props.shiftId],
);

const useNextHighlight = computed(() => {
    return props.flags?.isNext && props.flags?.isRotating;
});

const showAssigns = ref(false);

const getShiftStyles = (flags: ShiftFlags) => ({
    card: clsx(
        "md:rounded md:mb-4 dark:bg-neutral-800 border group",
        useNextHighlight.value
            ? "border-2 border-amber-300 bg-yellow-50"
            : "bg-white border-neutral-300",
    ),
    nextBanner: clsx(
        "hidden bg-amber-300 text-xs justify-around font-bold text-white",
        useNextHighlight.value && "md:flex",
    ),
    menuBar: clsx(
        "first:rounded-t hidden md:flex items-center justify-between uppercase text-xs font-medium py-1 px-2",
        useNextHighlight.value
            ? "text-amber-500 bg-amber-100"
            : "text-dimmed md:text-muted md:bg-neutral-100 dark:md:bg-neutral-700",
    ),
    content: clsx(
        "px-2 py-3 md:px-3 md:pt-3 flex justify-between",
        flags.isOff && "text-neutral-500 bg-neutral-100 dark:bg-neutral-800",
    ),
    providerName: "font-bold text-lg md:text-2xl",
});

const styles = computed(() =>
    props.flags ? getShiftStyles(props.flags) : null,
);
</script>

<template>
    <div v-if="shift" :class="styles?.card">
        <!-- NEXT BANNER -->
        <div v-if="flags?.isNext" :class="styles?.nextBanner">NEXT</div>

        <!-- MENU BAR -->
        <div :class="styles?.menuBar">
            <div class="hidden md:flex">
                <ShiftMeta :shift="shift" />
            </div>
            <div class="flex gap-3">
                <AssignPop
                    variant="shift"
                    :shiftId="shift.id"
                    :zoneSlug="zoneSlug"
                >
                    <UIcon
                        class="cursor-pointer size-5"
                        name="fa7-solid:user-plus"
                        title="Assign off rotation"
                    />
                </AssignPop>
                <ShiftMenu
                    :shift="shift"
                    :zoneSlug="zoneSlug"
                    :showAssigns="showAssigns"
                    @toggle-assigns="showAssigns = !showAssigns"
                />
            </div>
        </div>

        <!-- MAIN CONTENT -->
        <div :class="styles?.content">
            <!-- LEFT SIDE W/NAME -->
            <div>
                <!-- META INFO ONLY ON SMALL -->
                <div class="md:hidden flex text-xs uppercase text-dimmed">
                    <ShiftMenu
                        :shift="shift"
                        :zoneSlug="zoneSlug"
                        class="mr-2"
                    />

                    <ShiftMeta :shift="shift" />
                </div>
                <!-- NAME -->
                <div :class="styles?.providerName">
                    {{ shift.first }} {{ shift.last }}
                </div>
            </div>

            <!-- RIGHT SIDE WITH BUTTONS & BADGES -->
            <div class="flex gap-2" v-if="!flags?.isOff">
                <ShiftBadges
                    :isSuper="flags?.isSuper"
                    :isPaused="flags?.isPaused"
                    :isSkipped="flags?.isSkipped"
                    :isBonus="shift.bonus > shift.assigned"
                    :bonus="shift.bonus - shift.assigned"
                />
                <ShiftButtons
                    :shiftId="shiftId"
                    :zoneSlug="zoneSlug"
                    :isNext="flags?.isNext"
                />
            </div>
        </div>
        <ShiftLatestAssigns v-if="showAssigns" :shiftId="shiftId" />
    </div>
</template>
