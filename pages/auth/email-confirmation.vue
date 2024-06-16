<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'guest-only',
});

const { $trpc } = useNuxtApp();
const { t } = useI18n();
const route = useRoute();
const errorMessage = ref('');
const emailConfirmed = $trpc.users.confirmEmail.useMutation();

onMounted(() => {
  emailConfirmed.mutate({ token: route.query.token as string });
});

watchEffect(() => {
  if (emailConfirmed.error.value) {
    switch (emailConfirmed.error.value.message) {
      case 'invalid_email':
        errorMessage.value = t('auth.invalid_email');
        break;

      case 'invalid_token':
        errorMessage.value = t('auth.invalid_token');
        break;

      default: {
        const zodError = emailConfirmed.error.value.data?.zodError;
        errorMessage.value = zodError?.fieldErrors.token?.includes('Required')
          ? t('auth.confirmation_token_required')
          : t('errors.default');
        break;
      }
    }
  }
});
</script>

<template>
  <div class="container fill-height">
    <div v-if="errorMessage">
      {{ errorMessage }}
    </div>
    <div
      v-if="emailConfirmed.data.value?.success"
      class="row fill-height d-flex"
    >
      <div
        id="img"
        class="img col fill-height d-flex justify-center align-center"
      >
        <img
          class="w-50 pa-6"
          src="https://alexproject.nyc3.digitaloceanspaces.com/strapi-test/30363f52492aae3f8cf7f931688e7199.png"
        />
      </div>
      <div
        id="message"
        class="col fill-height bg-primary-0 px-16 d-flex flex-column justify-center align-center"
      >
        <div class="content">
          <ForgotPasswordConfirmationMessage
            class="title-text-message"
            :title="$t('pages.emailConfirmation.success.title')"
            :text="$t('pages.emailConfirmation.success.subtitle1')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
html,
body {
  height: 100vh;
  margin: 0;
  padding: 0;
}

.img {
  width: 65%;
}
.fill-height {
  height: 100vh !important;
}

#message {
  background-image: url('/images/login-bg.svg');
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  max-width: 100%;
  width: 40%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.row.fill-height {
  flex: 1;
}

.v-container.v-locale--is-ltr.w-100.d-flex.flex-column.justify-start.align-center.fill-height {
  justify-content: center !important;
}

.content {
  text-align: center;
  max-width: 100%;
}

@media screen and (max-width: 1024px) {
  #img {
    width: 70% !important;
  }

  #message {
    width: 55% !important;
  }
}

@media screen and (max-width: 768px) {
  #img {
    display: none !important;
  }

  #message {
    width: 100% !important;
  }
}
</style>
