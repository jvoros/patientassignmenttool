<script setup>
import { ChevronDown } from "lucide-vue-next";
import { useSite, useApi } from "&";

const props = defineProps(["event"]);
const site = useSite();
const api = useApi();
const changeRoom = (newRoom) => {
  api.changeRoom({ eventId: props.event.id, newRoom });
};
</script>
<template>
  <DropdownMenu>
    <DropdownMenuTrigger class="group">
      <div class="text-xl font-bold">
        {{ event.patient.room }}
        <ChevronDown class="invisible inline group-hover:visible" size="14" />
      </div>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="end" v-if="event.patient.room" class="w-4">
      <DropdownMenuLabel>New room</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem class="p-0 focus:bg-white dark:focus:bg-background">
        <ScrollArea class="w-full h-44">
          <div v-for="room in site.store.details.rooms">
            <div
              class="px-6 py-1 text-sm hover:bg-secondary hover:cursor-pointer"
              @click="changeRoom(room)"
            >
              {{ room }}
            </div>
            <DropdownMenuSeparator />
          </div>
        </ScrollArea>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
