<script setup>
import Icon from "./Icons.vue";
const props = defineProps({
  action: String,
});

function getClasses() {
  if (props.action === "ambo") return "bg-red-100";
  if (props.action === "walk-in") return "bg-blue-100";
  if (props.action === "fasttrack") return "bg-green-200";
  if (props.action === "bonus") return "bg-amber-100";
  return "bg-gray-200";
}

function getIcon() {
  if (["ambo", "walk-in", "fasttrack", "bonus"].includes(props.action))
    return props.action;
  return "bell";
}
</script>
<template>
  <span
    class="flex items-center justify-center w-8 h-8 rounded-full"
    :class="getClasses()"
  >
    <Icon :icon="getIcon()" />
  </span>
</template>
