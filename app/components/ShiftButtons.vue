<script setup lang="ts">
const props = defineProps<{
    zoneSlug: string;
    shiftId: string;
    isNext: boolean;
}>();
</script>
<template>
    <div class="flex gap-1">
        <ShiftTriageButton v-if="zoneSlug === 'ft'" :shiftId="shiftId" />
        <AssignPop
            v-if="isNext"
            class="self-center"
            :shiftId="shiftId"
            :zoneSlug="zoneSlug"
        >
            <UButton
                color="neutral"
                title="Assign Patient"
                leading-icon="fa7-solid:user-plus"
                trailing-icon="fa7-solid:caret-down"
            >
                <span class="hidden md:flex">Assign</span>
            </UButton>
        </AssignPop>
    </div>
</template>
