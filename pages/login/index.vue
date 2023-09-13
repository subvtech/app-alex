<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            :alt="$t('pages.login.alt')"
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
          {{ $t('pages.login.welcome') }}
        </v-card-title>
        <v-card-subtitle class="text-white my-2">
          {{ $t('pages.login.access') }}
        </v-card-subtitle>
        <v-form ref="form" @submit.prevent="submit">
          <alex-inputs-stepper-field
            :label="$t('pages.login.email')"
            name="email"
            color="white"
            class="my-3 text-secondary"
            theme="dark"
          />

          <alex-inputs-stepper-field
            :label="$t('pages.login.password')"
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
            :label="$t('pages.login.remember')"
          ></v-checkbox>
          <nuxt-link to="/forgot" class="text-white my-4 text-decoration-none">
            {{ $t('pages.login.forgot') }}
          </nuxt-link>
          <v-btn
            block
            :disabled="!isValid"
            class="card-btn"
            type="submit"
            :loading="logging"
          >
            {{ $t('pages.login.submit') }}
          </v-btn>
        </v-form>
        <v-card-text class="text-white text-center mt-10 mb-10">
          {{ $t('pages.login.noAccount') }}
          <nuxt-link to="/register" class="no-account text-decoration-none">
            {{ $t('pages.login.register') }}
          </nuxt-link>
        </v-card-text>

        <div class="d-flex align-center text-white mb-10">
          <v-divider
            color="secondary"
            :thickness="1"
            class="border-opacity-100"
          ></v-divider>
          <p class="mx-4">{{ $t('pages.login.divider') }}</p>
          <v-divider
            color="secondary"
            :thickness="1"
            class="border-opacity-100"
          ></v-divider>
        </div>
        <v-btn
          block
          class="card-btn metamask d-flex"
          @click="metalogin()"
          :loading="logging2"
        >
          <img src="../../static/images/metamask.png" alt="" />
          <span>{{ $t('pages.login.metamask.btn') }}</span>
        </v-btn>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useForm } from 'vee-validate';
const i18n = useI18n();
definePageMeta({
  layout: 'auth',
  middleware: 'control-access'
});
const { login, setToken, setUser } = useStrapiAuth();
const { create, find } = useStrapi();
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
/*
const loadMessages = async () => {
  if (!i18n.availableLocales.includes(i18n.locale.value)) {
    await loadLocaleMessages(i18n, i18n.locale.value);
  }

  // set i18n language
  setI18nLanguage(i18n, i18n.locale.value);
};
*/

const logging = ref(false);
const logging2 = ref(false);
const checkbox = ref(false);
const passwordVisible = ref(false);

const { metalogin } = useMetamask(logging2);

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
    messageStore.message = i18n.t('pages.login.loginError');
    messageStore.color = 'red';
    messageStore.show = true;
  }
});
</script>

<style scoped lang="scss">
.card {
  border-radius: 0 !important;
  height: 100%;
  position: absolute;
  font-family: 'Sen';
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

  .no-account {
    color: #00d3ec;
    font-family: Sen;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 24px;
  }
  &-text {
    font-family: 'Montserrat';
    font-weight: 500 !important;
  }

  .metamask {
    background-color: white !important;
    align-items: center;
    text-transform: none !important;
    width: 306px;
    min-width: 0px !important;
    gap: 8px;
    margin-inline: auto;
    padding: 12px;

    img {
      height: 30px;
      width: 30px;
      margin-right: 10px;
    }
    span {
      font-size: 16px;
      font-family: 'Sen';
      font-style: normal;
      letter-spacing: normal;
      font-weight: bold;
      line-height: 22px;
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
