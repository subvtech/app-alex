<template>
  <v-container
    class="bg-white min-height-76 rounded-b-lg px-6 py-4 border-top-gray-100"
    data-testid="alex-modal-footer"
  >
    <v-row dense justify="end">
      <v-col v-if="!noSecondaryButton" dense cols="auto">
        <slot
          v-if="hasSecondSlot"
          name="secondButton"
          :on-second-action="() => emits('onSecondaryAction')"
        />
        <alex-custom-button
          v-else
          size="large"
          variant="secondary"
          :text="secondaryButtonText"
          @click="() => emits('onSecondaryAction')"
        />
      </v-col>
      <v-col v-if="!noMainButton" dense cols="auto">
        <slot
          v-if="hasMainSlot"
          name="mainButton"
          :on-main-action="() => emits('onMainAction')"
        />
        <alex-custom-button
          v-else
          size="large"
          variant="primary"
          :text="mainButtonText"
          @click="() => emits('onMainAction')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface HeaderProps {
  mainButtonText?: string;
  secondaryButtonText?: string;
  noMainButton?: boolean;
  noSecondaryButton?: boolean;
}
withDefaults(defineProps<HeaderProps>(), {
  mainButtonText: 'Salvar',
  secondaryButtonText: 'Cancelar',
  noMainButton: false,
  noSecondaryButton: false,
});
const emits = defineEmits(['onMainAction', 'onSecondaryAction']);
const slots = useSlots();
const hasMainSlot = computed(() => !!slots.mainButton);
const hasSecondSlot = computed(() => !!slots.secondButton);
</script>

<style scoped>
.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}
.min-height-76 {
  min-height: fit-content;
  height: 76px;
}
</style>
