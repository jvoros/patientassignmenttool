<script setup>
defineProps(["zones"]);
</script>
<template>
  <div v-for="zone in zones">
    <BoardHeader>{{ zone.name }}</BoardHeader>
    <InstructionBox v-if="zone.instruction">{{ zone.instruction }}</InstructionBox>
    <Zone :zone="zone" />
  </div>
</template>
