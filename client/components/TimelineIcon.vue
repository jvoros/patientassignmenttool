<script setup>
import IconMode from "./IconMode.vue";
const { mode } = defineProps(["mode"]);
</script>

<template>
    <div class="tl-icon" :class="'tl-icon-' + mode">
        <IconMode :mode="mode" />
    </div>
</template>

<style scoped>
.tl-icon {
    --icon-color: var(--text-muted);
    --icon-border: var(--icon-color);
    --icon-background: var(--background);
    border-radius: var(--radius-round);
    border: 1px solid var(--icon-border);
    display: inline;
    padding: calc(var(--tl-icon-size) / 4);
    color: var(--icon-color);
    background-color: var(--icon-background);
    margin-left: calc(((var(--tl-icon-size) * -1.5) / 2) - 2px);
    line-height: calc(var(--tl-icon-size) * 0.8);
}

.tl-icon-info {
    --icon-border: var(--bg-color);
    --icon-background: var(--bg-color);
}

.tl-icon-ft {
    --icon-color: green;
    --icon-background: lightgreen;
}

.tl-icon-ambo {
    --icon-color: red;
    --icon-background: pink;
}

.tl-icon-walkin {
    --icon-color: var(--color-amber-500);
    --icon-background: lightyellow;
}

.tl-icon-police {
    --icon-color: blue;
    --icon-background: lightblue;
}
</style>
