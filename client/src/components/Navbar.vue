<script setup>
import Button from './Button.vue'
import NavbarAddDoctorPopover from './NavbarAddDoctorPopover.vue';
const props = defineProps({
    role: String
  });
  const emit = defineEmits(['addDoctor', 'logout']);
</script>

<template>
  <nav class="flex flex-row justify-between items-center p-4 bg-gray-50">
    <h1 class="text-xl font-extrabold">Patient Assignment Tool</h1>
    <div class="flex gap-x-4">
      <NavbarAddDoctorPopover v-if="role === 'nurse'" />
      <!-- <Button v-if="role === 'nurse'" @click="emit('addDoctor')">
        <i class="fa-solid fa-user-doctor"></i>
        Add Doctor
      </Button> -->
      <Button variety="contrast" @click="emit('logout')">
        Logout
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </Button>
    </div>
  </nav>
</template>
<style scoped>
nav {

}
</style>
