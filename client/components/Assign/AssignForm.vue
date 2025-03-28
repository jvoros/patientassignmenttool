<script setup>
import { ref, computed, onUnmounted } from "vue";
import { useApi, useSite } from "&";
import { UserPlus, Activity, Zap, Siren } from "lucide-vue-next";

const props = defineProps(["zoneId", "shiftId"]);
const emit = defineEmits(["assignFired"]);

const site = useSite();
const selectedType = ref();
const selectedRoom = ref();

const formIncomplete = computed(() => {
  return !selectedType.value || !selectedRoom.value;
});

const api = useApi();
const assign = () => {
  if (!props.shiftId) {
    api.assignToZone({
      zoneId: props.zoneId,
      patient: { mode: selectedType.value, room: selectedRoom.value },
    });
  } else {
    api.assignToShift({
      zoneId: props.zoneId,
      shiftId: props.shiftId,
      patient: { mode: selectedType.value, room: selectedRoom.value },
    });
  }
  reset();
  emit("assignFired");
};

const reset = () => {
  selectedType.value = null;
  selectedRoom.value = null;
};

onUnmounted(() => {
  reset();
});
</script>
<template>
  <ToggleGroup type="single" variant="outline" class="justify-left" v-model="selectedType">
    <ToggleGroupItem
      value="walkin"
      aria-label="walkin"
      class="bg-white dark:bg-background dark:data-[state=on]:bg-slate-800"
    >
      <UserPlus class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="ambo"
      aria-label="ambulance"
      class="bg-white dark:bg-background dark:data-[state=on]:bg-slate-800"
    >
      <Activity class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="police"
      aria-label="police"
      class="bg-white dark:bg-background dark:data-[state=on]:bg-slate-800"
    >
      <Siren class="w-4 h-4" />
    </ToggleGroupItem>
    <ToggleGroupItem
      value="ft"
      aria-label="fast track"
      class="bg-white dark:bg-background dark:data-[state=on]:bg-slate-800"
    >
      <Zap class="w-4 h-4" />
    </ToggleGroupItem>
  </ToggleGroup>

  <Select v-model="selectedRoom">
    <SelectTrigger class="bg-white">{{ selectedRoom ? selectedRoom : "Room:" }}</SelectTrigger>
    <SelectContent class="max-h-80">
      <SelectGroup>
        <div v-for="room in site.store.details.rooms">
          <SelectItem :value="room">{{ room }}</SelectItem>
          <SelectSeparator />
        </div>
      </SelectGroup>
    </SelectContent>
  </Select>

  <Button @click="assign" :disabled="formIncomplete ?? null">Assign Patient</Button>
</template>
