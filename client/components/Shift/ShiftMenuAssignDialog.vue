<script setup>
defineProps(["zoneId", "shiftId", "open", "afterAssignFired"]);
const emit = defineEmits(["close"]);
</script>
<template>
  <Dialog :open="open">
    <DialogContent class="w-80" @interact-outside="emit('close')">
      <DialogHeader>
        <DialogTitle>Assign Patient Out of Rotation</DialogTitle>
        <DialogDescription>
          Assigning the patient here will not affect the rotation.
        </DialogDescription>
      </DialogHeader>
      <AssignForm :zoneId="zoneId" :shiftId="shiftId" @assignFired="emit('close')" />
    </DialogContent>
  </Dialog>
</template>
