<template class="tw-flex tw-flex-col tw-gap-4">
  <alex-custom-breadcrumbs
    title="Projetos"
    :items="[
      { disabled: false, title: 'Home', to: '/' },
      { disabled: false, title: 'Projetos', to: '/classes' },
      {
        disabled: false,
        title: 'Sistemas Operacionais',
        to: '/classes/active-links',
      },
    ]"
  />

  <alex-custom-banner
    :profile-picture="user.avatar"
    :profile-picture-size="35"
    show-profile-picture
    darker-background
    show-shade
    show-menu
    settings-menu
    show-settings
    distribution="fullname-username-role"
    @display:settings="showSettings = !showSettings"
    :copyObject="{ label: 'Code', copyText: 'dasdasda' }"
    description="Information Systems"
    startDate="12/06/2006"
    :fullname="user.fullname"
    endDate="12/06/2016"
    :links="links"
  />

  <div>
    <NuextChild />
  </div>
</template>

<script setup lang="ts">
import { Strapi4ResponseSingle } from '@nuxtjs/strapi/dist/runtime/types';

definePageMeta({
  middleware: 'auth',
});

const showSettings = ref(false);

const user = useStrapiUser<User>();

const tag: Tag[] = [
  {
    id: 1,
    text: 'teste',
    verified: true,
    verified_date: new Date(),
    verified_by: 'teste',
    isPublic: true,
    isGeneral: true,
    learningplans: {} as Strapi4ResponseSingle<LearningPlan>,
  },
];

const links = [
  {
    label: 'Painel',
    value: '1',
  },
  {
    label: 'Documentos',
    value: '2',
  },
  {
    label: 'Tarefas',
    value: '3',
  },
  {
    label: 'Integrantes',
    value: '4',
  },
  {
    label: 'Jornada Individual',
    value: '5',
  },
  {
    label: 'Eventos',
    value: '6',
  },
];
</script>

<style lang="scss" scoped></style>
