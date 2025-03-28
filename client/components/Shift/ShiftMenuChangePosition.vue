<script setup>
import { useApi } from "&";
const props = defineProps(["zoneId", "shiftId"]);

const api = useApi();
const changePosition = (dir) => {
  api.post("/api/board/changePosition", {
    zoneId: props.zoneId,
    shiftId: props.shiftId,
    direction: dir,
  });
};
</script>
<template>
  <DropdownMenuItem @click="changePosition(-1)">&uarr; &nbsp;Move Up</DropdownMenuItem>
  <DropdownMenuItem @click="changePosition(1)">&darr; &nbsp;Move Down</DropdownMenuItem>
  <DropdownMenuSeparator class="bg-secondary" />
</template>
