<script setup>
import { ref, computed, useTemplateRef } from "vue";
import { site, dispatch } from "./store.js";

const popover = useTemplateRef("signin-popover");
const selectedClinician = ref("");
const selectedShift = ref("");
const resets = [selectedClinician, selectedShift];
const isComplete = computed(() => resets.every((el) => el.value !== ""));
const isResetShift = computed(
    () => selectedShift.value === JSON.stringify(site.value.schedule[0] ?? ""),
);

const onHide = () => {
    resets.forEach((r) => {
        r.value = "";
    });
};

const addToBoard = () => {
    const payload = {
        provider: JSON.parse(selectedClinician.value),
        schedule: JSON.parse(selectedShift.value),
    };
    dispatch("signIn", payload);
    popover.value.hide();
};
</script>

<template>
    <wa-button id="popover__addClinician" size="small" with-caret>
        <wa-icon name="stethoscope" slot="start"></wa-icon>
        Add Clinician
    </wa-button>

    <wa-popover
        for="popover__addClinician"
        placement="bottom"
        style="--arrow-size: 0"
        ref="signin-popover"
        @wa-after-hide.self="onHide"
    >
        <section>
            <wa-select placeholder="Clinician" v-model="selectedClinician">
                <template v-for="provider in site.providers">
                    <wa-option :value="JSON.stringify(provider)">
                        {{ provider.first }} {{ provider.last }}
                    </wa-option>
                </template>
            </wa-select>

            <wa-select placeholder="Shift" v-model="selectedShift">
                <template v-for="schedule in site.schedule">
                    <wa-option :value="JSON.stringify(schedule)">
                        {{ schedule.name }}
                    </wa-option>
                </template>
            </wa-select>

            <div class="warn" v-if="isResetShift">
                Adding <b>{{ site.schedule[0].name }}</b> <br />will reset
                board.
            </div>

            <wa-button
                size="small"
                style="width: 100%"
                :disabled="!isComplete"
                @click="addToBoard"
            >
                Add to Board
            </wa-button>
        </section>
    </wa-popover>
</template>

<style scoped>
section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.warn {
    color: var(--color-warn);
    background: var(--bg-warn);
    padding: var(--padding-half);
    border-radius: var(--radius);
    text-align: center;
}

span {
    font-weight: bold;
}
</style>
