<template>
  <v-dialog
    max-width="720"
    transition="dialog-center-transition"
    class="custom-alex-dialog"
    :model-value="modelValue"
    :activator="activator"
    data-testid="alex-dialog"
    @update:model-value="handleChange"
  >
    <template v-if="hasCustomActivator" #activator="{ isActive, props }">
      <slot name="activator" :is-active="isActive" :props="props" />
    </template>
    <slot
      v-if="hasHeader"
      name="header"
      :title="title"
      :highlighted-title="highlightedTitle"
      :on-close="() => emits('update:modelValue', false)"
    />
    <alex-custom-dialog-header
      v-else
      :title="title"
      :highlighted-title="highlightedTitle"
      @on-close="() => emits('update:modelValue', false)"
    />
    <v-container class="body-max-height" :class="bodyStyles">
      <v-row dense>
        <v-col dense>
          <slot />
        </v-col>
      </v-row>
    </v-container>
    <slot
      v-if="hasFooter"
      name="footer"
      :on-main-action="() => emits('onMainAction')"
      :on-secondary-action="() => emits('onSecondaryAction')"
    />
    <alex-custom-dialog-footer
      v-else-if="!hasFooter && !noFooter"
      :main-button-text="mainButtonText"
      :secondary-button-text="secondaryButtonText"
      @on-main-action="() => emits('onMainAction')"
      @on-secondary-action="() => emits('onSecondaryAction')"
    />
  </v-dialog>
</template>

<script setup lang="ts">
interface HeaderProps {
  modelValue: boolean;
  activator?: 'parent';
  title?: string;
  bodyClasses?: string;
  highlightedTitle?: string;
  mainButtonText?: string;
  secondaryButtonText?: string;
  noFooter?: boolean;
}
const props = withDefaults(defineProps<HeaderProps>(), {
  activator: undefined,
  title: undefined,
  highlightedTitle: undefined,
  mainButtonText: undefined,
  secondaryButtonText: undefined,
  noFooter: false,
  bodyClasses: undefined,
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
const bodyStyles = computed(() =>
  props.bodyClasses
    ? props.bodyClasses
    : {
        'bg-white pa-6 gap-6': !props.bodyClasses,
        'rounded-b-lg': props.noFooter,
      },
);
</script>

<style scoped>
.body-max-height {
  max-height: calc(100% - 148px);
  overflow-y: auto;
}
</style>
