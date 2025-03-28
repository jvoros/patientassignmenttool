<script setup>
import { computed } from "vue";
import { SquareArrowOutUpLeft, ArrowRightLeft, SquarePlus } from "lucide-vue-next";
import { useSite, useApi } from "&";

const props = defineProps(["zoneId", "shiftId", "isApp", "cannotLeave"]);
const site = useSite();

const otherZones = computed(() => {
  return [...site.store.board.zoneList1, ...site.store.board.zoneList2].filter(
    (zone) => zone.id !== props.zoneId && zone.id !== "off"
  );
});

const isInOtherZones = computed(() => {
  return otherZones.value.some((zone) => zone.shifts.some((shift) => shift.id === props.shiftId));
});

const api = useApi();
const leaveZone = () => {
  if (props.cannotLeave) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.leaveZone]", error);
    site.setError(error);
    return;
  }
  api.leaveZone({
    leaveZoneId: props.zoneId,
    shiftId: props.shiftId,
  });
};

const switchZone = (joinZoneId) => {
  if (props.cannotLeave) {
    const error = "Cannot leave zone. There must be at least one doctor in this zone.";
    console.warn("[ShiftMenu.switchZone]", error);
    site.setError(error);
    return;
  }
  api.switchZone({
    leaveZoneId: props.zoneId,
    joinZoneId: joinZoneId,
    shiftId: props.shiftId,
  });
};

const joinZone = (joinZoneId) => {
  api.joinZone({
    joinZoneId,
    shiftId: props.shiftId,
  });
};
</script>
<template>
  <DropdownMenuItem v-if="isInOtherZones" @click="leaveZone">
    <SquareArrowOutUpLeft />Leave this Zone
  </DropdownMenuItem>

  <DropdownMenuSub v-if="otherZones.length > 0">
    <DropdownMenuSubTrigger>
      <ArrowRightLeft size="14" class="mr-2" />Switch Zones
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent class="bg-white dark:bg-background">
      <DropdownMenuItem v-for="zone in otherZones" @click="switchZone(zone.id)">
        {{ zone.name }}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>

  <DropdownMenuSub v-if="otherZones.length > 0 && props.zoneId !== 'off'">
    <DropdownMenuSubTrigger>
      <SquarePlus size="14" class="mr-2" />Join Additional Zone
    </DropdownMenuSubTrigger>
    <DropdownMenuSubContent class="bg-white dark:bg-background">
      <DropdownMenuItem v-for="zone in otherZones" @click="joinZone(zone.id)">
        {{ zone.name }}
      </DropdownMenuItem>
    </DropdownMenuSubContent>
  </DropdownMenuSub>

  <DropdownMenuSeparator class="bg-secondary" />
</template>
