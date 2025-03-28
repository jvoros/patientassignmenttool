<script setup>
const props = defineProps(["event"]);
</script>
<template>
  <div
    class="flex items-center justify-between px-4 py-2 bg-white border rounded-md border-outline dark:bg-secondary"
  >
    <div>
      <div class="font-mono text-xs">
        {{ event.time }}
      </div>

      <TimelineProvider :event="event" />

      <div class="text-sm text-muted-foreground">
        <div v-if="event.supervisorShift">
          Super: {{ event.supervisorShift.provider.first }}
          {{ event.supervisorShift.provider.last }}
        </div>
        <div v-if="event.type === 'reassign'">
          {{ event.message }}
        </div>
      </div>
    </div>

    <TimelineRoom :event="event" />
  </div>
</template>
