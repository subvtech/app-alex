<template>
  <v-dialog
    transition="fade-transition"
    data-testid="alex-dialog"
    :class="!isFullscreen ? 'custom-alex-dialog' : ''"
    :fullscreen="isFullscreen"
    :model-value="modelValue"
    :activator="activator"
    :max-width="isFullscreen ? '100%' : maxWidth"
    @update:model-value="handleChange"
  >
    <template v-if="hasCustomActivator" #activator="{ isActive, props: activatorProps }">
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
      v-else-if="!noHeader"
      data-testid="alex-dialog-header"
      :title="title"
      :highlighted-title="highlightedTitle"
      :maximizable="maximizable"
      :is-fullscreen="isFullscreen"
      @on-close="() => emits('update:modelValue', false)"
      @toggle-fullscreen="toggleMaximize"
    />
    <div class="pa-1 gap-4 overflow-y-auto alex-scrollbar-white w-100 tw-h-full bg-white">
      <v-row dense>
        <v-col v-if="stepper" dense :class="bodyStyles" class="rounded-b-lg">
          <alex-inputs-stepper
            :steps-config="stepsConfig"
            :step-class="['d-flex flex-column max-height-stepper pa-6', stepClass]"
            :stepper-indicator-class="`px-${mobile ? '2' : '6'} pt-6 pb-1`"
            :loading="loading"
            @on-success="emits('onMainAction')"
          >
            <template v-for="slot in slotsList" #[slot]>
              <slot :name="slot" />
            </template>
            <template #controls="{ isFirstStep, isLastStep, isValid, onPrevStep, loading: controlsLoading }">
              <slot
                v-if="hasFooter"
                name="footer"
                :emit-main-action="() => emits('onMainAction')"
                :emit-secondary-action="() => emits('onSecondaryAction')"
                :is-valid="isValid"
                :submit-loading="loading"
              />
              <alex-custom-dialog-footer
                v-else-if="!hasFooter && !noFooter"
                :no-secondary-button="isFirstStep"
                :main-button-disabled="mainButtonDisabled"
              >
                <template #mainSlotButton>
                  <alex-custom-button
                    type="submit"
                    size="large"
                    :text="isLastStep ? $t('components.dialog.create') : $t('components.dialog.next')"
                    :append-icon="!isLastStep ? 'mdi-chevron-right' : undefined"
                    :prepend-icon="isLastStep ? 'mdi-plus' : undefined"
                    :loading="controlsLoading"
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
    </div>
    <slot
      v-if="slots.footer !== undefined && !stepper"
      name="footer"
      :emit-main-action="() => emits('onMainAction')"
      :emit-secondary-action="() => emits('onSecondaryAction')"
    />
    <alex-custom-dialog-footer
      v-else-if="slots.footer === undefined && !noFooter && !stepper"
      data-testid="alex-dialog-footer"
      :main-button-text="mainButtonText"
      :main-button-icon="mainButtonIcon"
      :secondary-button-text="secondaryButtonText"
      :secondary-button-icon="secondaryButtonIcon"
      :main-button-disabled="mainButtonDisabled"
      :main-button-loading="loading"
      @on-main-action="() => emits('onMainAction')"
      @on-secondary-action="() => emits('onSecondaryAction')"
    />
  </v-dialog>
</template>

<script setup lang="ts">
import type { StepsConfig } from '@/components/alex/inputs/stepper/index.vue';
import { useDisplay } from 'vuetify/lib/framework.mjs';

interface HeaderProps {
  modelValue: boolean;
  activator?: 'parent';
  title?: string;
  bodyClasses?: string;
  highlightedTitle?: string;
  mainButtonText?: string;
  secondaryButtonText?: string;
  mainButtonDisabled?: boolean;
  mainButtonIcon?: string;
  secondaryButtonIcon?: string;
  noFooter?: boolean;
  noHeader?: boolean;
  stepper?: boolean;
  stepClass?: unknown[] | string;
  stepsConfig?: Record<string, Partial<StepsConfig>>;
  loading?: boolean;
  maxWidth?: number;
  maximizable?: boolean;
  fullscreen?: boolean;
}
const props = withDefaults(defineProps<HeaderProps>(), {
  activator: undefined,
  title: undefined,
  highlightedTitle: undefined,
  mainButtonText: undefined,
  secondaryButtonText: undefined,
  mainButtonIcon: undefined,
  secondaryButtonIcon: undefined,
  noFooter: false,
  noHeader: false,
  mainButtonDisabled: false,
  bodyClasses: undefined,
  stepper: false,
  stepsConfig: undefined,
  stepClass: undefined,
  loading: undefined,
  maxWidth: 720,
  maximizable: false,
  fullscreen: false,
});
const { mobile } = useDisplay();
const emits = defineEmits(['update:modelValue', 'update:loading', 'onMainAction', 'onSecondaryAction']);
const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};

const isFullscreen = ref(props.fullscreen);

const slots = useSlots();
const hasCustomActivator = computed(() => !!slots.activator);
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => slots.footer !== undefined);

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

const toggleMaximize = () => {
  isFullscreen.value = !isFullscreen.value;
};

watch(
  () => props.fullscreen,
  (newVal) => {
    isFullscreen.value = newVal;
  },
);
</script>
