<template>
  <v-switch
    class="alex-switch"
    :color="props.color"
    :label="props.label"
    inset
  ></v-switch>
</template>

<script setup lang="ts">
interface SwitchProps {
  color?: string;
  label?: string;
}

const props = withDefaults(defineProps<SwitchProps>(), {
  color: 'secondary-0',
  label: undefined,
});
</script>

<style>
.alex-switch.v-switch.v-switch--inset .v-selection-control__wrapper {
  /** Para de comprimir o input */
  width: auto !important;
}

.alex-switch .v-input__details {
  /** Remove espaços desnecessários */
  display: none !important;
}

.alex-switch .v-switch__thumb {
  /** Para de mudar a aparência do toggle ao selecionar */
  transform: none !important;
}

.alex-switch .v-selection-control__wrapper {
  /** Alinha o componente ao resto do drawer */
  margin-left: 0 !important;
}
</style>
