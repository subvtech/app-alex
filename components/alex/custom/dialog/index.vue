<template>
  <v-dialog
    max-width="720"
    transition="dialog-center-transition"
    data-testid="alex-dialog"
    class="custom-alex-dialog"
    :model-value="modelValue"
    :activator="activator"
    @update:model-value="handleChange"
  >
    <template
      v-if="hasCustomActivator"
      #activator="{ isActive, props: activatorProps }"
    >
      <slot name="activator" :is-active="isActive" :props="activatorProps" />
    </template>
    <slot
      v-if="hasHeader"
      name="header"
      :title="title"
      :highlighted-title="highlightedTitle"
      :emit-close="() => emits('update:modelValue', false)"
    />
    <alex-custom-dialog-header
      v-else
      data-testid="alex-dialog-header"
      :title="title"
      :highlighted-title="highlightedTitle"
      @on-close="() => emits('update:modelValue', false)"
    />
    <v-container
      class="pa-1 gap-1 body-height alex-scrollbar-white"
      :class="{ 'body-height-stepper': stepper }"
    >
      <v-row dense>
        <v-col v-if="stepper" dense :class="bodyStyles" class="rounded-b-lg">
          <alex-inputs-stepper
            :steps-config="stepsConfig"
            step-class="max-height-stepper pa-6 gap-4"
            stepper-indicator-class="px-6 pt-6 pb-1"
            @on-success="emits('onMainAction')"
          >
            <template v-for="slot in slotsList" #[slot]>
              <slot :name="slot" />
            </template>
            <template
              #controls="{
                isFirstStep,
                isLastStep,
                isValid,
                onPrevStep,
                submitLoading,
              }"
            >
              <slot
                v-if="hasFooter"
                name="footer"
                :emit-main-action="() => emits('onMainAction')"
                :emit-secondary-action="() => emits('onSecondaryAction')"
                :is-valid="isValid"
                :submit-loading="submitLoading"
              />
              <alex-custom-dialog-footer
                v-else-if="!hasFooter && !noFooter"
                :no-secondary-button="isFirstStep"
              >
                <template #mainSlotButton>
                  <alex-custom-button
                    type="submit"
                    size="large"
                    :text="
                      isLastStep
                        ? $t('components.dialog.create')
                        : $t('components.dialog.next')
                    "
                    :append-icon="!isLastStep ? 'mdi-chevron-right' : undefined"
                    :prepend-icon="isLastStep ? 'mdi-plus' : undefined"
                    :loading="submitLoading"
                  />
                </template>
                <template #secondarySlotButton>
                  <alex-custom-button
                    :text="$t('components.dialog.back')"
                    variant="secondary"
                    size="large"
                    prepend-icon="mdi-chevron-left"
                    @click="onPrevStep"
                  />
                </template>
              </alex-custom-dialog-footer>
            </template>
          </alex-inputs-stepper>
        </v-col>
        <v-col v-else dense :class="bodyStyles">
          <slot />
        </v-col>
      </v-row>
    </v-container>
    <slot
      v-if="hasFooter && !stepper"
      name="footer"
      :emit-main-action="() => emits('onMainAction')"
      :emit-secondary-action="() => emits('onSecondaryAction')"
    />
    <alex-custom-dialog-footer
      v-else-if="!hasFooter && !noFooter && !stepper"
      data-testid="alex-dialog-footer"
      :main-button-text="mainButtonText"
      :secondary-button-text="secondaryButtonText"
      @on-main-action="() => emits('onMainAction')"
      @on-secondary-action="() => emits('onSecondaryAction')"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import { StepsConfig } from '@/components/alex/inputs/stepper/index.vue';

interface HeaderProps {
  modelValue: boolean;
  activator?: 'parent';
  title?: string;
  bodyClasses?: string;
  highlightedTitle?: string;
  mainButtonText?: string;
  secondaryButtonText?: string;
  noFooter?: boolean;
  stepper?: boolean;
  stepsConfig?: Record<string, Partial<StepsConfig>>;
}
const props = withDefaults(defineProps<HeaderProps>(), {
  activator: undefined,
  title: undefined,
  highlightedTitle: undefined,
  mainButtonText: undefined,
  secondaryButtonText: undefined,
  noFooter: false,
  bodyClasses: undefined,
  stepper: false,
  stepsConfig: undefined,
});
const emits = defineEmits([
  'update:modelValue',
  'onMainAction',
  'onSecondaryAction',
]);
const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};
const slots = useSlots();
const hasCustomActivator = computed(() => !!slots.activator);
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
const bodyStyles = computed(
  () =>
    props.bodyClasses || {
      'bg-white': !props.bodyClasses,
      'pa-6 gap-4': !props.stepper && !props.bodyClasses,
      'pa-0 gap-0': props.stepper && !props.bodyClasses,
      'rounded-b-lg': props.noFooter,
    },
);
// Steps Logic
const slotsList = computed(() =>
  literalArray(
    ...Object.entries(slots)
      .map((slot) => slot[0])
      .filter((slot) => slot.includes('step')),
  ),
);
</script>

<style scoped>
.body-height-stepper {
  height: calc(100% - 148px);
}

.body-height {
  max-height: calc(100% - 148px);
  overflow-y: auto;
}
</style>
