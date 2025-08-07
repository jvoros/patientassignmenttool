<script setup>
const { title, inst } = defineProps(["title", "inst"]);
</script>

<template>
    <div>
        <div class="title">
            <h2>{{ title }}</h2>
            <span><slot></slot></span>
        </div>

        <aside v-if="inst">{{ inst }}</aside>
    </div>
</template>

<style scoped>
div {
    margin-bottom: 1rem;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--border);
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
}

h2 {
    font-size: 1.1rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0;
}

aside {
    color: var(--text-muted);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--padding-half);
}
</style>
