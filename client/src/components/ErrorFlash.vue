<script setup>
  const props = defineProps({
    error: String
  });
</script>

<template>
  <section>
    <div class="error-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
    <div class="error-message">{{ error.text }}</div>
    <div class="error-close"><i class="fa-solid fa-xmark"></i></div>
  </section>
</template>

<style scoped>
  section {
    display: flex;
    background-color: var(--color-error-light);
    border-left: 5px solid var(--color-error);
    color: var(--color-error);
    border-radius: var(--border-radius);
    padding: var(--space) var(--space-md);
    margin: var(--space) 0 var(--space-lg);
  }

  .error-message {
    flex-grow: 1;
  }

  i {
    margin-right: var(--space);
    font-size: 2rem;
  }

  .v-enter-active,
  .v-leave-active {
    transition: opacity 0.5s ease;
  }

  .v-enter-from,
  .v-leave-to {
    opacity: 0;
  }
</style>