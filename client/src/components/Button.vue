<script setup>
  const props = defineProps({
    variety: {
      type: String,
      default: 'base'
    }
  })
  const emit = defineEmits(['click']);

  function getStyles() {
      const styles = {
      'base': "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-neutral-900",
      'contrast': "bg-gray-900 text-gray-50 hover:bg-gray-700 font-light"
    }
    return styles[props.variety];
  }
</script>
<template>
  <button class="py-2 px-4 gap-x-2 flex items-center transition-colors duration-300 rounded" :class="getStyles()" @click="emit('click')">
    <slot />
  </button>
</template>