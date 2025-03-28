<script setup>
import { ref, computed } from "vue";
import { Stethoscope, ChevronDown } from "lucide-vue-next";
import { useApi, useSite } from "&";

const site = useSite();
const open = ref(false);

const selectedProvider = ref(null);
const activeProvider = computed(() => {
  if (!selectedProvider.value) return null;
  const provider = JSON.parse(selectedProvider.value);
  return `${provider.last}, ${provider.first}`;
});

const selectedSchedule = ref(null);
const activeSchedule = computed(() => {
  if (!selectedSchedule.value) return null;
  const schedule = JSON.parse(selectedSchedule.value);
  return schedule.name;
});

const resetShiftSelected = computed(
  () => selectedSchedule.value === JSON.stringify(site.store.details.schedule[0])
);

const reset = () => {
  selectedProvider.value = null;
  selectedSchedule.value = null;
};

const formIncomplete = computed(() => {
  return !selectedProvider.value || !selectedSchedule.value;
});

const api = useApi();
const signIn = async () => {
  open.value = false;
  if (resetShiftSelected.value) {
    await api.post("/api/board/boardReset");
  }
  api.post("/api/board/signIn", {
    provider: JSON.parse(selectedProvider.value),
    schedule: JSON.parse(selectedSchedule.value),
  });
  reset();
};
</script>

<template>
  <Popover :open="open" @update:open="open = !open">
    <PopoverTrigger>
      <Button><Stethoscope />Add Clinician <ChevronDown /></Button>
    </PopoverTrigger>
    <PopoverContent
      @interactOutside="reset"
      class="flex flex-col gap-2 p-4 shadow-lg border-slate-200"
      align="end"
    >
      <Select v-model="selectedProvider">
        <SelectTrigger class="focus:ring-accent">
          {{ selectedProvider ? activeProvider : "Clinician:" }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div v-for="provider in site.store.details.providers">
              <SelectItem :value="JSON.stringify(provider)">
                {{ provider.last }}, {{ provider.first }}
              </SelectItem>
              <SelectSeparator />
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select v-model="selectedSchedule">
        <SelectTrigger class="bg-white focus:ring-accent">
          {{ selectedSchedule ? activeSchedule : "Shift:" }}
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <div v-for="shift in site.store.details.schedule">
              <SelectItem :value="JSON.stringify(shift)">{{ shift.name }}</SelectItem>
              <SelectSeparator />
            </div>
          </SelectGroup>
        </SelectContent>
      </Select>

      <div v-if="resetShiftSelected">
        <Alert variant="warn">
          <AlertDescription>
            <div>
              Assigning <b>{{ site.store.details.schedule[0].name }}</b> shift will restart the
              board for a new day.<br />
            </div>
          </AlertDescription>
        </Alert>
      </div>

      <Button @click="signIn" :disabled="formIncomplete ?? null">Add to Board</Button>
    </PopoverContent>
  </Popover>
</template>
