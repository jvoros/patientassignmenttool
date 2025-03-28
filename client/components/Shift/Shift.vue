<script setup>
import { computed } from "vue";
import { Users } from "lucide-vue-next";
const props = defineProps(["shift", "zone"]);

// tags
const tags = computed(() => {
  const { shift, zone } = props;
  const tags = [];
  if (zone.type.includes("rotation")) {
    tags.push("rotation");
  }
  if (zone.type.includes("ft")) {
    tags.push("ft");
  }
  if (
    (zone.active.patient === shift.id && zone.type.includes("rotation")) ||
    (zone.shifts[0].id === shift.id && zone.type.includes("zone_patient"))
  ) {
    tags.push("next");
  }
  if (zone.active.supervisor === shift.id) {
    tags.push("supervisor");
  }
  if (zone.id === "off") {
    tags.push("off");
  }
  if (shift.skip === 1) {
    tags.push("skipped");
  }
  if (shift.skip > 1) {
    tags.push("paused");
  }
  return tags;
});

// classes
const getClasses = () => {
  if (tags.value.includes("off")) {
    return {
      box: "bg-outline border-outline dark:bg-muted",
      content: "text-foreground2",
    };
  }
  if (tags.value.includes("rotation") && tags.value.includes("next")) {
    return {
      box: "border-next-outline bg-next dark:bg-muted",
      content: "",
    };
  }
  if (tags.value.includes("ft")) {
    return {
      box: "bg-ft border-ft-outline",
      content: "text-ft-foreground dark:bg-background",
    };
  }
  return { box: "bg-white border-outline dark:bg-background", content: "" };
};

// counts
const patientTotal = () =>
  Object.keys(props.shift.counts).reduce((acc, curr) => acc + props.shift.counts[curr], 0);
const supervisorTotal = () => props.shift.counts.supervisor ?? 0;
</script>

<template>
  <div class="my-4 overflow-hidden border rounded-md" :class="getClasses().box">
    <!-- NEXT FLAG -->
    <div
      class="font-bold text-white uppercase bg-next-outline rounded-t-sm text-[0.7rem] text-center"
      v-if="tags.includes('next') && tags.includes('rotation')"
    >
      next
    </div>
    <!-- SHIFT NAME & MENU BAR -->
    <div class="flex items-center justify-between px-2 py-1 bg-primary/5 text-foreground/40">
      <div class="text-[.8rem] font-bold uppercase">
        {{ shift.name }}
      </div>
      <ShiftMenu :shift="shift" :zone="zone" />
    </div>

    <!-- CONTENT  -->
    <div
      class="flex items-start justify-between px-2 pt-2 rounded-b-md"
      :class="getClasses().content"
    >
      <!-- PROVIDER NAME & COUNT -->
      <div>
        <h4 class="text-2xl font-bold">{{ shift.provider.first }} {{ shift.provider.last }}</h4>

        <div class="my-2 font-mono text-xs text-muted-foreground">
          Total: {{ patientTotal() }} &#x2022; Supervisor: {{ supervisorTotal() }}
        </div>
      </div>
      <!-- ROTATION FLAGS & ASSIGN BUTTON -->
      <div class="flex items-center gap-2 mt-2">
        <div
          v-if="tags.includes('supervisor')"
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-sky-400 rounded-xl"
        >
          <Users size="14" class="inline mr-2" />NEXT SUP
        </div>
        <div
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-slate-400 rounded-xl"
          v-if="tags.includes('paused') && tags.includes('rotation')"
        >
          PAUSED
        </div>
        <div
          class="px-2 py-1 text-[0.6rem] font-bold text-white bg-slate-400 rounded-xl"
          v-if="tags.includes('skipped') && tags.includes('rotation')"
        >
          SKIP NEXT
        </div>
        <div v-if="tags.includes('next')">
          <AssignPopover :zoneId="zone.id" />
        </div>
      </div>
    </div>
  </div>
</template>
