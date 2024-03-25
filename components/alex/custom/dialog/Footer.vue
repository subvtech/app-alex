<template>
  <div
    class="d-flex gap-4 justify-end flex-wrap bg-white min-height-76 rounded-b-lg px-6 py-4 border-top-gray-100 alex-dialog-footer"
    data-testid="alex-dialog-footer"
  >
    <slot
      v-if="!noSecondaryButton && hasSecondarySlotButton"
      name="secondarySlotButton"
      :on-second-action="() => emits('onSecondaryAction')"
    />
    <alex-custom-button
      v-else
      size="large"
      variant="secondary"
      prepend-icon="mdi-close"
      :text="secondaryButtonText"
      @click="() => emits('onSecondaryAction')"
    />
    <slot
      v-if="!noMainButton && hasMainSlotButton"
      name="mainSlotButton"
      :on-main-action="() => emits('onMainAction')"
    />
    <alex-custom-button
      v-else
      size="large"
      variant="primary"
      prepend-icon="mdi-plus"
      :text="mainButtonText"
      :loading="mainButtonLoading"
      :disabled="mainButtonDisabled"
      @click="() => emits('onMainAction')"
    />
  </div>
</template>

<script setup lang="ts">
interface HeaderProps {
  mainButtonText?: string;
  secondaryButtonText?: string;
  noMainButton?: boolean;
  noSecondaryButton?: boolean;
  mainButtonLoading?: boolean;
  mainButtonDisabled?: boolean;
  justify?:
    | 'start'
    | 'end'
    | 'center'
    | 'space-around'
    | 'space-between'
    | 'space-evenly'
    | 'stretch';
}
withDefaults(defineProps<HeaderProps>(), {
  mainButtonText: 'Salvar',
  secondaryButtonText: 'Cancelar',
  noMainButton: false,
  noSecondaryButton: false,
  mainButtonLoading: false,
  mainButtonDisabled: false,
  justify: 'end',
});
const emits = defineEmits(['onMainAction', 'onSecondaryAction']);
const slots = useSlots();
const hasMainSlotButton = computed(() => !!slots.mainSlotButton);
const hasSecondarySlotButton = computed(() => !!slots.secondarySlotButton);
</script>

<style scoped lang="scss">
.border-top-gray-100 {
  border-top: 1px solid rgb(var(--v-theme-gray-100)) !important;
}

@media screen and (max-width: 599px) {
  .alex-dialog-footer :deep(button) {
    width: 100% !important;
  }
}
</style>
