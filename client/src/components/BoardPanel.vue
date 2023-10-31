<script setup>
const props = defineProps({
  header: {
    type: String,
    default: 'Header'
  }
})
</script>
<template>
  <div class="rounded border-gray-200">
    <h1 class="p-4 font-bold text-xl text-slate-800 border-b border-gray-200">{{  header }}</h1>
    <slot />
  </div>
</template>