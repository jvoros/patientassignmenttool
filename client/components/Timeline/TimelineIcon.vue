<script setup>
import { computed } from "vue";
import { Info, Activity, UserPlus, Siren, Zap } from "lucide-vue-next";
const props = defineProps(["icon"]);

const styles = {
  event: "bg-background border-0",
  ambo: "bg-red-300 border-red-400 text-red-600",
  walkin: "bg-yellow-200 border-yellow-400 text-yellow-600",
  ft: "bg-ft border-ft-outline text-ft-outline",
  police: "bg-blue-200 border-blue-400",
};
const classes = computed(() => styles[props.icon]);
</script>
<template>
  <div class="p-1 border rounded-xl" :class="classes">
    <Info size="18" v-if="icon === 'event'" />
    <Activity size="14" v-if="icon === 'ambo'" />
    <UserPlus size="14" v-if="icon === 'walkin'" />
    <Siren size="14" v-if="icon === 'police'" />
    <Zap size="14" v-if="icon === 'ft'" />
  </div>
</template>
