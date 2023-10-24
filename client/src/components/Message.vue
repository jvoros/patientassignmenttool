<script setup>
  import { onMounted, Transition } from 'vue'

  const props = defineProps({
    severity: {
      type: String,
      default: 'default'
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

 function getStyles() {
    const s = {
      'default': 'bg-gray-50',
      'warn': 'bg-yellow-50 border border-solid border-amber-400 text-amber-600',
      'error': 'bg-red-50 border border-solid border-red-400 text-red-400'
      }
    return s[props.severity];
  };

  function getIcon() {
    const s = {
      info: 'fa-circle-info',
      success: 'fa-triangle-exclamation',
      warn: 'fa-triangle-exclamation',
      error: 'fa-circle-xmark'
    }
    return s[props.severity];
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
    <div class="m-4 py-2 px-4 rounded flex flex-row items-start justify-between gap-x-4 shadow-sm" :class="getStyles()">
      <div class=""><i class="fa-solid" :class="getIcon()"></i></div>
      <div><slot /></div>
      <div><i class="fa-solid fa-xmark" @click="close"></i></div>
    </div>
  </Transition>
</template>
