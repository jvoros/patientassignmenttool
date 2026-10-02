<script setup>
import { computed, ref } from "vue";

// HELPERS
/**
 * Calculates percentage rounded to the nearest integer.
 * Returns 0 if total capacity is zero or invalid to prevent NaN.
 */
function calculatePercentage(portion, total) {
    if (!total || total <= 0) return 0;
    const percentage = (portion / total) * 100;
    return Math.round(percentage);
}

const numbers = ref(Array.from({ length: 101 }, (_, index) => index));

// CONSTANTS
// Maximum physical ED treatment spaces
const MAX_PHYSICAL_CAPACITY = 40;

// Base staffing ratio: 1 ED nurse can care for up to 5 standard ED patients
const STANDARD_PATIENTS_PER_NURSE = 5;

// Specific patient workload ratios
const ICU_PATIENTS_PER_NURSE = 2;
const CRITICAL_PATIENTS_PER_NURSE = 1;
const ADMIT_PATIENTS_PER_NURSE = 5;

// Convert non-standard patients into equivalent standard ED patient workload:
// e.g., 1 Critical patient (1:1) takes the bandwidth of 5 standard ED patients (5:1).
const ICU_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / ICU_PATIENTS_PER_NURSE;
const CRITICAL_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / CRITICAL_PATIENTS_PER_NURSE;
const ADMIT_WORKLOAD_MULTIPLIER =
    STANDARD_PATIENTS_PER_NURSE / ADMIT_PATIENTS_PER_NURSE;

// INPUTS
const nurseCount = ref(0);
const standardEdPatients = ref(0);
const admitPatients = ref(0);
const icuPatients = ref(0);
const criticalPatients = ref(0);

// CALCULATED VALUES
// Staffed capacity constrained by physical treatment spaces
const totalCapacity = computed(() => {
    const staffedCapacity = nurseCount.value * STANDARD_PATIENTS_PER_NURSE;
    return Math.min(staffedCapacity, MAX_PHYSICAL_CAPACITY);
});

// Convert all boarders/holds into equivalent standard ED patient workload units
const holdEquivalentPatients = computed(() => {
    const criticalEquivalent =
        criticalPatients.value * CRITICAL_WORKLOAD_MULTIPLIER;
    const icuEquivalent = icuPatients.value * ICU_WORKLOAD_MULTIPLIER;
    const admitEquivalent = admitPatients.value * ADMIT_WORKLOAD_MULTIPLIER;

    return criticalEquivalent + icuEquivalent + admitEquivalent;
});

// Capacity remaining after accounting for holds and standard ED patients
const remainingCapacity = computed(() => {
    return (
        totalCapacity.value -
        holdEquivalentPatients.value -
        standardEdPatients.value
    );
});

// Percentage utilization metrics
const holdCapacityUsedPct = computed(() => {
    return calculatePercentage(
        holdEquivalentPatients.value,
        totalCapacity.value,
    );
});

const edPatientsUsedPct = computed(() => {
    return calculatePercentage(standardEdPatients.value, totalCapacity.value);
});

const capacityUsedPct = computed(() => {
    return calculatePercentage(
        holdEquivalentPatients.value + standardEdPatients.value,
        totalCapacity.value,
    );
});

const remainingCapacityPct = computed(() => {
    return calculatePercentage(remainingCapacity.value, totalCapacity.value);
});

// SURGE LEVELS
const holdSurgeLevel = computed(() => {
    const pctUsed = holdCapacityUsedPct.value;
    if (pctUsed < 10) return "green";
    if (pctUsed < 20) return "yellow";
    if (pctUsed < 30) return "orange";
    if (pctUsed < 50) return "red";
    return "black";
});

const edSurgeLevel = computed(() => {
    const pctUsed = edPatientsUsedPct.value;
    if (pctUsed < 90) return "green";
    if (pctUsed < 100) return "yellow";
    if (pctUsed < 120) return "orange";
    if (pctUsed < 130) return "red";
    return "black";
});

const styles = {
    resultBox: "flex flex-col items-center border rounded p-2",
    neutral: "border-muted",
    green: "border-green-600 bg-green-200",
    yellow: "border-amber-400 bg-amber-200",
    orange: "border-orange-400 bg-orange-300",
    red: "border-red-500 bg-red-400",
    black: "border-gray-500 bg-neutral-900 text-white",
};

function reset() {
    [
        nurseCount,
        standardEdPatients,
        admitPatients,
        icuPatients,
        criticalPatients,
    ].forEach((v) => (v.value = 0));
}
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
                        v-model="nurseCount"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="ED Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="standardEdPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="Admits:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="admitPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="ICU Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="icuPatients"
                        :items="numbers"
                    />
                </UFormField>
                <UFormField label="1:1 Pts:">
                    <USelect
                        size="lg"
                        class="w-25"
                        v-model="criticalPatients"
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
