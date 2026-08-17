<script setup>
const { logout } = useAuth();
const hideSmall = "hidden md:flex";
</script>
<template>
    <UButton
        color="neutral"
        size="md"
        variant="link"
        label="Shift Trends"
        icon="lucide:chart-no-axes-combined"
        to="logs"
        :class="hideSmall"
    />
    <UButton
        color="neutral"
        size="md"
        variant="link"
        label="Quick Reference"
        icon="fa7-solid:bookmark"
        class="text-purple-500"
        to="https://patientassignmenttools-quickref.netlify.app/"
        target="_blank"
        :class="hideSmall"
    />

    <HeaderAddPop />

    <UTooltip text="Logout">
        <UButton
            color="neutral"
            variant="outline"
            size="lg"
            trailing-icon="fa7-solid:sign-out-alt"
            :class="hideSmall"
            @click="logout"
        />
    </UTooltip>

    <UTooltip text="Dark mode">
        <UColorModeButton variant="outline" :class="hideSmall" />
    </UTooltip>
</template>
