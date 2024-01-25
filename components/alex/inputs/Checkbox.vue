<template>
  <div class="container" width="113" max-width="fit-content" height="47">
    <div class="checkbox-container mr-0 pa-0 mt-0">
      <v-checkbox
        v-model:model-value="value"
        class="input-checkbox"
        :class="{
          'text-secondary-0': hasCustomIndeterminateColor,
        }"
        :indeterminate="indeterminate"
        :disabled="disabled"
        :readonly="readonly"
        color="secondary-0"
        width="18"
        data-testid="testing-checkbox"
      />
    </div>
    <div class="text-container" :class="{ 'no-hint': !hint }" width="auto">
      <span class="title" :class="{ 'gray-400': disabled || readonly }">{{
        label
      }}</span>
      <span class="hint" :class="{ 'gray-400': disabled || readonly }">
        {{ hint }}
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
interface CheckboxProps {
  modelValue: boolean | null;
  label?: string;
  hint?: string;
  indeterminate?: boolean;
  disabled?: boolean;
  readonly?: boolean;
}

const props = withDefaults(defineProps<CheckboxProps>(), {
  label: undefined,
  hint: undefined,
  indeterminate: false,
  disabled: false,
  readonly: false,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const hasCustomIndeterminateColor = computed(
  () => props.indeterminate && value.value === null,
);
</script>
<style scoped>
div {
  font-family: Sen !important;
  display: flex;
  align-items: flex-start;
}

.container {
  display: flex;
  align-items: flex-end;
  width: fit-content;
  height: 47px;
  border: none;
  gap: 0px !important;
}

.text-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  max-width: 100%;
}

.title {
  font-size: 16px;
  font-weight: 400;
  line-height: 21.6px;
  color: #454d54;
  display: flex;
  align-items: flex-start;
  padding-bottom: 4px;
}

.input-checkbox {
  margin-bottom: 3px !important;
}

.gray-400 {
  color: #a0a8b1 !important;
}

.hint {
  font-size: 14px;
  font-weight: 400;
  line-height: 18.9px;
  color: #6e7a87;
}

.no-hint {
  margin-bottom: 1.2rem !important;
}

/*
.input-indeterminate-checkbox {
  color: rgba(0, 183, 204, 1);
  border-color: #a0a8b1 !important;
}
*/
.v-selection-control__wrapper {
  color: #6e7a87 !important;
}
</style>
