<template>
  <v-container
    class="w-100 fill-height d-flex align-content-center padding flex-column"
  >
    <v-card
      variant="outlined"
      class="w-100 pa-4 rounded-lg card"
      color="green-lighten-1"
    >
      <v-card-title class="title text-white">{{ title }}</v-card-title>
      <v-card-text class="text-body-1 text-grey-lighten-1">
        <template v-if="email">
          {{ peaces[0] }}
          <strong class="text-white font-weight-bold"> {{ email }} </strong>
          {{ peaces[1] }}
        </template>
        <template v-else>
          {{ subtitle }}
        </template>
      </v-card-text>
    </v-card>
    <NuxtLink to="/login" class="text-accent text-decoration-none mt-6">
      <v-icon icon="mdi-arrow-left" class="mr-1" />{{
        $t('pages.forgot.success.return')
      }}
    </NuxtLink>
  </v-container>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  email: { type: String, required: false },
});

const peaces = computed(() => props.subtitle.split('|'));
</script>

<style scoped lang="scss">
.padding {
  padding: 32px 40px 32px 40px;
}

.title {
  width: auto;
  white-space: break-spaces !important;
  word-wrap: break-word !important;
}

.card {
  max-width: 600px;
}

@media screen and (min-width: 1100px) {
  .padding {
    padding: 32px 64px 32px 64px;
  }
}

@media screen and (min-width: 1366px) {
  .padding {
    padding: 32px 90px 32px 90px;
  }
}
</style>
