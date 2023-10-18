<script setup>
  const props = defineProps({
    error: String
  });
</script>

<template>
  <div class="notification is-danger is-light">{{ error }}</div>
</template>

<style scoped>
  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>