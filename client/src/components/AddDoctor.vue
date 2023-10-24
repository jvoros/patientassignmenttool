<script setup>
  import { ref } from 'vue';
  import Message from './Message.vue';
  import Button from './Button.vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const emit = defineEmits(['close']);

  const doctor = ref('default');
  const shift = ref('default');

  function close() {
    emit('close');
  }

</script>

<template>
  <Message @close="close">
    <form class="flex flex-row items-center gap-x-4 py-2 px-4">
      <h3 class="font-bold">Add Doctor:</h3>
      <select class="py-2 px-4 rounded w-100" v-model="doctor">
        <option value="default" disabled>Select Doctor</option>
        <option v-for="doctor in store.doctors" :value="doctor">{{ doctor.last }}, {{ doctor.first }}</option>
      </select>
      <select class="py-2 px-4 rounded" v-model="shift">
        <option value="default" disabled>Select Shift</option>
        <option v-for="shift in store.shift_details" :value="shift">{{ shift.name }}</option>
      </select>
      <Button variety="contrast">Add</Button>
    </form>
    <Message severity="warn" v-if="shift.id === 1">Adding a doctor to the 6 am shift will reset the board.</Message>
  </Message>
</template>

