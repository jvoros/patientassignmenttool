<script setup>
import { ref } from "vue";
import { useAppStore } from "../stores/appStore";
import Button from "./Button.vue";

const store = useAppStore();
const role = ref("nurse");
const password = ref("");

function login() {
  store.login({ role: role.value, password: password.value });
}
</script>

<template>
  <section class="w-1/3 border-2 border-gray-200 rounded-lg p-16 mt-20 mx-auto">
    <h1 class="text-2xl font-bold mb-16 text-center">
      Patient Assignment Tool
    </h1>

    <form @submit.prevent="login" class="flex flex-col gap-y-6">
      <select v-model="role" class="px-4 py-2 text-lg rounded">
        <option value="nurse">Nurse</option>
        <option value="doctor">Doctor</option>
      </select>

      <input
        class="px-4 py-2 text-lg rounded"
        type="password"
        v-model="password"
        placeholder="Password"
      />

      <div
        v-if="store.loginError"
        class="bg-red-50 border border-red-600 text-red-700 px-4 py-2 rounded"
      >
        {{ store.loginError.text }}
      </div>

      <Button variety="contrast" type="submit" class="text-center"
        >Login</Button
      >
    </form>
  </section>
</template>
