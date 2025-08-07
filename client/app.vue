<script setup>
import { onMounted } from "vue";
import { board, token, checkLogin } from "./components/store.js";

import Socket from "./components/Socket.vue";
import Header from "./components/Header.vue";
import Board from "./components/Board.vue";
import Login from "./components/Login.vue";

onMounted(() => {
    checkLogin();
});
</script>

<template>
    <Login v-if="!token" />
    <Socket v-else>
        <Header />
        <Board v-if="board" />
    </Socket>
</template>
