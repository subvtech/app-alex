<template>
  <v-row id="login-page" data-testid="login">
    <v-col>
      <v-card class="card card-imagem">
        <div class="tw-flex tw-justify-center tw-items-center tw-h-full tw-border-yellow-200">
          <img
            :alt="$t('pages.login.alt')"
            src="public/images/imagem_login.png"
            class="card-imagem-imagem my-5 tw-bg-contain"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card card-acesso d-flex justify-center">
        <div class="form d-flex flex-column" style="max-width: 400px">
          <div class="d-flex flex-column">
            <v-card-title class="text-white text-h3 text-center text-bold mt-16 !tw-hidden md:!tw-block">
              {{ $t('pages.login.welcome') }}
            </v-card-title>
            <v-card-subtitle
              class="text-subtitle-2 text-white text-center !tw-hidden md:!tw-block"
              style="white-space: normal"
            >
              {{ $t('pages.login.access') }}
            </v-card-subtitle>
          </div>
          <v-form ref="form" class="main-forms d-flex flex-column gap-1" @submit.prevent="submit">
            <alex-inputs-text-field
              :label="$t('pages.login.user')"
              :placeholder="$t('pages.login.userHolder')"
              name="email"
              color="white"
              theme="dark"
            />

            <alex-inputs-text-field
              :label="$t('pages.login.password')"
              :placeholder="$t('pages.login.passwordHolder')"
              :append-inner-icon="!passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
              :type="passwordVisible ? 'text' : 'password'"
              name="password"
              color="white"
              theme="dark"
              :hide-details="hasError"
              @click:append-inner="passwordVisible = !passwordVisible"
            />
            <div class="mt-2">
              <p v-show="hasError" class="text-body-1 text-error">
                {{ errorMessage }}
              </p>
            </div>
            <div class="d-flex justify-space-between align-center mb-2" style="max-height: 30px">
              <v-checkbox
                v-model="checkbox"
                class="text-white smaller-text"
                color="accent"
                base-color="white"
                hide-details
                style="margin-left: -8px"
              >
                <template #label>
                  <span class="text-white text-body-2 text-high-emphasis">{{ $t('pages.login.remember') }}</span>
                </template>
              </v-checkbox>
              <nuxt-link to="/forgot" class="blue-label smaller-text text-decoration-none">
                {{ $t('pages.login.forgot') }}
              </nuxt-link>
            </div>

            <alex-custom-button block size="large" type="submit" theme="dark" :disabled="!isValid" :loading="logging">
              {{ $t('pages.login.submit') }}
            </alex-custom-button>
          </v-form>
          <v-card-text class="create-account text-white text-center font-weight-bold text-body-2">
            {{ $t('pages.login.noAccount') }}

            <nuxt-link to="/register" class="blue-label text-decoration-none">
              {{ $t('pages.login.register') }}
            </nuxt-link>
          </v-card-text>
          <div class="sign-divider d-flex align-center text-white">
            <v-divider color="secondary" :thickness="1" class="border-opacity-100"></v-divider>
            <p class="mx-4">{{ $t('pages.login.divider') }}</p>
            <v-divider color="secondary" :thickness="1" class="border-opacity-100"></v-divider>
          </div>

          <div class="d-flex flex-column">
            <v-btn block class="card-btn google d-flex" :loading="googleLoading" @click="googleLogin">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" class="google-icon" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.1c-.6 3-2.3 5.6-4.9 7.3v6h8c4.7-4.3 7.3-10.7 7.3-17.4z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-8-6c-2.1 1.4-4.8 2.2-7.9 2.2-6 0-11.1-4.1-12.9-9.6H2.8v6.2C6.8 42.6 14.8 48 24 48z"
                />
                <path
                  fill="#FBBC05"
                  d="M11.1 28.8c-.5-1.4-.7-2.9-.7-4.4s.2-3 .7-4.4v-6.2H2.8C1 17.1 0 20.4 0 24s1 6.9 2.8 9.8l8.3-5z"
                />
                <path
                  fill="#EA4335"
                  d="M24 9.6c3.3 0 6.3 1.1 8.6 3.4l6.5-6.5C35.1 2.5 29.9 0 24 0 14.8 0 6.8 5.4 2.8 13.8l8.3 5.2C12.9 13.7 18 9.6 24 9.6z"
                />
              </svg>
              <span>{{ $t('pages.login.google.btn') }}</span>
            </v-btn>
            <v-btn block class="card-btn metamask d-flex" :loading="logging2" @click="metalogin">
              <img src="public/images/metamask.png" alt="" />
              <span>{{ $t('pages.login.metamask.btn') }}</span>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useForm } from 'vee-validate';
import type { Strapi4Error } from '@nuxtjs/strapi/dist/runtime/types/v4';
const hasError = ref(false);
const errorMessage = ref('');
const route = useRoute();
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
});

const redirect = (route.query.redirect as string) || useCookie('redirect').value;

const { login } = useStrapiAuth();
const router = useRouter();

const { loginSchema } = useFormRules();
const { mapStrapiErrors } = useStrapiHelpers();
const { handleSubmit, errors, values, controlledValues } = useForm({
  validationSchema: loginSchema,
  keepValuesOnUnmount: true,
});

const isValid = computed(
  () => !Object.values(controlledValues.value).includes(undefined) && !Object.values(errors.value).length,
);

const logging = ref(false);
const logging2 = ref(false);
const checkbox = ref(false);
const passwordVisible = ref(false);
const { metalogin } = useMetamask(logging2);
const { googleLogin, loading: googleLoading } = useGoogleAuth();

const submit = handleSubmit(async () => {
  logging.value = true;

  try {
    await login({
      identifier: values.email,
      password: values.password,
    });
    if (redirect) {
      router.push(redirect);
      useCookie('redirect').value = null;
    } else {
      router.push('/');
    }
  } catch (err: unknown) {
    hasError.value = true;
    const error = err as Strapi4Error;
    const catchErrorMessage = error?.error?.message;
    if (catchErrorMessage) {
      errorMessage.value = mapStrapiErrors(catchErrorMessage);
    }
  } finally {
    logging.value = false;
    setTimeout(() => {
      hasError.value = false;
    }, 5000);
  }
});
</script>

<style scoped lang="scss">
#login-page {
  overflow-y: auto;

  margin: 0 !important;

  .card {
    border-radius: 0 !important;

    height: 100%;
    position: absolute;
    top: 0;

    .form {
      gap: 24px;

      .v-card-subtitle {
        font-size: 1.25rem;
      }
    }

    &-imagem {
      background: #f0f0f0 !important;
      left: 0;
      width: calc(100% - 600px);

      &-imagem {
        max-height: 80vh;
      }
    }

    &-acesso {
      background-image: url('/images/login-bg.svg');
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
      width: 629px;
      right: 0;
      overflow: auto;

      // border: solid 2px yellow;
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

    .google {
      background-color: white !important;
      align-items: center;
      text-transform: none !important;
      width: 306px;
      min-width: 0px !important;
      margin-inline: auto;

      .google-icon {
        height: 24px;
        width: 24px;
        margin-right: 10px;
        flex-shrink: 0;
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
    .main-forms {
      margin-top: 5rem;
    }

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
    .main-forms,
    .create-account,
    .sign-divider {
      padding-inline: 12px;
    }

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

        :deep(.smaller-text) {
          font-size: 12px !important;

          :deep(.v-selection-control__wrapper) {
            font-size: 12px !important;
          }

          :deep(.v-label) {
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
