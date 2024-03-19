<template>
  <v-container
    class="bg-white min-height-76 rounded-b-lg px-6 py-4 border-top-gray-100"
    data-testid="alex-dialog-footer"
  >
    <v-row dense :justify="justify">
      <v-col v-if="!noSecondaryButton" dense cols="auto">
        <slot
          v-if="hasSecondarySlotButton"
          name="secondarySlotButton"
          :on-second-action="() => emits('onSecondaryAction')"
        />
        <alex-custom-button
          v-else
          size="large"
          variant="secondary"
          :prepend-icon="secondaryButtonIcon"
          :text="secondaryButtonText"
          @click="() => emits('onSecondaryAction')"
        />
      </v-col>
      <v-col v-if="!noMainButton" dense cols="auto">
        <slot
          v-if="hasMainSlotButton"
          name="mainSlotButton"
          :on-main-action="() => emits('onMainAction')"
        />
        <alex-custom-button
          v-else
          size="large"
          variant="primary"
          :text="mainButtonText"
          :prepend-icon="mainButtonIcon"
          :loading="mainButtonLoading"
          :disabled="mainButtonDisabled"
          @click="() => emits('onMainAction')"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface HeaderProps {
  mainButtonText?: string;
  mainButtonIcon?: string;
  secondaryButtonText?: string;
  secondaryButtonIcon?: string;
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
  mainButtonIcon: undefined,
  secondaryButtonIcon: undefined,
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
.min-height-76 {
  min-height: fit-content;
  height: 76px;
}

@media (max-width: 420px) {
  .min-height-76 {
    height: unset;
  }
}
</style>
