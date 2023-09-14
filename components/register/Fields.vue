<template>
  <v-container
    class=" content d-flex align-content-start justify-center "
  >
    <v-card
      class="bg-transparent w-100 d-flex flex-column justify-start"
      align="center"
      elevation="0"
    >
      <v-card-title class="text-sm-h6 text-white break-spaces">
        {{ $t('pages.register.title') }}
      </v-card-title>

      <alex-inputs-stepper-form
        :schemes="[registerStep1, registerStep2, registerStep3]"
        :loading="registering"
        @onSuccess="submit"
        #default="{ activeStep, values }"
        align="left"
      >
        <alex-inputs-stepper-step :activeStep="activeStep" :step="1">
          <v-card-subtitle class="text-white mb-8 break-spaces" align="center">
            {{ $t('pages.register.subtitle1') }}
          </v-card-subtitle>

          <alex-inputs-stepper-field
            :label="$t('pages.register.fullName')"
            name="fullname"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
          />

          <alex-inputs-stepper-field
            :label="$t('pages.register.email')"
            name="email"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
          />

          <alex-inputs-stepper-field
            label="CPF"
            name="cpf"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
            v-maska:[cpfMask]
          />
        </alex-inputs-stepper-step>
        <alex-inputs-stepper-step :activeStep="activeStep" :step="2">
          <v-card-subtitle class="text-white mb-8 break-spaces" align="center">
            {{ $t('pages.register.type') }}
          </v-card-subtitle>

          <alex-inputs-stepper-field
            name="yourRole"
            color="white"
            type-field="select"
            class="my-3 text-secondary"
            :label="$t('pages.register.userType')"
            variant="outlined"
            :items="[
              { title: $t('pages.register.typeProfessor'), value: 'professor' },
              { title: $t('pages.register.typeStudent'), value: 'aluno' },
            ]"
          />

    
          <alex-inputs-institutions
            v-if="values?.yourRole?.toLowerCase() == 'professor'"
            v-model:institutions="institutions"
            v-model:search="search"
            name="institution"
          />

        </alex-inputs-stepper-step>
        <alex-inputs-stepper-step :activeStep="activeStep" :step="3">
          <v-card-subtitle class="text-white  mb-8 break-spaces" align="center">
            {{ $t('pages.register.subtitle2') }}
          </v-card-subtitle>

          <alex-inputs-stepper-field
            :label="$t('pages.register.username')"
            name="username"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
            :hint="`${usernameUrl}${values.username || ''}`"
            persistent-hint
          />

          <alex-inputs-stepper-field
            :label="$t('pages.register.password')"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordVisible ? 'text' : 'password'"
            name="password"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
            @click:append-inner="passwordVisible = !passwordVisible"
          />

          <alex-inputs-stepper-field
            :label="$t('pages.register.confirmPassword')"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :type="passwordVisible ? 'text' : 'password'"
            name="confirmPassword"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
            @click:append-inner="passwordVisible = !passwordVisible"
          />
        </alex-inputs-stepper-step>
      </alex-inputs-stepper-form>

      <div class="d-flex align-center text-white my-12">
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
const emit = defineEmits(['successMessage']);
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
const usernameUrl = computed(() => window.location.host + '/profile/')
const registering = ref(false);
const institutions = ref([]);
const search = ref('');
const passwordVisible = ref(false);
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
    institution: (institution && yourRole.toLowerCase() === 'professor') ? institution : undefined
  };

  try {
    const { user } = await register(userData);

    if (user.value!.blocked) {
      setMessage(i18n.t('pages.login.blockedError'), 'red', true);
    } else if (user.value!.confirmed) {
      registering.value = false;
      emit('successMessage');
    }
  } catch (error) {
    setMessage(error as string);
  } finally {
    registering.value = false;
  }
};


</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: clamp(150px, 20vh, 800px);
}

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
