<template>
  <div class="container" width="113" max-width="fit-content" height="47">
    <div class="checkbox-container mr-1 pa-0 mt-0">
      <v-checkbox
        :class="indeterminate ? 'input-checkbox' : ''"
        :model-value="modelValue"
        :indeterminate="indeterminate"
        :disabled="disabled"
        :readonly="readonly"
        hide-details="auto"
        color="#00b7cc"
        width="18"
        data-testid="testing-checkbox"
        @change="handleChange"
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
// let { indeterminate } = 
//o let é para que o valor de indeterminate seja reativo, mas não está funcionando. Em busca de solução
defineProps({
  label: {
    type: String,
    default: '',
  },
  hint: {
    type: String,
    default: '',
  },
  modelValue: {
    type: Boolean,
    default: false,
  },
  indeterminate: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'update:modelValue',
  'change',
  'update:indeterminate',
]);

const handleChange = ($event) => {
  const value = $event.target.checked;
  emit('update:modelValue', value);

  // if (indeterminate) {
  //   indeterminate = false;
  //   emit('update:indeterminate', false);
  // }
  // aqui não estou conseguindo setar o valor de indeterminate para false, em busca de solução
};
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

.input-checkbox {
  color: rgba(0, 183, 204, 1) !important;
  border-color: #a0a8b1 !important;
  position: relative !important;
}
</style>
