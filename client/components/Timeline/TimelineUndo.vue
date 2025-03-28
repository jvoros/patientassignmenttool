<script setup>
import { Undo2 } from "lucide-vue-next";
import { useApi } from "&";
const api = useApi();
</script>
<template>
  <div class="flex justify-end pb-4">
    <Button variant="outline" @click="api.undo"> <Undo2 class="mb-1" />Undo </Button>
  </div>
</template>
