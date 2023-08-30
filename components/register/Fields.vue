<template>
  <v-container  class="w-100 content  d-flex align-content-start justify-center maxW-200 ">
    <v-card class="bg-transparent w-100 d-flex flex-column  justify-center" align="center" elevation="0">
       <!-- <div class="logo"/> -->
      <v-card-title class="text-white title">
        {{ $t('pages.register.title') }}
      </v-card-title>
      <alex-inputs-stepper-form
        :schemes="[registerStep1, registerStep2, registerStep3]"
        :loading="registering"
        :onSuccess="submit"
        #default="{ activeStep, values }"
        align="left"
      >
        <alex-inputs-stepper-step :activeStep="activeStep" :step="1">
          <v-card-subtitle class="text-white mb-8" align="center">
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
          <v-card-subtitle class="text-white mb-8" align="center">
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

          <alex-inputs-stepper-field
            v-if="values?.yourRole?.toLowerCase() == 'professor'"
            typeField="autocomplete"
            name="institution"
            v-model:search="search"
            :loading="fetching"
            :items="institutions"
            item-text="text"
            item-value="id"
            item-title="text"
            :label="$t('pages.register.institution')"
            color="white"
            class="my-3 text-secondary"
            variant="outlined"
            required
            cache-items
          />
        </alex-inputs-stepper-step>
        <alex-inputs-stepper-step :activeStep="activeStep" :step="3">
          <v-card-subtitle class="text-white mb-8" align="center">
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
import { useI18n } from 'vue-i18n';
const emit = defineEmits(['successMessage'])
const { registerSchemas: {registerStep1, registerStep2, registerStep3}} = useFormRules();
const cpfMask = reactive({
  mask: '###.###.###-##',
  eager: true,
});
const i18n = useI18n();
const messageStore = useMessageStore();
const { value: wallet } = useRouteStore<{ address: string }>();

type FormDataType = {
  fullname: string;
  username: string;
  email: string;
  cpf: string;
  password: string;
  confirmPassword: string;
  yourRole: string;
  institution: string;
  address?: string;
};

type InstitutionsType = {
  id: String;
  value: String;
  sigla: String;
  text: String;
  tipo: String;
};

const { register } = useStrapiAuth();
const { find } = useStrapi();
const usernameUrl = 'https://app.projetoalex.cc/profile/';
const registering = ref(false);
const fetching = ref(false);
const institutions = ref<InstitutionsType[]>([]);
const isTyping = ref(false);
const search = ref('');
const passwordVisible = ref(false);

const fetchInstitutions = async (institution: string) => {
  fetching.value = true;
  try {
    const res = await find(
      `institutions?nome_contains=${institution}&tipo=matriz&_limit=10`,
    );
    const resultArr = (res.data.length > 0 ? res.data : []).map((r: any) => {
      return {
        id: r.id,
        value: r.attributes.nome,
        sigla: r.attributes.sigla,
        text: r.attributes.nome,
        tipo: r.attributes.tipo,
      };
    });
    institutions.value = resultArr;
  } catch (error) {
    console.log({ error });
    messageStore.color = 'red';
    messageStore.show = true;
    messageStore.message = i18n.t('pages.login.searchError');
  }
  fetching.value = false;
};

const submit = async (values: FormDataType) => {
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
  };

  if (institution && yourRole.toLowerCase() === 'professor')
    userData.institution = institution;

  try {
    const { user } = await register(userData);

    if (user.value!.blocked) {
      messageStore.color = 'red';
      messageStore.show = true;
      messageStore.message = i18n.t('pages.login.blockedError');
    } else if (user.value!.confirmed) {
      // success
      registering.value = false
      emit('successMessage')
    }
  } catch (error) {
    registering.value = false;
    messageStore.message = error as string;
  }
};

watchEffect(async (onInvalidate) => {
  if (search.value?.length > 0) {
    isTyping.value = true;
    const getData = setTimeout(async () => {
      isTyping.value = false;
      await fetchInstitutions(search.value);
    }, 500);

    onInvalidate(() => {
      clearInterval(getData);
    });
  }
});
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: clamp(150px, 20vh, 800px);
}


.content {
  padding: 32px 40px 32px 40px;
  flex-grow: 1;
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
