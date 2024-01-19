<script setup>
import { ref } from "vue";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  PopoverOverlay,
} from "@headlessui/vue";
import PopoverTransition from "./PopoverTransition.vue";
import Button from "./Button.vue";

const props = defineProps({
  rotations: {
    type: Object,
    default: {},
  },
  rotationId: { type: String, default: "" },
  shiftId: { type: String, default: "" },
});
const emit = defineEmits(["moveShiftToRotation"]);

async function confirm(close) {
  emit("moveShiftToRotation", newRotation.value, props.shiftId);
  close();
}

const newRotation = ref(null);
</script>

<template>
  <Popover class="relative" v-slot="{ close }">
    <PopoverButton class="focus:outline-none b-1 px-2">
      <Button>Move</Button>
    </PopoverButton>

    <PopoverTransition>
      <PopoverOverlay class="z-10 fixed inset-0 bg-black/30" />
    </PopoverTransition>

    <PopoverTransition>
      <PopoverPanel
        class="absolute z-10 right-0 top-12 w-52 p-4 bg-gray-100 shadow-xl rounded-md border-2 border-gray-300"
      >
        <div class="flex flex-col gap-y-4 text-md text-base">
          <h3 class="font-bold mb-0">Move to:</h3>
          <template v-for="r in rotations">
            <label v-if="r.id != rotationId">
              <input type="radio" v-model="newRotation" :value="r.id" />
              {{ r.name }}
            </label>
          </template>

          <div class="flex items-center gap-4 self-end">
            <Button variety="ghost" @click="close" class="hover:text-gray-600"
              >Cancel</Button
            >
            <Button variety="contrast" @click="confirm(close)">Move</Button>
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
