<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const isDev = computed(() => import.meta.dev);
const isProdDb = computed(() => runtimeConfig.public.isProdDb);
</script>
<template>
    <div
        v-if="isDev"
        class="flex justify-center py-2"
        style="background-color: hsl(248, 87%, 92%)"
    >
        <span class="text-violet-500 font-bold">DEVELOPMENT SERVER</span>
        <span v-if="isProdDb" class="ml-6 text-red-500 flex items-center">
            <UIcon name="fa7-solid:warning" />
            <span>
                <b>CAUTION:</b>
                Production DB
            </span>
        </span>
    </div>

    <UHeader
        title="Patient Assignment Tool"
        class="border-0 mb-2 md:mb-10"
        :toggle="{ class: 'hidden' }"
    >
        <template #title>
            <HeaderLogo />
        </template>

        <template #right>
            <HeaderButtons />
        </template>
    </UHeader>
</template>
