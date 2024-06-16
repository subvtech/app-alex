<template>
  <v-container class="content d-flex align-content-start justify-center">
    <v-card
      align="center"
      elevation="0"
      class="bg-transparent w-100 d-flex flex-column justify-start max-w-100"
    >
      <v-card-title class="text-h3 sm-text-h2 text-white break-spaces">
        {{ $t('pages.register.title') }}
      </v-card-title>
      <alex-inputs-stepper
        no-header
        align="left"
        step-class="d-flex flex-column gap-1"
        :steps-config="stepConfig"
        :loading="registerUser.status.value === 'pending'"
        @on-success="submit"
      >
        <template
          #controls="{ isFirstStep, isLastStep, isValid, loading, onPrevStep }"
        >
          <div class="w-100 d-flex justify-end align-end gap-4 mt-4">
            <alex-custom-button
              v-if="!isFirstStep"
              size="large"
              text="Voltar"
              theme="dark"
              variant="secondary"
              prepend-icon="mdi-chevron-left"
              @click="onPrevStep"
            />
            <alex-custom-button
              size="large"
              type="submit"
              theme="dark"
              append-icon="mdi-chevron-right"
              :disabled="!isValid"
              :loading="loading"
              :text="isLastStep ? 'Criar conta' : 'Avançar'"
            />
          </div>
        </template>
        <template #step1>
          <v-card-subtitle
            class="text-white text-body-1 text-sm-subtitle-2 mb-8 break-spaces"
            align="center"
          >
            {{ $t('pages.register.subtitle1') }}
          </v-card-subtitle>
          <alex-inputs-text-field
            color="white"
            name="fullname"
            theme="dark"
            :label="$t('pages.register.fullName')"
            :placeholder="$t('pages.register.fullNameHolder')"
          />
          <alex-inputs-text-field
            color="white"
            name="email"
            theme="dark"
            :label="$t('pages.register.email')"
            :placeholder="$t('pages.register.emailHolder')"
          />
          <alex-inputs-text-field
            v-maska:[cpfMask]
            color="white"
            name="cpf"
            label="CPF"
            theme="dark"
            :placeholder="$t('pages.register.cpfHolder')"
          />
        </template>
        <template #step2="{ values }">
          <v-card-subtitle
            class="text-white text-h6 mb-8 break-spaces"
            align="center"
          >
            {{ $t('pages.register.type') }}
          </v-card-subtitle>
          <alex-inputs-select
            name="yourRole"
            theme="dark"
            class="text-secondary mb-4"
            :label="$t('pages.register.userType')"
            :items="[
              { title: $t('pages.register.typeProfessor'), value: 'professor' },
              { title: $t('pages.register.typeStudent'), value: 'aluno' },
            ]"
          />
          <alex-inputs-institutions
            v-if="values?.yourRole?.toLowerCase() == 'professor'"
            class=""
            name="institution"
            theme="dark"
            :institutions="institutions"
            :search="search"
          />
        </template>
        <template #step3="{ values }">
          <v-card-subtitle
            align="center"
            class="text-white text-h6 mb-8 break-spaces"
          >
            {{ $t('pages.register.subtitle2') }}
          </v-card-subtitle>
          <alex-inputs-text-field
            persistent-hint
            name="username"
            color="white"
            theme="dark"
            :label="$t('pages.register.username')"
            :placeholder="$t('pages.register.usernameHolder')"
            :hint="`${usernameUrl}${values.username || ''}`"
          />
          <alex-inputs-text-field
            name="password"
            color="white"
            theme="dark"
            :label="$t('pages.register.password')"
            :placeholder="$t('pages.register.passwordHolder')"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordVisible ? 'text' : 'password'"
            @click:append-inner="passwordVisible = !passwordVisible"
          />
          <alex-inputs-text-field
            name="confirmPassword"
            color="white"
            theme="dark"
            :label="$t('pages.register.confirmPassword')"
            :placeholder="$t('pages.register.confirmPasswordHolder')"
            :append-inner-icon="confirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="confirmationVisible ? 'text' : 'password'"
            :hide-details="errorMessage"
            @click:append-inner="confirmationVisible = !confirmationVisible"
          />
          <div class="my-2">
            <p v-show="errorMessage" class="text-body-1 text-error">
              {{ errorMessage }}
            </p>
          </div>
        </template>
      </alex-inputs-stepper>
      <div class="d-flex align-center text-white my-10">
        <v-divider
          class="border-opacity-100"
          color="secondary"
          :thickness="1"
        />
        <p class="mx-4">{{ $t('pages.register.divider') }}</p>
        <v-divider
          class="border-opacity-100"
          color="secondary"
          :thickness="1"
        />
      </div>
      <v-card-text class="text-white font-bold haveAccount text-body-2">
        {{ $t('pages.register.hasAccount') }}
        <nuxt-link
          to="/auth/login"
          class="text-white haveAccount-link font-bold"
        >
          {{ $t('pages.register.login') }}
        </nuxt-link>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { omit } from 'remeda';

