<template>
  <Container class="mt-4">
    <div class="sm:grid sm:grid-cols-2 sm:gap-4 md:grid-cols-10">
      <div class="p-4 sm:row-span-2 md:col-span-3">
        <slot name="timeline"></slot>
      </div>

      <div class="p-4 md:col-span-4">
        <slot name="main"></slot>
      </div>

      <div class="p-4 sm:col-start-2 md:col-span-3">
        <slot name="secondary"></slot>
      </div>
    </div>
  </Container>
</template>
