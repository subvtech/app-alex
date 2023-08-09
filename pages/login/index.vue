<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Bem vindo ao Alex"
            src="../../static/images/imagem_login.png"
            class="card-imagem-imagem my-5"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card card-acesso px-10">
        <div align="center">
          <img
            alt="Alex"
            src="../../static/images/alex.svg"
            class="card-acesso-alex-logo my-15"
          />
        </div>
        <v-card-title class="text-white my-2">
          Bem vindo a plataforma ALEX!
        </v-card-title>
        <v-card-subtitle class="text-white my-2">
          Acesse sua conta e continue com seus estudos
        </v-card-subtitle>
        <v-form ref="form" @submit.prevent="submit">
          <v-text-field
            v-model="email"
            :rules="emailRules"
            label="E-mail"
            color="white"
            class="my-4"
            dark
            outlined
            required
          />
          <v-text-field
            v-model="password"
            :append-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="passwordRules"
            :type="passwordVisible ? 'text' : 'password'"
            label="Senha"
            color="white"
            class="my-4"
            dark
            outlined
            required
            @click:append="passwordVisible = !passwordVisible"
          />
          <v-checkbox
            v-model="checkbox"
            class="text-white"
            label="Lembrar dados"
            dark
          ></v-checkbox>
          <nuxt-link to="/forgot" class="text-white my-4">
            Esqueceu sua senha?
          </nuxt-link>
          <v-btn block class="card-btn" type="submit" :loading="logging">
            Entrar
          </v-btn>
        </v-form>
        <v-card-text class="text-white mt-6 mb-10">
          Ainda não possui conta?
          <nuxt-link to="/register" class="text-white">
            Crie sua conta
          </nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useMessageStore } from '~/stores/message';

const messageStore = useMessageStore();
definePageMeta({
  layout: 'auth',
});
const { login } = useStrapiAuth();
const router = useRouter();

const logging = ref(false);
const passwordVisible = ref(false);
const checkbox = ref(false);

const email = ref('');
const password = ref('');
const emailRules = [
  (v) => !!v || 'Email é necessário',
  (v) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
];
const passwordRules = [(v) => !!v || 'Senha é necessário'];

const submit = async () => {
  logging.value = true;

  try {
    await login({
      identifier: email.value,
      password: password.value,
    });

    router.push('/');
  } catch (error) {
    logging.value = false;
    messageStore.message = 'Email ou Senha inválido(s)';
  }
};
</script>

<style scoped lang="scss">
//::v-deep .theme--light.v-label,
//::v-deep .theme--light.v-input input,
//::v-deep .theme--light.v-input textarea,
//::v-deep .theme--light.v-icon {
//  color: rgba(255, 255, 255, 1);
//}
//
//.v-application .primary--text {
//  color: #00a3b7;
//}

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

  &-acesso {
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

/* Label do Input */
//.v-label,
//.v-messages,
//.v-input input,
//.v-input textarea {
//  color: white !important;
//}

//.v-application {
//  color: white !important;
//  caret-color: white !important;
//}

//.v-text-field .v-label {
//  max-width: 100%;
//  overflow: hidden;
//  text-overflow: ellipsis;
//  top: -15px;
//  white-space: nowrap;
//  pointer-events: none;
//}
//.v-text-field .v-label--active {
//  max-width: 100%;
//  transform: none;
//  pointer-events: auto;
//}
/* ------------------ */
//.v-application .primary--text {
//  color: #1867c0 !important;
//  caret-color: #1867c0 !important;
//}

//::v-deep .v-input__slot {
//  border: 1px solid #3a4b5a;
//  border-radius: 6px;
//}
//::v-deep .v-input__slot:hover {
//  border-color: #40a9ff;
//}
//::v-deep .v-input__slot:active {
//  border-color: #40a9ff;
//}

/* .theme--light.v-input,
  .theme--light.v-input input,
  .theme--light.v-input textarea {
    color: #40a9ff;
  } */

.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}

//.v-text-field {
//  padding-top: 24px;
//  margin-top: 4px;
//}

//::v-deep .v-input .v-label {
//  font-family: 'Montserrat';
//  left: 0 !important;
//  top: -25px !important;
//}
//
//::v-deep .v-text-field .v-label--active {
//  transform: none !important;
//}

//.v-input input:active,
//.v-input input:focus,
//.v-input textarea:active,
//.v-input textarea:focus {
//  outline: transparent;
//}
/* Cor do aviso abaixo do input*/
//.theme--light.v-messages {
//  font-family: 'Montserrat';
//}
</style>
