<script setup>
import { onMounted, onUnmounted } from "vue";
import io from "socket.io-client";
import { token, socketConnected, updateBoard } from "./store.js";

const socket = io({ auth: { token: token.value } });

socket.on("connect", () => {
    socketConnected.value = true;
    console.log("[socket] connected");
});

socket.on("disconnect", () => {
    socketConnected.value = false;
    console.log("[socket] disconnected");
});

socket.on("message", (msg) => {
    console.log("[socket] (message)", msg);
});

socket.on("board", (value) => {
    console.log(`[socket] (board) new board:`, value);
    updateBoard(value);
});

onMounted(() => {
    socket.connect();
});

onUnmounted(() => {
    socket.disconnect();
});
</script>

<template>
    <slot></slot>
</template>
