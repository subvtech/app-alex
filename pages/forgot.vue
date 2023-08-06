<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Recupere sua senha com email"
            src="../static/images/imagem_forgot.png"
            class="card-imagem-imagem my-5"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card v-if="checkEmail" class="card card-forgot px-10">
        <div align="center">
          <v-img
            src="../static/images/alex.svg"
            class="card-forgot-alex-logo my-15"
          />
        </div>
        <v-card class="card-forgot-aviso px-5 py-3">
          <v-card-title class="text-white my-2">
            Recuperação enviada!
          </v-card-title>
          <v-card-text class="text-white my-2">
            Enviamos instruições para o e-mail <strong>{{ email }}</strong
            >. Acesse e siga o que foi informado.
          </v-card-text>
        </v-card>
        <v-card-text class="text--white my-5">
          <nuxt-link to="/login" class="text-white">
            Voltar para o login
          </nuxt-link>
        </v-card-text>
      </v-card>
      <v-card v-else class="card card-forgot px-10">
        <div align="center">
          <v-img
            alt="Alex"
            src="~/static/images/alex.svg"
            class="card-forgot-alex-logo my-15"
          />
        </div>
        <v-card-title class="text-white my-2">
          Esqueceu sua senha?
        </v-card-title>
        <v-card-subtitle class="text-white my-2">
          Digite seu e-mail e enviaremos instruções
        </v-card-subtitle>
        <v-form @submit.prevent="submit">
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
          <v-btn block class="card-btn" type="submit" :loading="sending">
            Recuperar senha
          </v-btn>
        </v-form>
        <v-card-text class="text-white mt-6 mb-10">
          Lembrou da senha?
          <nuxt-link to="/login" class="text-white"> Acesse aqui </nuxt-link>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { forgotPassword } = useStrapiAuth();

let sending = ref(false);
let checkEmail = ref(false);
let email = ref('');
let emailRules = [
  (v) => !!v || 'Email é necessário',
  (v) => /.+@.+\..+/.test(v) || 'Adicione um e-mail valido',
];
const submit = async () => {
  sending.value = true;

  try {
    await forgotPassword({ email: email.value });

    checkEmail.value = true;
    sending.value = false;
  } catch (error) {
    sending.value = false;
    this.$error(error);
  }
};
</script>

<style scoped lang="scss">
.v-card__subtitle,
.v-card__text,
.v-card__title {
  padding: 0;
}

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
  &-forgot {
    background: #001529 !important;
    right: 0;
    overflow: auto;
    width: 600px;
    &-alex-logo {
      width: 100px;
    }
    &-aviso {
      background: none !important;
      border: 2px solid #447b46 !important;
      border-radius: 10px !important;
    }
  }
  &-text {
    font-weight: 500 !important;
  }
  &-btn {
    align-items: center;
    background: #00d3ec !important;
    border-radius: 6px;
    display: flex;
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
</style>
