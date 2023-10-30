<script setup>
import Button from './Button.vue'
import AddDoctorPopover from './AddDoctorPopover.vue';
import Icon from './Icons.vue';

const props = defineProps({
    role: String
  });
  const emit = defineEmits(['logout']);
</script>

<template>
  <nav class="flex flex-row justify-between items-center p-4 bg-gray-50">
    <h1 class="text-xl font-extrabold">Patient Assignment Tool</h1>
    <div class="flex gap-x-4">
      <AddDoctorPopover v-if="role === 'nurse'" />
      <Button variety="contrast" @click="emit('logout')">
        Logout
        <Icon icon="logout" color="white" />
      </Button>
    </div>
  </nav>
</template>

