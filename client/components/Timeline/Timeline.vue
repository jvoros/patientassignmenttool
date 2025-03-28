<script setup>
defineProps(["timeline"]);
</script>
<template>
  <BoardHeader>Timeline</BoardHeader>
  <InstructionBox> Click provider or room number to change. </InstructionBox>
  <TimelineLine>
    <template v-for="(event, index) in timeline">
      <TimelineNode :event="event" />
      <TimelineUndo v-if="index === 0" />
    </template>
  </TimelineLine>
</template>
