<script setup>
import { ref } from "vue";
import { login } from "./store.js";

const code = ref(null);
const loginEvent = async (event) => {
    event.preventDefault();
    const payload = { site: "smh", code: code.value };
    login(payload);
};
</script>

<template>
    <main>
        <img src="/public/pat.svg" alt="Patient Assignment Tool Logo" />
        <h1>Welcome to the Rotation.</h1>
        <div v-if="error">{{ error }}</div>
        <form>
            <label>Access Code<input type="text" v-model="code" /></label>
            <button class="btn" type="submit" @click="loginEvent">Login</button>
        </form>
    </main>
</template>

<style scoped>
main {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 25rem;
    margin: 5rem auto;
    background-color: var(--bg-highlight);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 2rem 1.8rem;
}

img {
    width: 6rem;
}

h1 {
    font-weight: 700;
    font-size: 2.25rem;
    line-height: 2.5rem;
    letter-spacing: -0.1rem;
    padding: 0.5rem 0;
}

div {
    border: 1px solid var(--color-alert);
    border-radius: var(--radius);
    padding: var(--padding-half);
    color: var(--color-alert);
}

label {
    font-size: 0.8rem;
    font-weight: 600;
    display: block;
}

input {
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: var(--padding-half);
    background-color: var(--bg-highlight);
    width: 100%;
    margin-top: 0.5rem;
}

form button {
    margin-top: 1rem;
    width: 100%;
}
</style>
