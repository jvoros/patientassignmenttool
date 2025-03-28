<script setup>
import { computed } from "vue";
import { CirclePause, RotateCcw } from "lucide-vue-next";
import { useApi } from "&";

const props = defineProps(["shift"]);
const isSkipped = computed(() => props.shift.skip === 1);
const isPaused = computed(() => props.shift.skip > 1);

const api = useApi();
const togglePause = () => {
  const payload = { shiftId: props.shift.id };
  if (isPaused.value || isSkipped.value) {
    api.unpauseShift(payload);
  } else {
    api.pauseShift(payload);
  }
};
</script>
<template>
  <DropdownMenuItem v-if="!isSkipped && !isPaused" @click="togglePause">
    <CirclePause />Pause Shift
  </DropdownMenuItem>

  <DropdownMenuItem v-if="isPaused" @click="togglePause">
    <RotateCcw />Unpause Shift
  </DropdownMenuItem>

  <DropdownMenuItem v-if="isSkipped" @click="togglePause">
    <RotateCcw />Cancel Skip
  </DropdownMenuItem>

  <DropdownMenuSeparator class="bg-secondary" />
</template>
