<script setup>
  import { ref } from 'vue'
  import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue'
  import Button from './Button.vue';
  import Message from './Message.vue';
  import Icon from './Icons.vue';
  import PopoverTransition from './PopoverTransition.vue'
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
  <Popover class="relative">
    <PopoverButton class="focus:outline-none">
      <Button class="w-36">
        <Icon icon="doctor" />
        Add Doctor
     </Button>
    </PopoverButton>

    <PopoverTransition>
      <PopoverOverlay class="z-10 fixed inset-0 bg-black/30" />
    </PopoverTransition>

    <PopoverTransition>
      <PopoverPanel v-slot="{ close }" class="absolute z-10 mt-3 w-80 right-0 p-4 bg-gray-100 shadow-xl rounded-md border-2 border-gray-300">
        <div class="flex flex-col gap-y-4">
          <select class="py-2 px-4 rounded border border-gray-200" v-model="shift">
            <option value="default" disabled>Select Shift:</option>
            <option v-for="shift in store.shift_details" :value="shift">{{ shift.name }}</option>
          </select>
          <Message severity="warn" :closable="false" :icon="false" v-if="shift.id === 1">Adding a doctor to the 6 am shift will reset the board.</Message>
          <select class="py-2 px-4 w-full rounded border border-gray-200" v-model="doctor">
            <option value="default" disabled>Select Doctor:</option>
            <option v-for="doctor in store.doctors" :value="doctor">{{ doctor.last }}, {{ doctor.first }}</option>
          </select>
          <div class="flex items-center gap-4 self-end">
            <Button variety="ghost" @click="close">Cancel</Button>
            <Button variety="contrast" @click="addDoctor(close)">Add to Rotation</Button>
          </div>
        </div>
      </PopoverPanel>
    </PopoverTransition>
  </Popover>
</template>