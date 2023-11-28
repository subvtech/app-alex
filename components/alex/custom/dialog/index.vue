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
      :highlight="highlight"
      :on-close="() => emits('update:modelValue', false)"
    />
    <alex-custom-dialog-header
      v-else
      :title="title"
      :highlight="highlight"
      @on-close="() => emits('update:modelValue', false)"
    />
    <v-container class="bg-white pa-6 gap-6 body-max-height">
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
      :on-second-action="() => emits('onSecondAction')"
    />
    <alex-custom-dialog-footer
      v-else
      :name-main-button="nameMainButton"
      :name-second-button="nameSecondButton"
      @on-main-action="() => emits('onMainAction')"
      @on-second-action="() => emits('onSecondAction')"
    />
  </v-dialog>
</template>

<script setup lang="ts">
interface HeaderProps {
  modelValue: boolean;
  activator?: 'parent';
  title?: string;
  highlight?: string;
  nameMainButton?: string;
  nameSecondButton?: string;
}
withDefaults(defineProps<HeaderProps>(), {
  activator: undefined,
  title: undefined,
  highlight: undefined,
  nameMainButton: undefined,
  nameSecondButton: undefined,
});
const emits = defineEmits([
  'update:modelValue',
  'onMainAction',
  'onSecondAction',
]);
const handleChange = (value: boolean) => {
  emits('update:modelValue', value);
};
const slots = useSlots();
const hasCustomActivator = computed(() => !!slots.activator);
const hasHeader = computed(() => !!slots.header);
const hasFooter = computed(() => !!slots.footer);
</script>

<style scoped>
.body-max-height {
  max-height: calc(100% - 148px);
  overflow-y: auto;
}
</style>
