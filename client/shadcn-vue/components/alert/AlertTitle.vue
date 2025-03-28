<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <h5 :class="cn('font-medium leading-none tracking-tight flex items-center gap-2', props.class)">
    <slot />
  </h5>
</template>
