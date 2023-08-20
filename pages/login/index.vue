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
          <alex-inputs-stepper-field
            label="Email"
            name="email"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
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

          <v-checkbox
            v-model="checkbox"
            class="text-white"
            color="accent"
            label="Lembrar dados"
          ></v-checkbox>
          <nuxt-link to="/forgot" class="text-white my-4">
            Esqueceu sua senha?
          </nuxt-link>
          <v-btn
            block
            :disabled="!isValid"
            class="card-btn"
            type="submit"
            :loading="logging"
          >
            Entrar
          </v-btn>
        </v-form>
        <v-card-text class="text-white text-center mt-6 mb-10">
          Ainda não possui conta?
          <nuxt-link to="/register" class="text-white">
            Crie sua conta
          </nuxt-link>
        </v-card-text>
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
        <v-btn
          block
          class="card-btn metamask"
          @click="metalogin"
          :loading="logging2"
        >
          <img src="../../static/images/metamask.png" alt="" />
          <span>Acesse com a metamask</span>
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { ethers } from 'ethers';
import { useForm } from 'vee-validate';

definePageMeta({
  layout: 'auth',
});
const { login, setToken, setUser } = useStrapiAuth();
const { update, find, findOne } = useStrapi();
const router = useRouter();

const { loginSchema } = useFormRules();
const messageStore = useMessageStore();

const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: loginSchema,
  keepValuesOnUnmount: true,
});

const isValid = computed(
  () =>
    !Object.values(controlledValues.value).includes(undefined) &&
    !Object.values(errors.value).length,
);

const logging = ref(false);
const logging2 = ref(false);
const checkbox = ref(false);
const passwordVisible = ref(false);

const submit = handleSubmit(async () => {
  logging.value = true;

  try {
    await login({
      identifier: values.email,
      password: values.password,
    });

    router.push('/');
  } catch (error) {
    console.log(error);
    logging.value = false;
    messageStore.message = 'Email ou Senha inválido(s)';
  }
});

declare global {
  interface Window {
    ethereum: any;
  }
}

function withTimeout(ms, promise) {
  let timeout = new Promise((resolve, reject) => {
    let id = setTimeout(() => {
      clearTimeout(id);
      reject(`Timed out in ${ms}ms.`);
    }, ms);
  });

  return Promise.race([promise, timeout]);
}

const metalogin = async () => {
  try {
    logging2.value = true;
    if (!window.ethereum) {
      messageStore.message = 'Metamask não detectada';
      messageStore.show = true;
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);

    const signer = await withTimeout(4000, provider.getSigner());

    const data = ((await find('metamask-auth')).data as any).attributes;

    const signedMessage = await signer.signMessage(data.token);

    try {
      const response: any = await update('metamask-auth', {
        fields: { message: data.token, signedMessage, address: signer.address },
      });
      setToken(response.jwt);
      setUser(response.user);
      provider.destroy();
      router.push('/');
    } catch (err: any) {
      console.log(err);
      if (err.error.name === 'TokenExpiredError')
        messageStore.message = 'Token expirado, tente novamente.';
      else
        router.push({ path: '/register', state: { address: signer.address } });
    }
  } catch (err: any) {
    messageStore.message = 'Metamask não detectada';
    messageStore.show = true;
  } finally {
    logging2.value = false;
  }
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

  .metamask {
    background-color: white !important;
    display: flex;
    align-items: center;
    text-transform: none !important;
    width: 306px;
    min-width: 0px !important;
    gap: 8px;
    margin-inline: auto;

    img {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      font-family: 'Sen';
    }
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
