<template>
  <p class="text-gray-800 text-body-1 mb-2">
    <span class="text-error mr-1">*</span>A qual turma o grupo pertence?
  </p>
  <alex-inputs-select
    v-model="learningClass"
    name="class"
    placeholder="Selecione a turma do grupo"
    density="comfortable"
    :items="[]"
  />

  <p class="text-gray-800 text-body-1 mb-2 mt-4">
    <span class="text-error mr-1">*</span>Qual o nome do grupo?
  </p>
  <alex-inputs-text-field
    v-model="name"
    name="name"
    placeholder="Digite o nome do grupo"
    density="comfortable"
  />

  <p class="text-gray-800 text-body-1 mb-2 mt-4">
    <span class="text-error mr-1">*</span>Quem será o responsável pelo grupo?
  </p>
  <alex-inputs-select
    v-model="responsible"
    name="class"
    placeholder="Selecione o responsável pelo grupo"
    density="comfortable"
    :items="[]"
  />

  <p class="text-gray-800 text-body-1 mb-2 mt-4">
    <span class="text-error mr-1">*</span>Quem serão os participantes do grupo?
  </p>
  <alex-inputs-select
    v-model="selectedMembers"
    name="class"
    placeholder="Selecione os participantes para o grupo"
    density="comfortable"
    :items="[]"
  />

  <p class="text-body-3 text-gray-600 mt-1">
    Só serão listados os usuários participantes do curso e que não façam parte
    do grupo
  </p>

  <div v-if="groupMembers.length" class="mt-4 px-4">
    <alex-learningplan-task-groups-card
      v-for="(member, index) in groupMembers"
      :key="index"
      :name="member.name"
      :email="member.email"
      :image-url="member.imageUrl"
      :in-charge="member.inCharge"
    />
  </div>
</template>

<script setup lang="ts">
// Models
const learningClass = ref<string>('');
const name = ref<string>('');
const responsible = ref<string>('');
const selectedMembers = ref<string>('');

// Data
const groupMembers = [
  {
    id: 1,
    name: 'Lucas',
    email: 'lucas@gmail',
    inCharge: true,
  },
  {
    id: 2,
    name: 'Fernando',
    email: 'fernando@gmail',
    imageUrl:
      'https://www.cnnbrasil.com.br/wp-content/uploads/sites/12/2024/01/the-rock-wwe-e1704372263949.jpg',
  },
];
</script>
