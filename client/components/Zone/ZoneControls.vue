<script setup>
import { useApi } from "&";
const props = defineProps(["zone"]);

const api = useApi();
const advanceRotation = (which, dir) => {
  api.advanceRotation({
    zoneId: props.zone.id,
    whichActive: which,
    direction: dir,
  });
};
</script>
<template>
  <div v-if="zone.type.includes('rotation')" class="flex justify-between mb-2">
    <Button variant="outline" @click="advanceRotation('patient', -1)">&larr; Rotation back</Button>
    <Button variant="outline" @click="advanceRotation('patient', 1)">Rotation skip &rarr;</Button>
  </div>
  <div v-if="zone.type.includes('super')" class="flex justify-between">
    <Button variant="outline" @click="advanceRotation('supervisor', -1)">&larr; Super back</Button>
    <Button variant="outline" @click="advanceRotation('supervisor', 1)">Super skip &rarr;</Button>
  </div>
</template>