import { type User } from '@/server/modules/users/users.schema';
import { curry } from '@/utils/curry';

const emit = defineEmits(['success:message']);

const { t } = useI18n();
const { value: wallet } = useRouteStore<{ address: string }>();
const { registerSchemas } = useFormRules();
const { $trpc } = useNuxtApp();

const registerUser = $trpc.users.register.useMutation();
const usernameUrl = computed(() => window.location.host + '/profile/');
const cpfMask = reactive({ eager: true, mask: '###.###.###-##' });
const search = ref('');
const errorMessage = ref('');
const institutions = ref([]);
const confirmationVisible = ref(false);
const passwordVisible = ref(false);

const submit = (values: {
  address?: string;
  confirmPassword: string;
  cpf: string;
  email: string;
  institution: string;
  fullname: string;
  password: string;
  username: string;
  yourRole: string;
}) => {
  const isProfessor = values.yourRole.toLowerCase() === 'professor';

  registerUser.mutate({
    ...omit(values, ['fullname']),
    name: values.fullname,
    cpf: values.cpf.replace(/\D/g, ''),
    address: wallet?.address ?? wallet?.address,
    institution: isProfessor ? values.institution : undefined,
    isProfessor,
  });
};

const verifyField = curry(async function (field: keyof User, value: string) {
  const { data: isAlreadyTaken } = await $trpc.users.isAlreadyTaken.useQuery({
    field,
    value,
  });

  if (isAlreadyTaken.value) {
    return {
      status: false,
      message: `${t(`pages.register.${field}`)} ${t(
        'pages.register.alreadyTaken',
      )}`,
    };
  }
});

const stepConfig = {
  step1: {
    scheme: registerSchemas.registerStep1,
    validate: [
      { name: 'email', callback: verifyField('email') },
      { name: 'cpf', callback: verifyField('cpf') },
    ],
  },
  step2: { scheme: registerSchemas.registerStep2 },
  step3: {
    scheme: registerSchemas.registerStep3,
    validate: [{ name: 'username', callback: verifyField('username') }],
  },
};

watchEffect(() => {
  if (registerUser.error.value) {
    errorMessage.value = t(registerUser.error.value.message);
    setTimeout(() => (errorMessage.value = ''), 5000);
    return;
  }

  if (registerUser.data.value) {
    emit('success:message');
  }
});
</script>

<style scoped lang="scss">
.content {
  padding: 32px 40px 32px 40px;
  width: 100%;
}

.break-spaces {
  white-space: break-spaces !important;
  padding-inline: 0 !important;
}

.haveAccount {
  font-weight: 700;
  height: min-content !important;
  flex: none;

  &-link {
    text-decoration: none;
    color: #00d3ec !important;
  }
}

.max-w-100 {
  max-width: 400px;
}

@media (max-height: 700px) {
  .my-3 {
    margin-block: 6px !important;
  }

  .my-10 {
    margin-block: 20px !important;
  }

  .haveAccount {
    padding-top: 0px !important;
  }

  .content {
    padding-top: 16px !important;
  }
}

@media screen and (max-width: 500px) {
  .content {
    padding: 32px 32px 32px 32px;
  }
}

@media screen and (min-width: 1100px) {
  .content {
    padding: 32px 64px 32px 64px;
  }
}

@media screen and (min-width: 1366px) {
  .content {
    padding: 32px 90px 32px 90px;
  }
}
</style>
