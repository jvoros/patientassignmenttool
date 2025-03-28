<script setup>
import { useSite } from "&";
const props = defineProps(["zone", "loading"]);
const site = useSite();
</script>
<template>
  <Loading v-if="site.store.board.loading" />
  <ZoneEmpty v-if="zone.shifts.length === 0" />
  <Shift v-for="shift in zone.shifts" :shift="shift" :zone="zone" />
  <ZoneControls :zone="zone" />
  <div class="mb-12"></div>
</template>
