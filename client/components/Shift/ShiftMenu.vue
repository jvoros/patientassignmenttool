<script setup>
import { ref, computed } from "vue";
import { useApi, useSite } from "&";
import { Menu, UserPlus, Smile, X } from "lucide-vue-next";

const props = defineProps(["shift", "zone"]);

const api = useApi();
const site = useSite();

// FLAGS
const isApp = computed(() => props.shift.role === "app");
const hasPatients = computed(() => Object.values(props.shift.counts).length > 0);
const cannotLeave = computed(() => {
  const docCount = props.zone.shifts.filter((shift) => shift.role === "physician").length;
  return !isApp.value && props.zone.type.includes("super") && docCount < 2;
});

// DIALOGS
const deleteDialogOpen = ref(false);
const deleteDialogToggle = () => {
  deleteDialogOpen.value = !deleteDialogOpen.value;
};

const assignDialogOpen = ref(false);
const assignDialogToggle = () => {
  assignDialogOpen.value = !assignDialogOpen.value;
};

// HANDLERS
const signOut = () => {
  if (cannotLeave.value) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.signOut]", error);
    site.setError(error);
    return;
  }
  api.post("/api/board/signOut", { shiftId: props.shift.id });
};

const deleteDialogMenuClick = () => {
  if (cannotLeave.value) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.deleteMenu]", error);
    site.setError(error);
    return;
  }
  if (hasPatients.value) {
    const error = "Cannot Delete shift. Already has patients assigned";
    console.warn("[ShiftMenu.deleteMenu]", error);
    site.setError(error);
    return;
  }
  deleteDialogToggle();
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <div class="px-1"><Menu size="16" /></div>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      class="w-56 bg-white shadow-lg dark:bg-background border-slate-200"
    >
      <DropdownMenuLabel>Shift Tools</DropdownMenuLabel>
      <DropdownMenuSeparator class="bg-secondary" />

      <ShiftMenuChangePosition :zoneId="props.zone.id" :shiftId="props.shift.id" />

      <DropdownMenuItem @click="assignDialogToggle"> <UserPlus />Assign Patient </DropdownMenuItem>
      <DropdownMenuSeparator class="bg-secondary" />

      <ShiftMenuPause v-if="isApp" :shift="shift" />

      <ShiftMenuZones
        :shiftId="props.shift.id"
        :zoneId="props.zone.id"
        :isApp="isApp"
        :cannotLeave="cannotLeave"
      />

      <DropdownMenuItem @click.stop="deleteDialogMenuClick"><X />Delete Shift </DropdownMenuItem>
      <DropdownMenuItem @click="signOut"> <Smile />Sign Out </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>

  <ShiftMenuDeleteDialog
    :open="deleteDialogOpen"
    @close="deleteDialogToggle"
    :hasPatients="hasPatients"
    :shiftId="shift.id"
  />

  <ShiftMenuAssignDialog
    :open="assignDialogOpen"
    @close="assignDialogToggle"
    :zoneId="props.zone.id"
    :shiftId="shift.id"
  />
</template>
