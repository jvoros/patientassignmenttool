<script setup>
import { computed } from "vue";
import { ChevronDown } from "lucide-vue-next";
import { useSite, useApi } from "&";
const props = defineProps(["event"]);

const site = useSite();
const api = useApi();

const otherShifts = computed(() => {
  const shifts = site.getShifts();
  const filterShifts = shifts.filter((shift) => shift.id !== props.event.shift.id);
  return filterShifts.sort((a, b) => a.provider.last.localeCompare(b.provider.last));
});

const reassignPatient = (newShiftId) => {
  api.reassign({ eventId: props.event.id, newShiftId });
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group">
      <div class="text-xl font-bold">
        {{ event.shift?.provider.first }} {{ event.shift?.provider.last }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="start" v-if="event.shift" class="min-w-52">
      <DropdownMenuLabel>Reassign to</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div v-for="shift in otherShifts">
        <DropdownMenuItem class="px-4" @click="reassignPatient(shift.id)">
          {{ shift.provider?.first }} {{ shift.provider?.last }}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
