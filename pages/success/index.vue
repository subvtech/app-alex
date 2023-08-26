<template>
  <v-row>
    <v-col>
      <v-card class="card card-imagem">
        <div align="center">
          <img
            alt="Crie sua conta"
            src="../../static/images/SignUp.svg"
            class="card-imagem-imagem my-5"
          />
        </div>
      </v-card>
    </v-col>
    <v-col>
      <v-card class="card card-register px-10" align="center">
        <div class="card-register-images mb-auto">
          <img
            alt="Alex"
            src="../../static/images/alex.svg"
            class="card-register-alex-logo"
          />
          <img
            alt="EllipseTop"
            src="../../assets/svg/Ellipse.svg"
            class="card-register-images-top-ellipse"
          />
        </div>
        <v-sheet
          variant="outlined"
          border-color="white"
          elevation="0"
          rounded="lg"
          color="transparent"
          border="md opacity-100"
          class="border-green pa-4 text-center mx-auto mb-6"
        >
          <h2 class="text-white text-h5 mb-2" align="left" ref="el">
            {{ value?.title }}
          </h2>

          <p class="mb-2 text-grey text-subtitle-1" align="left">
             {{  value?.paragraph }}
          </p>
        </v-sheet>
        <nuxt-link
          to="/login"
          class="text-white haveAccount-link font-bold mb-auto"
        >
          <v-icon start icon="mdi-arrow-left"></v-icon>
          Voltar para o login
        </nuxt-link>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});
const { value } = useRouteStore<{title: string, paragraph: string}>()

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
    overflow-y: auto;
    overflow-x: hidden;
    width: 600px;
    display: flex;
    flex-direction: column;
    padding: clamp(25px, 12vh, 86px) !important;
    // gap: 1rem;
    &-alex-logo {
      width: 120px;
      height: 40px;
      margin-bottom: clamp(25px, 5vh, 60px);
    }
    &-images {
      position: relative;
      height: min-content;
      user-select: none;
      pointer-events: none;

      &-top-ellipse {
        width: 820px;
        position: absolute;
        bottom: 0;
        left: 50%;
        translate: -50%;
      }
      &-bottom-ellipse {
        width: 820px;
        position: absolute;
        top: 0;
        left: 50%;
        translate: -50%;
      }
    }
  }
}

.haveAccount {
  height: min-content !important;
  color: #00d3ec !important;

  &-link {
    text-decoration: none;
    font-size: 16px;
    color: #00d3ec !important;
  }
}
.border-green {
  border-color: #67b055 !important;
}
.title {
  font-size: 24px;
}

@media screen and (max-height: 800px) {
  .card-register {
    padding-top: clamp(25px, 8vh, 60px) !important;
    padding-bottom: clamp(25px, 8vh, 60px) !important;
  }
}
@media screen and (max-height: 850px) {
  .card-register-images-top-ellipse {
    width: 700px;
    bottom: -30px;
    left: 50%;
    translate: -50%;
  }
}
</style>
