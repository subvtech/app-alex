<template>
  <v-container class="content d-flex align-content-start justify-center">
    <v-card
      class="bg-transparent w-100 d-flex flex-column justify-start max-w-100"
      align="center"
      elevation="0"
    >
      <v-card-title class="text-h3 sm-text-h2 text-white break-spaces">
        {{ $t('pages.register.title') }}
      </v-card-title>
      <alex-inputs-stepper
        :steps-config="{
          step1: {
            scheme: registerStep1,
            validate: [
              {
                name: 'email',
                callback: (value) => verifyField('email', value),
              },
              {
                name: 'cpf',
                callback: (value) => verifyField('cpf', value),
              },
            ],
          },
          step2: { scheme: registerStep2 },
          step3: {
            scheme: registerStep3,
            validate: [
              {
                name: 'username',
                callback: (value) => verifyField('username', value),
              },
            ],
          },
        }"
        align="left"
        no-header
        step-class="d-flex flex-column gap-1"
        :loading="registering"
        @update-loading="(value: boolean) => (registering = value)"
        @on-success="submit"
      >
        <template
          #controls="{ isFirstStep, onPrevStep, isValid, loading, isLastStep }"
        >
          <div class="w-100 d-flex justify-end align-end gap-4 mt-4">
            <alex-custom-button
              v-if="!isFirstStep"
              variant="secondary"
              text="Voltar"
              theme="dark"
              size="large"
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
            :label="$t('pages.register.fullName')"
            :placeholder="$t('pages.register.fullNameHolder')"
            name="fullname"
            color="white"
            theme="dark"
          />

          <alex-inputs-text-field
            :label="$t('pages.register.email')"
            :placeholder="$t('pages.register.emailHolder')"
            name="email"
            color="white"
            theme="dark"
          />

          <alex-inputs-text-field
            v-maska:[cpfMask]
            :placeholder="$t('pages.register.cpfHolder')"
            label="CPF"
            name="cpf"
            color="white"
            theme="dark"
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
            class="text-secondary"
            :label="$t('pages.register.userType')"
            :items="[
              {
                title: $t('pages.register.typeProfessor'),
                value: 'professor',
              },
              { title: $t('pages.register.typeStudent'), value: 'aluno' },
            ]"
          />

          <alex-inputs-institutions
            v-if="values?.yourRole?.toLowerCase() == 'professor'"
            v-model:institutions="institutions"
            v-model:search="search"
            name="institution"
            theme="dark"
          />
        </template>
        <template #step3="{ values }">
          <v-card-subtitle
            class="text-white text-h6 mb-8 break-spaces"
            align="center"
          >
            {{ $t('pages.register.subtitle2') }}
          </v-card-subtitle>

          <alex-inputs-text-field
            :label="$t('pages.register.username')"
            :placeholder="$t('pages.register.usernameHolder')"
            name="username"
            color="white"
            theme="dark"
            :hint="`${usernameUrl}${values.username || ''}`"
            persistent-hint
          />

          <alex-inputs-text-field
            :label="$t('pages.register.password')"
            :placeholder="$t('pages.register.passwordHolder')"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordVisible ? 'text' : 'password'"
            name="password"
            color="white"
            theme="dark"
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
            :hide-details="hasError"
            @click:append-inner="confirmationVisible = !confirmationVisible"
          />
          <div class="my-2">
            <p v-show="hasError" class="text-body-1 text-error">
              {{ $t(`pages.register.${errorMessage}`) }}
            </p>
          </div>
        </template>
      </alex-inputs-stepper>

      <div class="d-flex align-center text-white my-10">
        <v-divider
          color="secondary"
          :thickness="1"
          class="border-opacity-100"
        ></v-divider>
        <p class="mx-4">{{ $t('pages.register.divider') }}</p>
        <v-divider
          color="secondary"
          :thickness="1"
          class="border-opacity-100"
        ></v-divider>
      </div>

      <v-card-text class="text-white font-bold haveAccount text-body-2">
        {{ $t('pages.register.hasAccount') }}
        <nuxt-link to="/login" class="text-white haveAccount-link font-bold">
          {{ $t('pages.register.login') }}
        </nuxt-link>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
const emit = defineEmits(['success:message']);
const {
  registerSchemas: { registerStep1, registerStep2, registerStep3 },
} = useFormRules();
const { register } = useStrapiAuth();
const { value: wallet } = useRouteStore<{ address: string }>();
const i18n = useI18n();
const cpfMask = reactive({
  mask: '###.###.###-##',
  eager: true,
});

const { findOne } = useStrapi();

const verifyField = async (field: string, inputValue: string) => {
  const registeredFields = await findOne('users', {
    fields: [field],
    filters: { [field]: inputValue },
  });
  // findOne retorna o tipo Promise<Strapi4ResponseSingle<F> que tem como atributos data e meta, entretanto no retorno dessa função está vindo um array de objetos apenas. Por isso que temos que tipar dessa forma para que não haja erros
  if ((registeredFields as unknown as []).length) {
    return {
      status: false,
      message: `${i18n.t(`pages.register.${field}`)} ${i18n.t(
        'pages.register.alreadyTaken',
      )}`,
    };
  }
};

const usernameUrl = computed(() => window.location.host + '/profile/');
const registering = ref(false);
const institutions = ref([]);
const hasError = ref(false);
const errorMessage = ref('');
const search = ref('');
const passwordVisible = ref(false);
const confirmationVisible = ref(false);
const submit = async (values: {
  fullname: string;
  username: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  yourRole: string;
  institution: string;
  address?: string;
}) => {
  registering.value = true;

  const { cpf, email, password, username, fullname, institution, yourRole } =
    values;

  const userData: {
    cpf: string;
    email: string;
    password: string;
    username: string;
    fullname: string;
    isProfessor: boolean;
    institution?: string;
    address?: string;
  } = {
    cpf,
    email,
    password,
    username,
    fullname,
    address: wallet?.address ?? wallet?.address,
    isProfessor: yourRole.toLowerCase() === 'professor',
    institution:
      institution && yourRole.toLowerCase() === 'professor'
        ? institution
        : undefined,
  };

  try {
    const { user } = await register(userData);
    if (user.value && user.value.blocked) {
      errorMessage.value = 'blockedUser';
    } else {
      emit('success:message');
    }
  } catch (err: any) {
    hasError.value = true;
    if (err.error) {
      switch (err.error.name) {
        case 'ValidationError':
          errorMessage.value = 'emailMustBeValid';
          break;
        case 'Your account has been blocked by an administrator':
          errorMessage.value = 'blockedUser';
          break;
        default:
          errorMessage.value = 'genericError';
          break;
      }
    }
  } finally {
    registering.value = false;
    setTimeout(() => {
      hasError.value = false;
    }, 3000);
  }
};
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
