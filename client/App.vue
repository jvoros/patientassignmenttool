<script setup>
import Toaster from "./shadcn-vue/components/sonner";
</script>

<template>
  <Auth>
    <template #auth>
      <Toaster position="top-center" richColors />
      <BoardView />
    </template>
    <template #noauth>
      <Login />
    </template>
  </Auth>
</template>
