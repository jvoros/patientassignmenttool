<script setup>
import { board } from "./store.js";
import AlertBar from "./AlertBar.vue";
import Timeline from "./Timeline.vue";
import Zone from "./Zone.vue";
</script>

<template>
    <div class="container">
        <AlertBar />
        <main class="grid">
            <section class="grid-timeline">
                <Timeline />
            </section>
            <section class="grid-main">
                <Zone :slug="board.zoneOrder[0]" />
            </section>
            <section class="grid-other">
                <Zone v-for="slug in board.zoneOrder.slice(1)" :slug="slug" />
            </section>
        </main>
    </div>
</template>

<style scoped>
main {
    display: grid;
    grid-template-areas:
        "main"
        "other"
        "time";
}

@media screen and (min-width: 700px) {
    main {
        grid-template-areas:
            "time main"
            "time other";
        grid-gap: 0.5rem;
    }
}

@media screen and (min-width: 1200px) {
    main {
        grid-template-areas: "time main other";
        grid-template-columns: 4fr 5fr 4fr;
    }
}

.grid-timeline {
    grid-area: time;
}

.grid-main {
    grid-area: main;
}

.grid-other {
    grid-area: other;
}

section {
    border: 0px solid lightgray;
    padding: var(--padding);
}
</style>
