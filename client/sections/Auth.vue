<script setup>
import { onBeforeMount } from "vue";
import { useAuth } from "../use";

const auth = useAuth();

onBeforeMount(() => {
  auth.checkLogin();
});
</script>
<template>
  <slot name="noauth" v-if="auth.details.id === null"></slot>
  <slot name="auth" v-else></slot>
</template>
