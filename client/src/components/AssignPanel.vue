<script setup>
import { ref } from 'vue'
import { useBoardStore } from '../stores/board';
import BoardPanel from './BoardPanel.vue';

const assign_types = [
  { value: 'walk-in', display: 'Walk In', class: 'text-blue-600'},
  { value: 'ambo', display: 'Ambo', class: 'text-red-600'},
  { value: 'ft', display: 'Fast Track', class: 'text-green-600'}
];
const assign_type = ref('');
const assign_room =ref('');

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
    '',
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
</script>
<template>
  <BoardPanel header="Assign Patient" class="m-4 bg-white rounded-lg px-4 py-2">
    <div class="grid grid-cols-12 gap-8 pt-4 px-4">
      <!-- patient type -->
      <div class="col-span-2">
        <h3>1. Patient Type:</h3>
        <ul class="bg-gray-50 border border-gray-200 rounded-lg my-4">
          <li v-for="x in assign_types" class="border-b hover:bg-gray-100 transition-colors duration-150 border-gray-200 first-of-type:rounded-t-lg last-of-type:rounded-b-lg ">
            <label class="block p-4 w-full h-full text-xl hover:cursor-pointer flex items-center" >
              <input class="mr-4 w-6 h-6" type="radio" name="patient_type" :value="x.value" v-model="assign_type" @change="getAssignDoc" />
              <strong :class="x.class">{{ x.display }}</strong>
            </label>
          </li>
        </ul>
      </div>

      <!-- patient room -->
      <div class="col-span-6 pb-6">
        <h3>Room: {{ assign_room }}</h3>
        <ul class="my-grid my-4 grid grid-cols-10 grid-rows-3 rounded-lg ">
          <li v-for="room in rooms" class="flex border border-gray-200 first:rounded-ss-lg last:rounded-ee-lg" :class="[room === assign_room ? 'bg-amber-100 hover:bg-amber-200' : 'bg-gray-50 hover:bg-gray-100' ]">
            <input class="absolute invisible" type="radio" name="room" :value="room" :id="'room'+room" v-model="assign_room" />
            <label class="grow text-center py-4 cursor-pointer text-lg" :for="'room'+room">{{ room }}</label>
          </li>
        </ul>
      </div>

      <!-- patient doc -->
      <div class="col-span-4">Doc</div>
    </div>
  </BoardPanel>

</template>
<style scoped>
.my-grid li:nth-child(10) {
  border-start-end-radius: 0.5rem;
}

.my-grid li:nth-child(31) {
  border-end-start-radius: 0.5rem;
}
</style>
