<script setup>
import { computed, ref } from "vue";
const {
    state,
    totalCapacity,
    remainingCapacity,
    capacityUsedPct,
    holdCapacityUsedPct,
    holdSurgeLevel,
    edSurgeLevel,
    reset,
} = useSurgeCalc();

const numbers = ref(Array.from({ length: 101 }, (_, index) => index));

const styles = {
    resultBox: "flex flex-col items-center border rounded p-2",
    neutral: "border-muted",
    green: "border-green-600 bg-green-200",
    yellow: "border-amber-400 bg-amber-200",
    orange: "border-orange-400 bg-orange-300",
    red: "border-red-500 bg-red-400",
    black: "border-gray-500 bg-neutral-900 text-white",
};
</script>

<template>
    <div class="calculator-container">
        <div
            class="mb-6 border border-muted rounded p-4 bg-neutral-100 dark:bg-neutral-700"
        >
            <span class="font-bold">Inputs</span>
            <USeparator />
            <UForm class="flex flex-wrap gap-4 justify-start mt-4">
                <UFormField label="Nurses:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="state.nurseCount"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="ED Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="state.standardEdPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="Admits:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="state.admitPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="ICU Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="state.icuPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="1:1 Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="state.criticalPatients"
                        :items="numbers"
                    />
                </UFormField>
            </UForm>
        </div>

        <div class="grid grid-cols-2 gap-6 mb-6">
            <div :class="[styles.resultBox, styles.neutral]">
                <span>Total Capacity</span>
                <span class="text-6xl">{{ totalCapacity }}</span>
            </div>
            <div :class="[styles.resultBox, styles.neutral]">
                <span>Remaining Capacity</span>
                <span class="text-6xl">{{ remainingCapacity }}</span>
            </div>
            <div :class="[styles.resultBox, styles[edSurgeLevel]]">
                <span>Percent Full</span>
                <span class="text-6xl">{{ capacityUsedPct }}%</span>
                <span class="capitalize">ED Surge: {{ edSurgeLevel }}</span>
            </div>
            <div :class="[styles.resultBox, styles[holdSurgeLevel]]">
                <span class="border-bottom">Percent Holds</span>
                <span class="text-6xl">{{ holdCapacityUsedPct }}%</span>
                <span class="capitalize">Hold Surge: {{ holdSurgeLevel }}</span>
            </div>
        </div>
        <UButton
            label="Reset"
            color="neutral"
            variant="subtle"
            size="xl"
            @click="reset"
        />

        <!-- <ul class="results">
            <li>
                <strong>Nurses Staffed:</strong>
                {{ nurseCount }}
            </li>
            <li>
                <strong>Total Staffed Capacity:</strong>
                {{ totalCapacity }}
            </li>
            <li>
                <strong>Remaining Capacity:</strong>
                {{ remainingCapacity }}
            </li>
            <li>
                <strong>Percent Full:</strong>
                {{ edPatientsUsedPct }}%
            </li>
            <li>
                <strong>Percent HOlds:</strong>
                {{ holdCapacityUsedPct }}%
            </li>
            <li>
                <strong>Hold Surge Level:</strong>
                {{ holdSurgeLevel }}
            </li>
            <li>
                <strong>ED Surge Level:</strong>
                {{ edSurgeLevel }}
            </li>
        </ul> -->
    </div>
</template>
