<script setup>

</script>

<template>
  <nav>
    <ul>
      <li><strong>Brand</strong></li>
    </ul>
    <ul>
      <li><a href="#">Link</a></li>
      <li><a href="#">Link</a></li>
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
