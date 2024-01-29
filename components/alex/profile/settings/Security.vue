<template>
  <alex-custom-card
    class="security"
    :title="$t('components.profile.security.title')"
    :showIcon="false"
    full-width
  >
    <template v-slot:content>
      <div class="d-flex flex-wrap w-100 gap-6">
        <alex-profile-settings-forms-security
          :label="$t('components.profile.security.email')"
          :value="email"
          :button-text="$t('components.profile.security.editEmail')"
          :schema="emailRules"
        />
        <alex-profile-settings-forms-security
          :label="$t('components.profile.security.password')"
          :value="password"
          :button-text="$t('components.profile.security.editPassword')"
          :schema="passwordRules.password"
          is-password
        />
      </div>
    </template>
  </alex-custom-card>
</template>

<script setup lang="ts">
export interface SecurityEmits {
  (e: 'update'): void;
}

export interface SecurityComponentType {
  email: string;
  id: number;
}

const emit = defineEmits<SecurityEmits>();
const { setMessage } = useMessageStore();
const { emailRules, passwordRules } = useFormRules();
const editEmail = ref(false);
const editPassword = ref(false);
const password = ref('your-password');

const props = withDefaults(defineProps<SecurityComponentType>(), {});

const { email } = toRefs(props);

const cancel = () => {};

const updateEmail = async () => {
  editEmail.value = !editEmail.value;
  setMessage('Not yet implemented', 'warning', true);

  emit('update');
};

const updatePassword = () => {
  editPassword.value = !editPassword.value;
  setMessage('Not yet implemented', 'warning', true);
};
</script>

<style scoped lang="scss"></style>
