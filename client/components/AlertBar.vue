<script setup>
import { TriangleAlert } from "lucide-vue-next";
import { error } from "./store.js";
</script>

<template>
    <div class="alert-bar" :class="{ active: error }">
        <TriangleAlert />
        <span>{{ error }}</span>
    </div>
</template>
<style scoped>
.alert-bar {
    display: flex;
    align-items: center;
    gap: 1rem;
    border: 1px solid var(--color-alert);
    background-color: var(--bg-highlight);
    color: var(--color-alert);
    border-radius: var(--radius);
    max-width: 45rem;
    min-height: 3rem;
    margin: 0 auto;
    padding: var(--padding-half);
    opacity: 0;
    visibility: hidden;
    transform: translateY(-0.5rem);
    transition: var(--transition);
}

.alert-bar.active {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    transition: var(--transition);
}
</style>
