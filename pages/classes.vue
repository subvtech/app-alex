<template>
  <div class="wrapper pa-4">
    <div class="d-flex justify-space-between">
      <alex-custom-breadcrumbs title="Meus Cursos" :items="breadcrumbs" />
      <v-btn prepend-icon="mdi-plus">Novo Curso</v-btn>
    </div>
    <div
      v-if="courses.length == 0"
      class="d-flex align-center justify-center bg-white flex-column fill-height"
    >
      <img
        class="emptyProjects-img"
        src="@/assets/svg/EmptyProjects.svg"
        alt="Empty Projects"
      />
      <p class="text-h3 text-gray-600">Nenhum curso encontrado!</p>
    </div>
    <div v-else class="d-flex fill-height w-100 bg-white pa-6 flex-column">
      <div class="d-flex w-100 h-25 justify-space-between">
        <v-text-field
          label="Pesquisar"
          prepend-inner-icon="mdi-close"
          variant="outlined"
          class="input"
        ></v-text-field>
        <div>
          <v-btn size="44px" class="bg-gray-blue mx-2">
            <v-icon
              size="24px"
              icon="mdi-format-list-bulleted"
              color="gray-600"
            />
          </v-btn>
          <v-btn size="44px" class="bg-gray-blue">
            <v-icon size="24px" icon="mdi-filter-variant" color="gray-600" />
          </v-btn>
        </div>
      </div>
      <div class="d-flex w-100 h-75" style="gap: 24px">
        <v-card
          class="d-flex align-center justify-center flex-column"
          max-width="400"
          outlined
          v-for="course in courses"
          :key="course"
        >
          <v-img
            src="https://cdn.vuetifyjs.com/images/cards/cooking.png"
            height="200px"
            width="100%"
          />
          <v-card-title class="text-h5 text-center">{{ course }}</v-card-title>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
const courses = ref(['Curso 1', 'Curso 2', 'Curso 3']);

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Meus Cursos',
    href: '/course',
  },
];
</script>

<style scoped>
.emptyProjects-img {
  max-width: 400px;
  max-height: 360px;
}

.wrapper {
  height: calc(100vh - 150px);
}

.input {
  height: 44px;
  max-width: 300px;
}
</style>
