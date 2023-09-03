<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col>
        <AutoBreadcrumbs :breadcrumbs="breadcrumbs" title="Projetos" />
      </v-col>
      <v-col cols="auto" class="d-flex align-center">
        <v-btn icon="mdi-plus" color="secondary-0" size="small" />
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-container class="bg-white rounded-lg pa-6" fluid>
          <v-row>
            <v-col>
              <v-tabs
                v-model="tab"
                selected-class="selected-tab"
                hide-slider
                color="gray-900"
              >
                <v-tab
                  value="all"
                  class="rounded text-transform-none"
                  :ripple="false"
                  text="Todos"
                />
                <v-tab
                  value="myProjects"
                  class="rounded text-transform-none"
                  :ripple="false"
                  text="Meus Projetos"
                />

                <v-tab
                  value="participating"
                  class="rounded text-transform-none"
                  :ripple="false"
                  text="Participando"
                />
              </v-tabs>
            </v-col>
            <v-col cols="auto" class="d-flex align-center" style="gap: 8px"
              ><v-btn
                icon="mdi-view-dashboard-outline"
                color="primary-2"
                variant="outlined"
                size="small"
                rounded="lg"
                :max-width="smAndDown ? 40 : undefined"
              /><v-btn
                :icon="smAndDown ? 'mdi-filter-variant' : undefined"
                :prepend-icon="!smAndDown ? 'mdi-filter-variant' : undefined"
                color="primary-2"
                variant="outlined"
                rounded="lg"
                class="text-transform-none"
                style="height: 40px"
                :text="!smAndDown ? 'Filtros' : undefined"
                :max-width="smAndDown ? 40 : undefined"
              />
            </v-col>
          </v-row>
          <v-row class="pt-8">
            <v-col
              v-for="{
                id,
                title,
                subtitle,
                keyWords,
                facilitator,
                trails,
              } in projects"
              :key="id"
              cols="auto"
              transition="scroll-x-transition"
            >
              <ProjectCard
                :id="id"
                :title="title"
                :subtitle="subtitle"
                :key-words="keyWords"
                :facilitator="facilitator"
                :trails-count="trails"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const breadcrumbs = [
  {
    title: 'Home',
    disabled: false,
    href: '/',
  },
  {
    title: 'Projetos',
    disabled: true,
    href: '/projects',
  },
];
const tab = ref<'all' | 'myProjects' | 'participating'>('all');
const { smAndDown } = useDisplay();
const projects = [
  {
    id: 1,
    title: 'Gerenciamento de projetos de redes de computadores',
    subtitle:
      '  Fala pessoal, tudo bem? Sejam bem vindos ao Plano de Aprendizagem sobre Gerenciamento de Projetos e aprendizagem',
    keyWords: ['Liderança', 'Liderança'],
    facilitator: 'Glevson',
    trails: 12,
  },
];
</script>

<style scoped>
.selected-tab {
  background-color: rgb(var(--v-theme-gray-100));
}
.text-transform-none {
  text-transform: none;
}
</style>
