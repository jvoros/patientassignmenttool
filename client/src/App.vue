<script setup>

</script>

<template>
  <nav>
    <ul>
      <li><strong>Brand</strong></li>
    </ul>
    <ul>
      <li><router-link to="/">Home</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
      <li><a href="#" role="button">Button</a></li>
    </ul>
  </nav>

  <main>
    <router-view />
  </main>
</template>

<style scoped>
nav {
  margin-left: calc(var(--spacing)*-1);
  margin-right: calc(var(--spacing)*-1);
  padding: 0 var(--spacing);
}
</style>
