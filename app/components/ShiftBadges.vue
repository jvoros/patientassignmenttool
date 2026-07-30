<script setup lang="ts">
const props = defineProps<{
    isSuper?: boolean;
    isPaused?: boolean;
    isSkipped?: boolean;
    isBonus?: boolean;
    bonus?: number;
}>();

const styles = computed(() => ({
    bonusBadge:
        "self-center bg-amber-100 text-amber-500 border border-amber-500",
    superBadge: "bg-sky-300 self-center border border-sky-400",
    pausedBadge: "bg-orange-400 self-center",
    skippedBadge: "bg-orange-400 self-center",
}));
</script>

<template>
    <UBadge
        v-if="isSuper"
        :class="styles.superBadge"
        size="sm"
        title="Supervisor"
    >
        <span class="flex md:hidden">S</span>
        <span class="hidden md:flex">SUPER</span>
    </UBadge>
    <UBadge
        v-if="isPaused"
        :class="styles.pausedBadge"
        size="sm"
        label="PAUSED"
    />
    <UBadge
        v-if="isSkipped"
        :class="styles.skippedBadge"
        size="sm"
        label="SKIP"
    />
    <UBadge
        v-if="isBonus"
        :class="styles.bonusBadge"
        icon="lucide:rocket"
        title="Bonus"
        :label="bonus"
    />
</template>
