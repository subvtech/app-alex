<template>
  <v-container id="complete-profile" class="pa-0 container-grid overflow-hidden" fluid>
    <div class="image justify-center align-center d-none d-md-flex pa-0">
      <img class="side-image" src="public/images/signUp.svg" />
    </div>
    <div class="bg-primary-0 pa-0 content-field">
      <v-container class="content d-flex align-content-start justify-center">
        <v-card
          class="bg-transparent w-100 d-flex flex-column justify-start max-w-content"
          align="center"
          elevation="0"
        >
          <v-card-title class="text-h4 text-white text-center mb-2">
            {{ $t('pages.completeProfile.title') }}
          </v-card-title>
          <v-card-subtitle class="text-white text-body-1 text-center mb-6 break-spaces">
            {{ $t('pages.completeProfile.subtitle') }}
          </v-card-subtitle>

          <v-form class="d-flex flex-column gap-3" @submit.prevent="submit">
            <alex-inputs-text-field
              :label="$t('pages.completeProfile.username')"
              :placeholder="$t('pages.completeProfile.usernameHolder')"
              name="username"
              color="white"
              theme="dark"
            />

            <alex-inputs-text-field
              v-maska:[cpfMask]
              :label="$t('pages.completeProfile.cpf')"
              :placeholder="$t('pages.completeProfile.cpfHolder')"
              name="cpf"
              color="white"
              theme="dark"
            />

            <alex-inputs-select
              name="yourRole"
              theme="dark"
              class="text-secondary"
              :label="$t('pages.completeProfile.role')"
              :items="[
                { title: $t('pages.register.typeProfessor'), value: 'professor' },
                { title: $t('pages.register.typeStudent'), value: 'aluno' },
              ]"
            />

            <alex-inputs-institutions
              v-if="currentRole === 'professor'"
              v-model:institutions="institutions"
              v-model:search="institutionSearch"
              name="institution"
              theme="dark"
            />

            <div class="mt-1">
              <p v-show="hasError" class="text-body-1 text-error">
                {{ errorMessage }}
              </p>
            </div>

            <alex-custom-button
              block
              size="large"
              type="submit"
              theme="dark"
              :disabled="!isFormValid"
              :loading="saving"
            >
              {{ $t('pages.completeProfile.submit') }}
            </alex-custom-button>
          </v-form>
        </v-card>
      </v-container>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import * as yup from 'yup';

definePageMeta({
  layout: 'auth',
  middleware: 'google-pending',
});

const { t } = useI18n();
const router = useRouter();
const client = useStrapiClient();
const strapiUser = useStrapiUser<User>();
const pendingStore = useGooglePendingStore();
const { setMessage } = useMessageStore();

const saving = ref(false);
const hasError = ref(false);
const errorMessage = ref('');
const institutions = ref<string[]>([]);
const institutionSearch = ref('');

const cpfMask = reactive({ mask: '###.###.###-##', eager: true });

const validationSchema = yup.object({
  username: yup.string().required(t('rules.username.required')).min(6, t('rules.username.min')).trim(),
  cpf: yup.string().required(),
  yourRole: yup.string().required(),
});

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema,
});

const currentRole = computed(() => values.yourRole);

const isFormValid = computed(
  () => !Object.values(controlledValues.value).includes(undefined) && !Object.values(errors.value).length,
);

const submit = handleSubmit(async (formValues) => {
  if (!strapiUser.value) return;
  saving.value = true;
  try {
    await client(`/users/${strapiUser.value.id}`, {
      method: 'PUT',
      body: {
        username: formValues.username,
        cpf: formValues.cpf,
        isProfessor: formValues.yourRole.toLowerCase() === 'professor',
        ...(formValues.institution ? { institution: formValues.institution } : {}),
      },
    });
    pendingStore.clear();
    router.push('/');
  } catch (err: any) {
    hasError.value = true;
    errorMessage.value = err?.data?.error?.message || err?.error?.message || t('pages.login.genericError');
    setTimeout(() => {
      hasError.value = false;
    }, 5000);
  } finally {
    saving.value = false;
  }
});
</script>

<style scoped lang="scss">
.container-grid {
  display: grid;
  grid-template-columns: 1fr minmax(auto, 629px);
  height: 100%;
}

.content-field {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  overflow-y: auto;
  display: grid;
}

.content {
  padding: 40px;
  width: 100%;
}

.max-w-content {
  max-width: 400px;
}

.break-spaces {
  white-space: break-spaces !important;
  padding-inline: 0 !important;
}

.side-image {
  width: clamp(500px, 65%, 1000px);
}

.content-field::-webkit-scrollbar {
  width: 12px;
}

.content-field::-webkit-scrollbar-thumb {
  background-color: #00b8cc;
  border-radius: 999px;
  border: 3px solid rgb(var(--v-theme-primary)) !important;
}

.content-field::-webkit-scrollbar-track {
  background-color: rgb(var(--v-theme-primary)) !important;
}

@media screen and (max-width: 959px) {
  .container-grid {
    grid-template-columns: 1fr;
  }

  .side-image {
    display: none;
  }
}
</style>
