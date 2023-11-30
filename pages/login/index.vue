<template>
  <v-row id="login-page">
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            :alt="$t('pages.login.alt')"
            src="/images/imagem_login.png"
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
            src="/images/alex.svg"
            class="card-acesso-alex-logo"
          />
        </div>

        <div class="form d-flex flex-column">
          <div class="d-flex flex-column">
            <v-card-title class="text-white text-center text-bold">
              {{ $t('pages.login.welcome') }}
            </v-card-title>
            <v-card-subtitle
              class="text-white text-center"
              style="white-space: normal"
            >
              {{ $t('pages.login.access') }}
            </v-card-subtitle>
          </div>
          <v-form ref="form" @submit.prevent="submit">
            <alex-inputs-stepper-field
              :label="$t('pages.login.email')"
              name="email"
              color="white"
              class="my-1 text-secondary"
              theme="dark"
            />

            <alex-inputs-stepper-field
              :label="$t('pages.login.password')"
              :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordVisible ? 'text' : 'password'"
              name="password"
              color="white"
              class="my-1 text-secondary"
              theme="dark"
              @click:append-inner="passwordVisible = !passwordVisible"
            />

            <div
              class="d-flex justify-between align-center mb-3"
              style="height: 24px"
            >
              <v-checkbox
                v-model="checkbox"
                class="text-white smaller-text"
                color="accent"
                :label="$t('pages.login.remember')"
              ></v-checkbox>
              <nuxt-link
                to="/forgot"
                class="blue-label smaller-text text-decoration-none pb-5"
              >
                {{ $t('pages.login.forgot') }}
              </nuxt-link>
            </div>

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
          <v-card-text class="smaller-text text-white text-center">
            {{ $t('pages.login.noAccount') }}

            <nuxt-link
              to="/register"
              class="blue-label smaller-text text-decoration-none"
            >
              {{ $t('pages.login.register') }}
            </nuxt-link>
          </v-card-text>
          <div class="d-flex align-center text-white">
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
            @click="metalogin"
            :loading="logging2"
          >
            <img src="/images/metamask.png" alt="" />
            <span>{{ $t('pages.login.metamask.btn') }}</span>
          </v-btn>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
const i18n = useI18n();
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
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
    logging.value = false;
    messageStore.message = i18n.t('pages.login.loginError');
    messageStore.color = 'red';
    messageStore.show = true;
  }
});
</script>

<style scoped lang="scss">
#login-page {
  overflow-y: auto;
  .card {
    border-radius: 0 !important;

    height: 100%;
    position: absolute;
    top: 0;

    .form {
      gap: 40px;

      .v-card-subtitle {
        font-size: 1.25rem;
        padding-inline: 64px;
      }
    }

    &-imagem {
      background: #f0f0f0 !important;
      left: 0;
      width: calc(100% - 600px);

      &-imagem {
        height: 80vh;
      }
    }

    &-acesso {
      background-image: url('../../static/images/login-bg.svg');
      background-repeat: initial;
      background-size: cover;
      right: 0;
      overflow: auto;
      width: 600px;

      &-alex-logo {
        width: 100px;
        margin-block: 60px;
      }
    }

    .blue-label {
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

      img {
        height: 30px;
        width: 30px;
        margin-right: 10px;
      }
      span {
        font-size: 16px;
        color: #000000;
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

  .v-card-subtitle,
  .v-card-text,
  .v-card-title {
    padding: 0px;
    margin: 0px;
  }
}

@media (max-height: 700px) {
  #login-page {
    .card {
      &-acesso {
        &-alex-logo {
          margin-block: 40px;
        }
      }
      .form {
        gap: 24px;
      }
    }
  }
}

@media (max-width: 601px) {
  #login-page {
    .card {
      width: 100%;

      .form {
        .v-card-subtitle {
          font-size: 18px;
        }
      }
    }
  }
}

@media (max-width: 490px) {
  #login-page {
    .card {
      &-acesso {
        &-alex-logo {
          margin-block: 32px;
        }
      }

      .form {
        gap: 22px;

        .v-card-subtitle {
          font-size: 18px;
          padding-inline: 40px;
        }
      }
    }
  }
}

@media (max-width: 421px) {
  #login-page {
    .card {
      &-acesso {
        &-alex-logo {
          margin-block: 32px;
        }
      }
      .v-card-subtitle {
        font-size: 18px;
      }

      .v-card-title {
        white-space: normal;
      }
      .form {
        gap: 22px;

        ::v-deep .smaller-text {
          font-size: 12px !important;
          .v-selection-control__wrapper {
            font-size: 12px !important;
          }
          .v-label {
            font-size: 12px !important;
          }
        }
      }
    }
  }
}

@media (max-width: 380px) {
  #login-page {
    .card {
      &-acesso {
        &-alex-logo {
          margin-block: 24px;
        }
      }

      .form {
        gap: 14px;
        .v-card-subtitle {
          font-size: 1rem;
        }
        .v-card-title {
          font-size: 18px;
        }

        .metamask {
          span {
            font-size: 12px;
          }
        }
      }
    }
  }
}

@media (max-width: 348px) {
  #login-page {
    .card {
      .form {
        gap: 12px;
        .v-card-subtitle {
          font-size: 1rem;
        }
      }
    }
  }
}
</style>
