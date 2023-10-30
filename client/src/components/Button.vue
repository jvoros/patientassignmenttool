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
      'base': "bg-gray-200 border border-gray-300 hover:bg-gray-300 text-neutral-900 focus:border-blue-200",
      'contrast': "bg-gray-900 text-gray-50 hover:bg-gray-700 disabled:bg-gray-700 font-light",
      'ghost': "bg-transparent hover:bg-gray-200"
    }
    return styles[props.variety];
  }
</script>
<template>
  <button class="py-2 px-4 gap-x-2 flex justify-center items-center transition-colors duration-150 rounded" :class="getStyles()" @click="emit('click')">
    <slot />
  </button>
</template>