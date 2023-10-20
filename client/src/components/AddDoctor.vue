<script setup>
  const emit = defineEmits(['closeModal']);

  function close() {
    emit('closeModal');
  }
</script>

<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Add Doctor</p>
        <button class="delete" aria-label="close" @click.prevent="close"></button>
      </header>
      <section class="modal-card-body">
        <!-- Content ... -->
      </section>
    </div>
  </div>
</template>