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
      <v-card v-if="checkEmail" class="card card-register px-10">
        <div align="center">
          <v-img
            alt="Alex"
            src="../static/images/alex.svg"
            class="card-register-alex-logo my-15"
          />
        </div>
        <v-card-title class="text-white my-2">
          Usuário cadastrado com sucesso!
        </v-card-title>
        <v-card-subtitle class="text-white my-2">
          {{
            isProfessor
              ? 'Um administrador irá validar seu cadastro.'
              : 'Um link de ativação foi enviado para o seu email.'
          }}
        </v-card-subtitle>
        <p v-if="!isProfessor" slot="description" class="text-gray-500">
          Obs.: Verifique sua caixa de SPAM.
        </p>
        <v-btn
          type="primary"
          class="mt-6 mx-auto"
          @click="router.push('/login')"
        >
          Voltar
        </v-btn>
      </v-card>
      <v-card v-else class="card card-register px-10">
        <div align="center">
          <v-img
            alt="Alex"
            src="../static/images/alex.svg"
            class="card-register-alex-logo my-12"
          />
        </div>
        <v-card-title class="text-white my-2">
          Inicie uma nova experiência!
        </v-card-title>
        <v-card-subtitle class="text-white my-2">
          Crie uma conta e comece seus estudos
        </v-card-subtitle>
        <v-form v-model="isFormValid" @submit.prevent="submit">
          <v-text-field
            v-model="formData.fullname"
            :rules="fullnameRules"
            label="Nome completo"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="formData.username"
            :rules="usernameRules"
            label="Nome de usuário"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="formData.email"
            :rules="emailRules"
            label="E-mail"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="formData.cpf"
            :rules="cpfRules"
            type="number"
            label="CPF"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="formData.password1"
            :rules="passwordRules"
            label="Senha"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="formData.password2"
            :rules="confirmPasswordRules"
            label="Confirmar Senha"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />

          <v-radio-group
            v-model="formData.yourRole"
            row
            color="white"
            class="my-4"
            dark
          >
            <v-radio label="Estudante" value="Estudante"></v-radio>
            <v-radio label="Professor" value="Professor"></v-radio>
          </v-radio-group>

          <v-autocomplete
            v-model="formData.institution"
            v-model:search-input="search"
            :loading="fetching"
            :items="institutions"
            item-text="text"
            item-value="id"
            label="Instituição de Ensino"
            color="white"
            class="my-4"
            dark
            cache-items
          ></v-autocomplete>

          <v-btn
            block
            class="card-btn"
            type="submit"
            :loading="registering"
            :disabled="!isFormValid"
          >
            Criar Conta
          </v-btn>
        </v-form>
        <v-card-text class="text-white mt-6 mb-10">
          Já possui conta?
          <nuxt-link to="/login" class="text-white"> Acesse aqui </nuxt-link>
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

const { register } = useStrapiAuth();
const { find } = useStrapi();
const router = useRouter();

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

const checkEmail = ref(false);
const isFormValid = ref(false);
const registering = ref(false);
const fetching = ref(false);
const institutions = ref<InstitutionsType[]>([]);
const search = ref(null);
// const timeoutSearch = ref(null);
/* const roles = ref([
  { text: 'Sou Aluno', value: 'Aluno' },
  { text: 'Sou Professor', value: 'Professor' },
]);
*/
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

// const showPassword = ref(false);
// const showConfirmPassword = ref(false);

const {
  fullnameRules,
  usernameRules,
  emailRules,
  cpfRules,
  passwordRules,
  confirmPasswordRules,
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

    &-alex-logo {
      width: 100px;
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

.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}
</style>
