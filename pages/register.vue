<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Crie sua conta"
            src="/images/imagem_register.png"
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
            src="/images/alex.svg"
            class="card-register-alex-logo my-15"
          />
        </div>
        <v-card-title class="white--text my-2">
          Usuário cadastrado com sucesso!
        </v-card-title>
        <v-card-subtitle class="white--text my-2">
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
            src="/images/alex.svg"
            class="card-register-alex-logo my-12"
          />
        </div>
        <v-card-title class="white--text my-2">
          Inicie uma nova experiência!
        </v-card-title>
        <v-card-subtitle class="white--text my-2">
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
            :loading="fetching"
            :items="institutions"
            :search-input.sync="search"
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
        <v-card-text class="white--text mt-6 mb-10">
          Já possui conta?
          <nuxt-link to="/login" class="white--text"> Acesse aqui </nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import FacebookSvg from '~/assets/svg/facebook.svg';
import form from '~/mixins/form';

const { register } = useStrapiAuth();
const { find } = useStrapi();
const user = useStrapiUser();

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

type Institutions = {
  id: String;
  value: String;
  sigla: String;
  text: String;
  tipo: String;
};

export default {
  name: 'RegisterPage',
  mixins: [form],
  layout: 'auth',
  asyncData({ req = {} }: any) {
    return {
      host: process.server ? (req.headers || {}).host : location.host,
      formData: {
        fullname: '',
        username: '',
        email: '',
        cpf: '',
        password1: '',
        password2: '',
        yourRole: '',
        institution: '',
      } as FormDataType,
      showPassword: false,
      showConfirmPassword: false,
      fullnameRules: [(v) => !!v || 'Nome completo é necessário'],
      usernameRules: [(v) => !!v || 'Usuário é necessário'],
      emailRules: [
        (v) => !!v || 'Email é necessário',
        (v) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
      ],
      cpfRules: [
        (v) => !!v || 'CPF é necessário',
        (v) => v.length === 11 || 'CPF contem 11 caracteres',
      ],
      passwordRules: [(v) => !!v || 'Senha é necessária'],
    };
  },
  data() {
    return {
      FacebookSvg,
      checkEmail: false,
      isFormValid: false,
      registering: false,
      fetching: false,
      institutions: [],
      search: null,
      timeoutSearch: null,
      roles: [
        { text: 'Sou Aluno', value: 'Aluno' },
        { text: 'Sou Professor', value: 'Professor' },
      ],
    };
  },
  computed: {
    isProfessor() {
      return this.role === 'Professor';
    },
    confirmPasswordRules() {
      return [
        (v) => !!v || 'Senha é necessária',
        (v) => v === this.formData.password1 || 'Senha diferentes',
      ];
    },
  },
  watch: {
    async search(value) {
      await this.fetchInstitutions(value);
    },
  },
  methods: {
    async fetchInstitutions(instValue) {
      this.fetching = true;
      try {
        const res = await find(
          `/institutions?nome_contains=${instValue}&tipo=matriz&_limit=10`,
        );
        const resultArr = (res.data.length > 0 ? res.data : []).map(
          (r: any) => {
            return {
              id: r.id,
              value: r.nome,
              sigla: r.sigla,
              text: r.nome,
              tipo: r.tipo,
            };
          },
        );

        this.institutions = resultArr;
      } catch (error) {
        console.log({ error });
        this.$error('Ocorreu um erro na busca.');
      }
      this.fetching = false;
    },

    async submit() {
      this.registering = true;

      const { cpf, email, password1, username, fullname, institution } =
        this.formData;

      if (!institution) {
        this.$error('Selecione sua instituição.');
        return;
      }

      const userData = {
        cpf,
        email,
        password: password1,
        username,
        fullname,
        institution: [institution],
        isProfessor: this.isProfessor,
      };

      try {
        const { user } = await register(userData);

        if (user.blocked) {
          this.$error('Usuário bloqueado!');
        } else if (user.confirmed) {
          this.router.push('/');
        } else {
          this.checkEmail = true;
        }
      } catch (error) {
        this.registering = false;
        this.$error(error);
      }
    },
  },
};
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
