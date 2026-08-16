<script setup lang="ts">
const { board, initializeBoard, disconnect } = useBoard();
onMounted(initializeBoard);
onUnmounted(disconnect);
</script>

<template>
    <AppHeader />
    <UMain>
        <UContainer>
            <Board v-if="board" />
        </UContainer>
    </UMain>
    <AppFooter />
</template>
