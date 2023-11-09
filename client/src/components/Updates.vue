<script setup>
import Message from "./Message.vue";
</script>
<template>
  <div class="mx-10">
    <Message severity="error" v-if="errorModal" @close="toggleError">
      {{ store.error.text }}
    </Message>
    <Message v-if="updatesMessage" closable @close="toggleUpdates">
      <h1>{{ socketConnect }}</h1>
      <h3 class="font-bold">Updates</h3>
      <hr />
      <ul class="m-4 list-disc list-outside flex flex-col gap-y-4">
        <li>
          Patients <strong>must</strong> have a patient type:
          <Icon icon="walk-in" /> walk-in, <Icon icon="ambo" /> ambo,
          <Icon icon="ft" /> fast track, or <Icon icon="bonus" /> bonus.
        </li>
        <li>
          Patients can be picked up by a physician, other than the one assigned
          to them, using the
          <Button left-icon="pickup" inline icon-color="muted"></Button>
          button on the Timeline.
          <ul class="list-disc flex flex-col gap-y-2 ml-4">
            <li>
              This means a doctor can pick up a patient assigned to another
              physician without changing the rotation.
            </li>
            <li>
              For example, if Dr. Mooth is in a code and has a patient assigned
              to him, Dr. Wiesley can volunteer to pickup that patient on behalf
              of Dr. Mooth.
            </li>
            <li>
              This <i>doesn't change the rotation</i>. The rotation should
              continue as if Dr. Mooth took that patient.
            </li>
          </ul>
        </li>
        <li>
          Patients can be added to any provider using the
          <Button inline leftIcon="walk-in"></Button> button.
          <ul class="list-disc flex flex-col gap-y-2 ml-4">
            <li>Doctors can pick up patients without changing the rotation.</li>
            <li>
              For example, a doctor may know about a simple transfer from TEC
              and ask to have that patient assigned to them, without changing
              the rotation.
            </li>
            <li class="">
              Patients added out of rotation should usually use the
              <strong>bonus</strong> <Icon icon="bonus" /> patient type.
            </li>
          </ul>
        </li>

        <li>
          The <strong>Undo</strong> button has been moved to the
          <strong>Timeline</strong> section, underneath the last timeline event.
        </li>
      </ul>
    </Message>
  </div>
</template>
