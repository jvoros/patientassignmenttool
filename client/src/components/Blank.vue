<script setup>
import Icon from "./Icons.vue";
const props = defineProps(["message"]);
</script>
<template>
  <div
    class="bg-gray-100 p-10 rounded my-4 text-center text-gray-500 font-bold flex flex-col gap-y-4 content-center"
  >
    <div><Icon icon="info" color="gray" /></div>
    <div>{{ message }}</div>
  </div>
</template>
