<template>
  <v-container
    class="w-100 fill-height d-flex justify-center align-content-center"
  >
    <v-card
      variant="outlined"
      class="w-100 pa-4 rounded-lg"
      color="green-lighten-1"
    >
      <v-card-title class="text-white">{{ title }}</v-card-title>
      <v-card-text class="text-body-1 text-grey-lighten-1"
        >{{ text }}
        <strong class="text-white font-weight-bold"> {{ email }} </strong>.
        {{ text2 }}
      </v-card-text>
    </v-card>
    <NuxtLink to="/login" class="text-accent text-decoration-none mt-6">
      <v-icon icon="mdi-arrow-left" class="mr-1" />{{
        $t('pages.forgot.success.return')
      }}
    </NuxtLink>
  </v-container>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    text: { type: String, required: true },
    text2: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
  },
};
</script>
