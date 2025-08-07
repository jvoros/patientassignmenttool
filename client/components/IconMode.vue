<script setup>
import { Ambulance, UserPlus, Zap, Shield } from "lucide-vue-next";
const { mode, size } = defineProps(["mode", "size"]);
const iconSize = size ?? 18;
</script>
<template>
    <wa-icon name="circle-info" v-if="mode === 'info'"></wa-icon>
    <Ambulance :size="iconSize + 4" v-if="mode === 'ambo'" />
    <UserPlus :size="iconSize" v-if="mode === 'walkin'" />
    <Shield :size="iconSize" v-if="mode === 'police'" />
    <Zap :size="iconSize" v-if="mode === 'ft'" />
</template>
