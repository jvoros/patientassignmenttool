<script setup>
const props = defineProps({
    role: String
  });

  const emit = defineEmits(['addDoctor', 'logout']);
</script>

<template>
  <nav>
    <h1>Patient Assignment Tool</h1>
    <div class="nav-elements">
      <button v-if="role === 'nurse'" @click="emit('addDoctor')">
          <i class="fa-solid fa-user-doctor"></i>
          <span>Add Doctor</span>
      </button>
      <button class="contrast" @click="emit('logout')">
        <span>Logout</span>
        <i class="fa-solid fa-arrow-right-from-bracket"></i>
      </button>
    </div>
  </nav>
</template>

<style scoped>
  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space);
    background-color: var(--color-near-white);
    box-shadow: var(--shadow-sm);
  }

  .nav-elements {
    display: flex;
    gap: var(--space);
  }

  h1 {
    font-weight: 700;
    font-size: 1.2rem;
  }

</style>
