<template>
  <div class="d-flex gap-2 px-4 py-2 rounded-lg bg-white w-fit">
    <alex-custom-button
      icon="mdi-magnify-plus-outline"
      variant="text"
      @click="onPlus"
    />
    <alex-custom-button
      icon="mdi-magnify-minus-outline"
      variant="text"
      @click="onMinus"
    />
    <alex-custom-button icon="mdi-replay" variant="text" @click="onReset" />
    <alex-custom-dropdown :items="items">
      <template #activator="{ props: activeProps }">
        <alex-custom-button
          v-bind="activeProps"
          icon="mdi-dots-vertical"
          variant="text"
        />
      </template>
    </alex-custom-dropdown>
  </div>
</template>

<script setup lang="ts">
type ControlsProps = {
  onPlus: () => void;
  onMinus: () => void;
  onReset: () => void;
  onRotate: () => void;
  onFlipH: () => void;
  onFlipV: () => void;
};
const props = defineProps<ControlsProps>();
const items = [
  { text: 'Inverter - H', icon: 'mdi-flip-horizontal', onClick: props.onFlipH },
  { text: 'Inverter - V', icon: 'mdi-flip-vertical', onClick: props.onFlipV },
  { text: 'Rotacionar', icon: 'mdi-cached', onClick: props.onRotate },
];
</script>

<style scoped>
.w-fit {
  width: fit-content;
}
</style>
