<script setup>
  import { ref, onUnmounted } from 'vue'
  import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
  import Button from './Button.vue';
  import Icon from './Icons.vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const props = defineProps({
    shift: Object
  });

  const emit = defineEmits(['assign']);

  const pt_type = ref('');
  const pt_room = ref('default');

  async function addDoctor(close) {
    close();
  }

 const assign_types = [
  { value: 'walk-in', display: 'Walk In', class: 'text-blue-600'},
  { value: 'ambo', display: 'Ambo', class: 'text-red-600'},
  { value: 'ft', display: 'Fast Track', class: 'text-green-600'},
  { value: 'bonus', display: 'Bonus', class: 'text-amber-600'}
];

  const rooms = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '13',
    '14',
    '15',
    '16',
    '17',
    '18',
    '19',
    '20',
    '21',
    '22',
    '23',
    '24',
    '25',
    '_',
    '27',
    '28',
    '29',
    '30',
    'T.A',
    'T.B',
    'T.C',
    'H.A',
    'H.B',
    'H.C',
    'H.D',
    'H.E',
    'H.F',
    'Unk'
  ];

  onUnmounted(() => {
    pt_type.value = '';
    pt_room.value = '';
  })

</script>

<template>
  <Popover class="relative">
    <PopoverButton class="focus:outline-none">
      <div class="rounded-lg px-4 py-2 bg-amber-300 text-yellow-50 text-sm">Assign</div>
    </PopoverButton>
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <PopoverPanel class="absolute w-128 z-10 -left-4 -top-1/2 p-4 text-base bg-gray-100 shadow-xl rounded-md border-2 border-gray-300 flex gap-x-4">
          <ul class="flex flex-col border border-gray-300 divide-y rounded-lg">
            <li v-for="x in assign_types" class="relative typeButton">
              <input class="absolute invisible" type="radio" name="pt_type" :id="x.value" v-model="pt_type" :value="x.value">
              <label :for="x.value" class="flex cursor-pointer hover:bg-gray-200 px-4 py-4" :class="[x.value === pt_type ? 'bg-amber-100' : '']">
                <Icon :icon="x.value" />
              </label>
              <span class="absolute z-15 left-14 bottom-2 invisible whitespace-nowrap text-white bg-gray-500 px-2 py-1 rounded text-center">{{ x.display }}</span>
            </li>
          </ul>
          <ul class="grid grid-cols-10 grid-rows-3 auto-rows-fr rounded-lg my-grid">
            <li v-for="room in rooms" class="flex items-stretch border border-gray-300 first:rounded-ss-lg last:rounded-ee-lg" :class="[room === pt_room ? 'bg-amber-100 hover:bg-amber-200' : 'bg-gray-100 hover:bg-gray-200' ]">
              <input class="absolute invisible" type="radio" name="room" :value="room" :id="'room'+room" v-model="pt_room" />
              <label class="flex items-center justify-center cursor-pointer text-xs grow px-1" :for="'room'+room">
                <span>{{ room }}</span>
              </label>
            </li>
          </ul>

          
          <div class="flex flex-col gap-4 items-center">
            <Button variety="contrast" @click="addDoctor(close)" :disabled="!pt_type || !pt_room">Assign</Button>
            <Button>Cancel</Button>
          </div>

      </PopoverPanel>
    </transition>
  </Popover>
</template>
<style>
.typeButton:hover > span {
  visibility: visible;
}

.my-grid li:nth-child(10) {
  border-start-end-radius: 0.5rem;
}

.my-grid li:nth-child(31) {
  border-end-start-radius: 0.5rem;
}
</style>