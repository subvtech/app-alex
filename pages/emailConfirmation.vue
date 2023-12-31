<template>
  <div class="container fill-height">
    <div class="row fill-height d-flex">
      <div class="img col xxl-6 fill-height d-flex justify-center align-center">
        <img
          style="width: 100%"
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

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: 'control-access',
});
</script>
<style scoped lang="scss">
html,
body {
  height: 100vh;
  margin: 0;
  padding: 0;
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
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.img {
  width: 65%;
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

@media screen and (max-width: 768px) {
  .img.col.xxl-6.fill-height.d-flex.justify-center.align-center {
    display: none !important;
  }
}

@media screen and (max-width: 480px) {
  .v-card-title {
    overflow: visible !important;
    overflow-wrap: break-word !important;
    text-overflow: inherit !important;
    white-space: pre-wrap !important;
    word-break: break-word;
    word-wrap: break-word !important;
  }
}
</style>
