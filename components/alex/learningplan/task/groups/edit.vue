<template>
  <header class="d-flex align-start ga-4">
    <alex-custom-button icon="mdi-chevron-left" variant="text" />
    <div class="flex-fill text-center">
      <p class="text-subtitle-2 text-gray-600">Grupo de integrantes</p>
      <p class="text-h2 text-gray-800 my-1">Servidores Windows</p>
      <p class="text-subtitle-2 text-gray-600">Turma A</p>
    </div>
    <alex-custom-button icon="mdi-dots-vertical" variant="text" />
  </header>

  <alex-inputs-text-field
    class="tw-w-full mb-6"
    name="group"
    prepend-inner-icon="mdi-magnify"
    placeholder="Buscar participantes"
    density="comfortable"
  />

  <div v-if="inCharge.length" class="mb-6">
    <p class="text-h5 text-gray-800 mb-2">Responsável</p>
    <div>
      <alex-learningplan-task-groups-card
        v-for="(responsible, index) in inCharge"
        :key="index"
        :name="responsible.name"
        :email="responsible.email"
        :image-url="responsible.imageUrl"
      />
    </div>
  </div>

  <div v-if="members.length">
    <p class="text-h5 text-gray-800 mb-2">Membros</p>
    <div>
      <alex-learningplan-task-groups-card
        v-for="(member, index) in members"
        :key="index"
        :name="member.name"
        :email="member.email"
        :image-url="member.imageUrl"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const inCharge = [
  {
    name: 'Lucas',
    email: 'lucas@gmail.com',
    imageUrl:
      'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/01/the-rock-wwe-e1704372263949.jpg',
  },
  {
    name: 'Jefferson',
    email: 'jefferson@gmail.com',
  },
  {
    name: 'Rafael',
    email: 'rafael@gmail.com',
  },
];

const members = [
  {
    name: 'Jefferson',
    email: 'jefferson@gmail.com',
  },
  {
    name: 'Rafael',
    email: 'rafael@gmail.com',
    imageUrl:
      'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/01/the-rock-wwe-e1704372263949.jpg',
  },
];
</script>
