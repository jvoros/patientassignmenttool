<script setup>
  import { ref, onMounted } from 'vue';
  import Message from './Message.vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const emit = defineEmits(['close']);

  const doctor = ref('default');
  const shift = ref('default');
  const doctors = ref();
  const shifts = ref();

  function close() {
    emit('close');
  }

  onMounted(async () => {
    doctors.value = await store.getDoctors();
    shifts.value = await store.getShifts();

  });
</script>

<template>
  <Message @close="close">
    <section>
      <form>
        <h3>Add Doctor:</h3>
        <select v-model="doctor">
          <option value="default" disabled>Select Doctor</option>
          <option v-for="doctor in doctors" :value="doctor">{{ doctor.last }}, {{ doctor.first }}</option>
        </select>
        <select v-model="shift">
          <option value="default" disabled>Select Shift</option>
          <option v-for="shift in shifts" :value="shift">{{ shift.name }}</option>
        </select>
        <button class="contrast">Add</button><br>
      </form>
      <div class="add-doctor-warning">
        <div v-if="shift.id === 1" class="warn">Adding a doctor to the 6 am shift will reset the board.</div>
      </div>
    </section>
    
  </Message>
</template>
<style scoped>
h3 {
  font-weight: 700;
  font-size: var(--f5);
}
form {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space);
}

.add-doctor-warning {
  width: 450px;
  margin: var(--space) auto;
}
</style>
