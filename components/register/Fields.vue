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
          step3: { scheme: registerStep3 },
        }"
        :submit-loading="registering"
        align="left"
        no-header
        @on-success="submit"
      >
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
            class="mb-1"
            theme="dark"
          />

          <alex-inputs-text-field
            :label="$t('pages.register.email')"
            :placeholder="$t('pages.register.emailHolder')"
            name="email"
            color="white"
            class="mb-1"
            theme="dark"
          />

          <alex-inputs-text-field
            v-maska:[cpfMask]
            :placeholder="$t('pages.register.cpfHolder')"
            label="CPF"
            name="cpf"
            color="white"
            class="mb-1"
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

          <alex-inputs-stepper-field
            name="yourRole"
            color="white"
            field-type="VSelect"
            class="my-3 text-secondary"
            :label="$t('pages.register.userType')"
            variant="outlined"
            hide-selected
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
            autocomplete="off"
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
            class="my-3"
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
            class="my-3"
            theme="dark"
            @click:append-inner="passwordVisible = !passwordVisible"
          />

          <alex-inputs-text-field
            :label="$t('pages.register.confirmPassword')"
            :placeholder="$t('pages.register.confirmPasswordHolder')"
            :append-inner-icon="confirmationVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="confirmationVisible ? 'text' : 'password'"
            name="confirmPassword"
            color="white"
            class="my-3"
            theme="dark"
            @click:append-inner="confirmationVisible = !confirmationVisible"
          />
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

      <v-card-text class="text-white font-bold haveAccount">
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
const { setMessage } = useMessageStore();
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
      message: `${field} ${i18n.t('pages.register.alreadyTaken')}`,
    };
  }
};

const usernameUrl = computed(() => window.location.host + '/profile/');
const registering = ref(false);
const institutions = ref([]);
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
      setMessage(i18n.t('pages.login.blocked'), 'red', true);
    } else {
      emit('success:message');
    }
  } catch (err: any) {
    setMessage(err.error.message, 'red', true);
  } finally {
    registering.value = false;
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
    font-size: 16px;
  }
}

.max-w-100 {
  max-width: 450px;
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
