<script setup>
import { cn } from "@/lib/utils";

const props = defineProps({
  class: { type: null, required: false },
});
</script>

<template>
  <div :class="cn('text-sm [&_p]:leading-relaxed flex gap-2', props.class)">
    <slot />
  </div>
</template>
