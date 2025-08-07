<script setup>
import IconMoon from "./IconMoon.vue";
import IconSun from "./IconSun.vue";

const toggleTheme = () => {
    const classes = document.documentElement.classList;
    const isDark = classes.contains("wa-dark");
    if (isDark) {
        classes.remove("wa-dark");
    } else {
        classes.add("wa-dark");
    }
};
</script>
<template>
    <wa-button size="small" appearance="filled" @click="toggleTheme">
        <span>
            <IconMoon class="moon" />
            <IconSun class="sun" />
        </span>
    </wa-button>
</template>

<style scoped>
span {
    width: 1.1rem;
    height: 1.1rem;
}

.sun,
.wa-dark .moon {
    display: none;
}

.wa-dark .sun,
.moon {
    display: inline-flex;
}
</style>
