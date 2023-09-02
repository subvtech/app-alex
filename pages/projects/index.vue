<template>
  <v-container class="pa-0" fluid>
    <v-row>
      <v-col class="d-flex align-center">
        <h5 class="text-h5 font-weight-bold">Projetos</h5>
        <v-divider
          vertical
          :thickness="3"
          color="gray-700"
          class="ml-4"
          inset
        />
        <v-breadcrumbs :items="breadcrumbs" density="compact">
          <template #divider>
            <v-icon icon="mdi-chevron-right" color="gray-300"></v-icon>
          </template>
        </v-breadcrumbs>
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
                <v-tab value="all" class="rounded">Todos</v-tab>
                <v-tab value="myProjects">Meus Projetos</v-tab>
                <v-tab value="participating">Participando</v-tab>
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
                style="height: 40px"
                :text="!smAndDown ? 'Filtros' : undefined"
                :max-width="smAndDown ? 40 : undefined"
              />
            </v-col>
          </v-row>
          <v-row class="pt-8">
            <v-col>
              <ProjectCard />
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
</script>

<style scoped>
.selected-tab {
  background-color: rgb(var(--v-theme-gray-blue));
}
</style>
