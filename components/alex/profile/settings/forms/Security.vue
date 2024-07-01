<template>
  <div class="field d-flex flex-row w-100 align-center justify-space-between">
    <alex-inputs-text-field
      v-if="isPassword"
      class="w-100"
      :label="label"
      :placeholder="placeholder"
      :value="value"
      variant="solo"
      :append-inner-icon="
        isDisabled ? undefined : !isPasswordVisible ? 'mdi-eye' : 'mdi-eye-off'
      "
      type="password"
      name="password"
      color="white"
      flat
      :readonly="isDisabled"
      @click:append-inner="
        isDisabled ? undefined : (isPasswordVisible = !isPasswordVisible)
      "
    />

    <alex-inputs-text-field
      v-else
      class="w-100 border-none"
      :label="label"
      :value="value"
      :placeholder="placeholder"
      variant="solo"
      type="text"
      name="email"
      color="white"
      flat
      :readonly="isDisabled"
    />

    <alex-custom-button
      class="btn ml-2"
      variant="secondary"
      size="large"
      @click="emit('click')"
    >
      {{ buttonText }}
      <v-tooltip
        :text="$t('components.profile.security.message')"
        location="top"
        activator="parent"
      />
    </alex-custom-button>
  </div>
</template>

<script setup lang="ts">
export interface SecurityFormComponentType {
  label: string;
  value: string;
  placeholder?: string;
  isPassword?: boolean;
  buttonText: string; // button text
  schema: YupSchema;
}

export interface SecurityFormEmits {
  (e: 'click'): void;
}

withDefaults(defineProps<SecurityFormComponentType>(), {
  isPassword: false,
  placeholder: undefined,
});

const emit = defineEmits<SecurityFormEmits>();

const isDisabled = ref(true);
const isPasswordVisible = ref(false);
</script>

<style scoped lang="scss">
.field {
  transition: all ease-in-out 1s;
}

@media (max-width: 450px) {
  .field {
    flex-direction: column !important;
  }
}

@media (max-width: 460px) {
  .field {
    flex-direction: column;
    .btn {
      width: 100%;
    }
  }
}
</style>
