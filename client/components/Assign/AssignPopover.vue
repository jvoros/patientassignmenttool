<script setup>
import { ref } from "vue";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps(["zoneId"]);
const open = ref(false);
</script>
<template>
  <Popover :open="open" @update:open="open = !open" modal>
    <PopoverTrigger>
      <Button>Assign <ChevronDown /></Button>
    </PopoverTrigger>
    <PopoverContent align="end" class="flex flex-col gap-2 shadow-lg w-52 border-slate-200">
      <AssignForm :zoneId="zoneId" @assignFired="open = false" />
    </PopoverContent>
  </Popover>
</template>
