<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Crie sua conta"
            src="../static/images/SignUp.svg"
            class="card-imagem-imagem my-5"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card card-register px-10" align="center">
        <div align="center" class="card-register-images">
          <img
            alt="Alex"
            src="../static/images/alex.svg"
            class="card-register-alex-logo"
          />
          <img
            alt="EllipseTop"
            src="../assets/svg/Ellipse.svg"
            class="card-register-images-top-ellipse"
          />
        </div>
        <v-card-title class="text-white title">
          Inicie uma nova experiência!
        </v-card-title>
        <alex-inputs-stepper-form
          :schemes="[schema1, schema2, schema3]"
          :loading="registering"
          :onSuccess="submit"
          #default="{ activeStep, values }"
          align="left"
        >
          <alex-inputs-stepper-step :activeStep="activeStep" :step="1">
            <v-card-subtitle class="text-white mb-8" align="center">
              Crie uma conta e comece seus estudos
            </v-card-subtitle>

            <alex-inputs-stepper-field
              label="Nome completo"
              name="fullname"
              color="white"
              class="my-3 text-secondary"
              theme="dark"
            />

            <alex-inputs-stepper-field
              label="Email"
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
              v-maska:[options]
            />
          </alex-inputs-stepper-step>
          <alex-inputs-stepper-step :activeStep="activeStep" :step="2">
            <v-card-subtitle class="text-white mb-8" align="center">
              Informe o tipo da sua conta
            </v-card-subtitle>

            <alex-inputs-stepper-field
              name="yourRole"
              color="white"
              type-field="select"
              class="my-3 text-secondary"
              label="Tipo de Usuário"
              variant="outlined"
              :items="[
                { title: 'Professor', value: 'professor' },
                { title: 'Aluno', value: 'aluno' },
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
              label="Instituição de Ensino"
              color="white"
              class="my-3 text-secondary"
              variant="outlined"
              required
              cache-items
            />
          </alex-inputs-stepper-step>
          <alex-inputs-stepper-step :activeStep="activeStep" :step="3">
            <v-card-subtitle class="text-white mb-8" align="center">
              Insira seus dados de acesso
            </v-card-subtitle>

            <alex-inputs-stepper-field
              label="Nome de Usuário"
              name="username"
              color="white"
              class="my-3 text-secondary"
              theme="dark"
              :hint="`${usernameUrl}${values.username || ''}`"
              persistent-hint
            />

            <alex-inputs-stepper-field
              label="Senha"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordVisible ? 'text' : 'password'"
              name="password"
              color="white"
              class="my-3 text-secondary"
              theme="dark"
              @click:append-inner="passwordVisible = !passwordVisible"
            />

            <alex-inputs-stepper-field
              label="Confirmar Senha"
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
          <p class="mx-4">ou</p>
          <v-divider
            color="secondary"
            :thickness="1"
            class="border-opacity-100"
          ></v-divider>
        </div>
        <v-card-text class="text-white font-bold haveAccount">
          Se já possui conta,
          <nuxt-link to="/login" class="text-white haveAccount-link font-bold">
            Acesse aqui
          </nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { schema1, schema2, schema3 } = useFormRules();

const options = reactive({
  mask: '###.###.###-##',
  eager: true,
});
const messageStore = useMessageStore();
const walletStore = useWalletStore();
definePageMeta({
  layout: 'auth',
});

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
const router = useRouter();
const usernameUrl = 'https://app.projetoalex.cc/profile/';
const registering = ref(false);
const fetching = ref(false);
const institutions = ref<InstitutionsType[]>([]);
const isTyping = ref(false);
const search = ref('');

const passwordVisible = ref(false);

const fetchInstitutions = async (instValue: any) => {
  fetching.value = true;
  try {
    const res = await find(
      `institutions?nome_contains=${instValue}&tipo=matriz&_limit=10`,
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
    messageStore.message = 'Ocorreu um erro na busca.';
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
    address: walletStore.address ?? walletStore.address,
    isProfessor: yourRole.toLowerCase() === 'professor',
  };

  if (institution && yourRole.toLowerCase() === 'professor')
    userData.institution = institution;

  try {
    const { user } = await register(userData);

    if (user.value!.blocked) {
      messageStore.message = 'Usuário bloqueado!';
    } else if (user.value!.confirmed) {
      router.push('/');
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
.card {
  border-radius: 0 !important;
  height: 100%;
  position: absolute;
  top: 0;
  &-imagem {
    background: #f0f0f0 !important;
    left: 0;
    width: calc(100% - 600px);

    &-imagem {
      height: 80vh;
    }
  }

  &-register {
    background: #001529 !important;
    right: 0;
    overflow-y: auto;
    overflow-x: hidden;
    width: 600px;
    display: flex;
    flex-direction: column;
    padding: clamp(25px, 12vh, 90px) !important;
    // gap: 1rem;
    &-alex-logo {
      width: 120px;
      height: 40px;
      margin-bottom: clamp(25px, 5vh, 60px);
    }
    &-images {
      position: relative;
      min-height: 50px;
      user-select: none;
      pointer-events: none;

      &-top-ellipse {
        width: 820px;
        position: absolute;
        bottom: 0;
        left: 50%;
        translate: -50%;
      }
      &-bottom-ellipse {
        width: 820px;
        position: absolute;
        top: 0;
        left: 50%;
        translate: -50%;
      }
    }
  }

  &-text {
    font-family: 'Montserrat';
    font-weight: 500 !important;
  }

  &-btn {
    align-items: center;
    background: #00d3ec !important;
    border-radius: 6px;
    display: flex;
    font-family: 'Montserrat';
    font-size: 15px;
    font-weight: 600;
    flex-direction: row;
    height: 40px;
    transition: 0.5s;
    margin: 10px 0;
    justify-content: center;
    width: 100%;

    &:hover {
      color: #001529;
      background-color: #00b8cc;
      border-color: #00b8cc;
    }

    &:active {
      color: #001529;
      background-color: #00a3b7;
      border-color: #00a3b7;
    }
  }
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

.title {
  font-size: 24px;
}

@media screen and (max-height: 800px) {
  .card-register {
    padding-top: clamp(25px, 8vh, 60px) !important;
    padding-bottom: clamp(25px, 8vh, 60px) !important;
  }
}
@media screen and (max-height: 850px) {
  .card-register-images-top-ellipse {
    width: 700px;
    bottom: -30px;
    left: 50%;
    translate: -50%;
  }
}
</style>
