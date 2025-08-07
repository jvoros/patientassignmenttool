<script setup>
const { time, message } = defineProps(["time", "message"]);
</script>

<template>
  <div>
    <div>{{ time }}</div>
    <div>{{ message }}</div>
  </div>
</template>

<style scoped>
div {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  color: var(--text-muted);
}
</style>
