<script setup>
  import { ref } from 'vue'
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import Button from './Button.vue';
  import Message from './Message.vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const emit = defineEmits(['addDoctor']);

  const doctor = ref('default');
  const shift = ref('default');

  async function addDoctor(close) {
    close();
  }

</script>

<template>
  <Popover class="relative" v-slot="{ open }">
    <PopoverButton class="focus:outline-none">
      <Button class="w-36">
        <i class="fa-solid fa-user-doctor"></i>
        Add Doctor
     </Button>

    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel v-slot="{ close }" class="absolute z-10 mt-3 w-80 right-0 p-4 bg-gray-100 shadow-xl rounded-md border-2 border-gray-300">
        <div class="overflow-hidden flex flex-col gap-y-4">
          <select class="py-2 px-4 rounded border border-gray-200" v-model="shift">
            <option value="default" disabled>Select Shift</option>
            <option v-for="shift in store.shift_details" :value="shift">{{ shift.name }}</option>
          </select>
          <Message severity="warn" :closable="false" :icon="false" v-if="shift.id === 1">Adding a doctor to the 6 am shift will reset the board.</Message>
          <select class="py-2 px-4 w-full rounded border border-gray-200" v-model="doctor">
            <option value="default" disabled>Select Doctor</option>
            <option v-for="doctor in store.doctors" :value="doctor">{{ doctor.last }}, {{ doctor.first }}</option>
          </select>
          <div class="flex items-center gap-4 self-end">
            <a href="#" @click="close" class="hover:text-gray-600">Cancel</a>
            <Button variety="contrast" @click="addDoctor(close)">Add to Rotation</Button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>