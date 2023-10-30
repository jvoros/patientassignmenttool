<script setup>
  import { ref, onUnmounted } from 'vue'
  import { Popover, PopoverButton, PopoverPanel, PopoverOverlay } from '@headlessui/vue'
  import PopoverTransition from './PopoverTransition.vue'
  import Button from './Button.vue';
  import Icon from './Icons.vue';
  import { useBoardStore } from '../stores/board';

  const store = useBoardStore();

  const props = defineProps({
    variety: {
      type: String,
      default: 'default'
    },
    shift: Object,
    type: {
      type: String,
      default: ''
    }
  });

  const emit = defineEmits(['assign']);

  const pt_type = ref(props.type);
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
    'Other'
  ];

  onUnmounted(() => {
    pt_type.value = '';
    pt_room.value = '';
  })

</script>

<template>
  <Popover class="relative" v-slot="{ close }">
    <PopoverButton class="focus:outline-none">

        <Button v-if="variety==='default'" class="w-30">
          <Icon icon="walk-in" />
        </Button>

        <Button v-if="variety==='next'" class="w-30" variety="contrast">
          <Icon icon="walk-in" color="white" /> Assign
        </Button>


    </PopoverButton>

    <PopoverTransition>
      <PopoverOverlay class="z-10 fixed inset-0 bg-black/30" />
    </PopoverTransition>
    
    <PopoverTransition>
      <PopoverPanel class="absolute z-10 top-12 right-0 p-4 text-base bg-gray-100 shadow-xl rounded-md border-2 border-gray-300">
  
        <div class="flex flex-col gap-y-4 text-lg">
          <ul class="flex border border-gray-300 divide-x rounded-lg">
            <li v-for="x in assign_types" class="relative grow typeButton">
              <input class="absolute invisible" type="radio" name="pt_type" :id="x.value" v-model="pt_type" :value="x.value">
              <label :for="x.value" class="cursor-pointer px-6 py-3 flex hover:bg-gray-200" :class="[x.value === pt_type ? 'bg-gray-200' : '']">
                <Icon :icon="x.value" />
              </label>
              <span class="absolute mt-2 invisible whitespace-nowrap text-white bg-gray-500 px-2 py-1 rounded text-center">{{ x.display }}</span>
            </li>
          </ul>

          <div class="flex items-center gap-x-8">
            <strong>Room:</strong>
            <select class="py-2 px-4 w-full rounded border border-gray-200" v-model="pt_room">
            <option v-for="room in rooms" :value="room">{{ room }}</option>
          </select>
          </div>
          
          <div class="flex items-center gap-4 self-end">
            <Button variety="ghost" @click="close" class="hover:text-gray-600">Cancel</Button>
            <Button variety="contrast" @click="addDoctor(close)" :disabled="!pt_type || !pt_room">Assign</Button>
          </div>
        </div>
      </PopoverPanel>
    </PopoverTransition>
  </Popover>
</template>
<style>
.typeButton:hover > span {
  visibility: visible;
}
</style>