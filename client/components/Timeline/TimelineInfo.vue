<script setup>
const props = defineProps(["event"]);
</script>
<template>
  <div class="font-mono text-xs">{{ event.time }}</div>
  <div class="font-mono text-xs">{{ event.message }}</div>
</template>
