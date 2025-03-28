<script setup>
const props = defineProps(["variant"]);

const styles = {
  base: "gap-4 text-sm border border border-outline rounded-md text-muted-foreground",
  default: "px-4 py-2 mb-4",
  blank: "p-8 mb-8 bg-muted text-center",
};

const classes = () =>
  [styles["base"], props.variant ? styles[props.variant] : styles["default"]].join(" ");
</script>
<template>
  <div :class="classes()">
    <slot />
  </div>
</template>
