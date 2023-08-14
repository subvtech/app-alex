<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Crie sua conta"
            src="../static/images/imagem_register.png"
            class="card-imagem-imagem my-5"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card card-register px-10" align="center">
        <div align="center">
          <img
            alt="Alex"
            src="../static/images/alex.svg"
            class="card-register-alex-logo mt-8 mb-4"
          />
        </div>
        <v-card-title class="text-white title">
          Inicie uma nova experiência!
        </v-card-title>
        <alex-inputs-steps :steps="3" :submit="teste" align="left">
          <template #step1>
            <v-card-subtitle class="text-white mb-8" align="center">
              Crie uma conta e comece seus estudos
            </v-card-subtitle>

            <v-text-field
              v-model="formData.fullname"
              :rules="fullnameRules"
              label="Nome completo"
              color="white"
              class="text-secondary"
              required
            />

            <v-text-field
              v-model="formData.email"
              :rules="emailRules"
              label="E-mail"
              color="white"
              class="text-secondary"
              required
            />
            <v-text-field
              v-model="formData.cpf"
              :rules="cpfRules"
              type="number"
              label="CPF"
              color="white"
              class="text-secondary"
              :counter="11"
              required
            />
          </template>
          <template #step2>
            <v-card-subtitle class="text-white mb-8" align="center">
              Informe o tipo da sua conta
            </v-card-subtitle>
            <v-select
              v-model="formData.yourRole"
              class="text-secondary"
              label="Tipo de Usuário"
              :rules="userType"
              variant="outlined"
              required
              :items="['Professor', 'Aluno']"
            ></v-select>
            <v-select
              v-if="isProfessor"
              v-model="formData.institution"
              class="text-secondary"
              label="Instituição de Ensino"
              :rules="userType"
              variant="outlined"
              required
              :items="['Instituto Federal de Alagoas - IFAL']"
            ></v-select>
          </template>
          <template #step3>
            <v-card-subtitle class="text-white mb-4" align="center">
              Insira seus dados de acesso
            </v-card-subtitle>
            <v-text-field
              v-model="formData.username"
              :rules="usernameRules"
              label="Nome de Usuário"
              color="white"
              class="my-3 text-secondary"
              required
              :hint="`${usernameUrl}${formData.username}`"
              persistent-hint
            />

            <v-text-field
              v-model="formData.password1"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="passwordRules"
              :type="passwordVisible ? 'text' : 'password'"
              class="text-secondary"
              label="Senha"
              variant="outlined"
              theme="dark"
              @click:append-inner="passwordVisible = !passwordVisible"
            />
            <v-text-field
              v-model="formData.password2"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :rules="confirmPasswordRules"
              :type="passwordVisible ? 'text' : 'password'"
              class="text-secondary"
              label="Confirme a senha"
              variant="outlined"
              required
              @click:append-inner="passwordVisible = !passwordVisible"
            />
          </template>
        </alex-inputs-steps>
        <div class="d-flex align-center text-white my-6">
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
const messageStore = useMessageStore();
definePageMeta({
  layout: 'auth',
});

type FormDataType = {
  fullname: string;
  username: string;
  email: string;
  cpf: string;
  password1: string;
  password2: string;
  yourRole: string;
  institution: string;
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
const checkEmail = ref(false);
const registering = ref(false);
const fetching = ref(false);
const institutions = ref<InstitutionsType[]>([]);
const search = ref(null);

const formData = ref<FormDataType>({
  fullname: '',
  username: '',
  email: '',
  cpf: '',
  password1: '',
  password2: '',
  yourRole: '',
  institution: '',
});

const passwordVisible = ref(false);

const {
  fullnameRules,
  usernameRules,
  emailRules,
  cpfRules,
  passwordRules,
  confirmPasswordRules,
  userType,
} = useFormRules(formData.value);

const isProfessor = computed(() => {
  return formData.value.yourRole === 'Professor';
});

const fetchInstitutions = async (instValue: any) => {
  fetching.value = true;
  try {
    const res = await find(
      `/institutions?nome_contains=${instValue}&tipo=matriz&_limit=10`,
    );
    const resultArr = (res.data.length > 0 ? res.data : []).map((r: any) => {
      return {
        id: r.id,
        value: r.nome,
        sigla: r.sigla,
        text: r.nome,
        tipo: r.tipo,
      };
    });

    institutions.value = resultArr;
  } catch (error) {
    console.log({ error });
    messageStore.message = 'Ocorreu um erro na busca.';
  }
  fetching.value = false;
};

const teste = () => {
  console.log(formData.value);
};
const submit = async () => {
  registering.value = true;

  const { cpf, email, password1, username, fullname, institution } =
    formData.value;

  if (!institution) {
    messageStore.message = 'Selecione sua instituição.';
    return;
  }

  const userData = {
    cpf,
    email,
    password: password1,
    username,
    fullname,
    institution: [institution],
    isProfessor: isProfessor.value,
  };

  try {
    const { user } = await register(userData);

    if (user.value!.blocked) {
      messageStore.message = 'Usuário bloqueado!';
    } else if (user.value!.confirmed) {
      router.push('/');
    } else {
      checkEmail.value = true;
    }
  } catch (error) {
    registering.value = false;
    messageStore.message = error as string;
  }
};

watch(
  () => search,
  async (value) => {
    await fetchInstitutions(value);
  },
);
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
    overflow: auto;
    width: 600px;
    display: flex;
    flex-direction: column;
    // gap: 1rem;
    &-alex-logo {
      width: 120px;
      height: 40px;
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
  &-link {
    text-decoration: none;
    color: #00d3ec !important;
    font-size: 16px;
  }
}
</style>
