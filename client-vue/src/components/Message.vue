<script setup>
import { onMounted, Transition } from "vue";
import Icon from "./Icons.vue";

const props = defineProps({
  severity: {
    type: String,
    default: "default",
  },
  closable: {
    type: Boolean,
    default: false,
  },
  sticky: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["close"]);

function getStyles() {
  const s = {
    default: "bg-gray-100 border border-gray-200",
    warn: "bg-yellow-50 border border-solid border-amber-300 text-amber-500",
    error: "bg-red-50 border border-solid border-red-400 text-red-400",
  };
  return s[props.severity];
}

function close() {
  emit("close");
}

function closeAfterDelay() {
  setTimeout(() => {
    emit("close");
  }, 3000);
}

onMounted(() => {
  if (!props.sticky) closeAfterDelay();
});
</script>

<template>
  <Transition>
    <div class="py-2 px-4 rounded flex flex-row gap-x-4" :class="getStyles()">
      <div class="grow"><slot /></div>
      <div v-if="closable" class="cursor-pointer" @click="close">
        <Icon icon="close" />
      </div>
    </div>
  </Transition>
</template>
