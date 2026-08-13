<script setup lang="ts">
const { board, initializeBoard } = useBoard();
initializeBoard();
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
