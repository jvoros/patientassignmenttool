<script setup>
import { useSite, useErrorBoundary } from "/use";

const site = useSite();
site.fetchBoard();
site.fetchDetails();
site.useStream();
useErrorBoundary();
</script>

<template>
  <Nav />
  <BoardLayout>
    <template #timeline>
      <Timeline :timeline="site.store.board.timeline" />
    </template>
    <template #main>
      <ZoneList :zones="site.store.board.zoneList1" />
    </template>
    <template #secondary>
      <ZoneList :zones="site.store.board.zoneList2" />
    </template>
  </BoardLayout>
</template>
