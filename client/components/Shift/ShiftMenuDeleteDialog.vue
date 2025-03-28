<script setup>
import { useApi } from "&";
const props = defineProps(["open", "shiftId", "hasPatients"]);
const emit = defineEmits(["close"]);

const api = useApi();
const deleteShiftConfirm = () => {
  api.deleteShift({ shiftId: props.shiftId });
  emit("close");
};
</script>
<template>
  <Dialog :open="open">
    <DialogContent @interact-outside="emit('close')">
      <DialogHeader>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogDescription> This will erase the shift from the board. </DialogDescription>
      </DialogHeader>

      <Alert variant="warn" v-if="props.hasPatients">
        <AlertDescription>
          <div>Cannot delete shift. Already has patients assigned.</div>
        </AlertDescription>
      </Alert>
      <DialogFooter>
        <Button @click="emit('close')" variant="outline">Cancel Delete</Button>
        <Button @click="deleteShiftConfirm" variant="destructive" :disabled="props.hasPatients">
          Confirm Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
