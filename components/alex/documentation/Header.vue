<template>
  <div class="rounded-lg bg-white pa-6 d-flex flex-column align-start pb-15">
    <h1 class="text-h2 text-gray-800">{{ title }}</h1>
    <p class="text-subtitle-2 text-gray-500">{{ description }}</p>
    <div
      v-if="vuetifyLink"
      class="d-flex align-center pa-4 container rounded-lg"
    >
      <img class="align-self-stretch" src="@/assets/svg/vuetify.svg" />
      <div>
        <p class="text-body-1 text-primary align-self-stretch">
          Esse componente utiliza a estrutura do Vuetify, acesse ele a partir
          desse link e veja mais informações.<br />
        </p>
        <a
          class="text-decoration-underline text-blue"
          :href="vuetifyLink"
          target="_blank"
          role="link"
          >vuetifyjs.com</a
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface HeaderComponentType {
  title: string;
  description: string;
  vuetifyLink?: string;
}

withDefaults(defineProps<HeaderComponentType>(), { vuetifyLink: undefined });
</script>
<style scoped lang="scss">
.container {
  border: 1px solid #a0a8b1;
  gap: 16px;
  align-self: stretch;
}
</style>
