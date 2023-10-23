<script setup>
  import { onMounted, Transition } from 'vue'

  const props = defineProps({
    severity: {
      type: String,
      default: null
    },
    closable: {
      type: Boolean,
      default: true
    },
    sticky: {
      type: Boolean,
      default: true
    }
  });

  const emit = defineEmits(['close']);

  function getIcon(severity) {
    const s = {
      info: 'fa-circle-info',
      success: 'fa-triangle-exclamation',
      warn: 'fa-triangle-exclamation',
      error: 'fa-circle-xmark'
    }
    return (s[severity]);
  };

  function close() {
    emit('close');
  };

  function closeAfterDelay() {
    setTimeout(() => {
      emit('close');
    }, 3000);
  };

  onMounted(() => {
    if (!props.sticky) closeAfterDelay();
  });

</script>

<template>
  <Transition>
    <section :class="severity">
      <div v-if="severity" class="message-icon"><i class="fa-solid" v-bind:class="getIcon(severity)"></i></div>
      <div class="message-content"><slot /></div>
      <div class="message-close"><i class="fa-solid fa-xmark" @click="close"></i></div>
    </section>
  </Transition>
</template>

<style scoped>
  section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: var(--color-near-white);
    color: var(--theme-text);
    /* border: 1px solid var(--color-moon-gray); */
    box-shadow: var(--shadow-sm);
    border-radius: var(--border-radius);
    padding: var(--space) var(--space-sm);
    margin: var(--space);
  }

  section.error {
    background-color: var(--color-error-light);
    color: var(--color-error);
    border-color: var(--color-error);
  }

  .message-content {
    flex-grow: 1;
    text-align: center;
  }

  .message-close {
    margin-left: var(--space-lg);
  }

  .message-close:hover {
    cursor: pointer;
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