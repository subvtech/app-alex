<template>
  <div>
    <Dropdown :items="items1" :options="options1" />
    <Dropdown :items="items2" :options="options1" />
    <Dropdown :items="items3" :options="options2" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Dropdown from '@/components/alex/inputs/Dropdown.vue';

const items1 = ref([
  {
    id: 1,
    type: 'icon',
    icon: 'mdi-home',
    text: 'Início',
  },
  {
    id: 2,
    type: 'icon',
    icon: 'mdi-account-circle',
    text: 'Perfil',
  },
  {
    id: 3,
    type: 'icon',
    icon: 'mdi-account',
    text: 'Configurações',
  },
]);

const items2 = ref([
  {
    id: 1,
    type: 'icon',
    icon: 'mdi-lock',
    text: 'Bloquear',
  },
  {
    id: 2,
    type: 'icon',
    icon: 'mdi-pencil',
    text: 'Editar',
  },
  {
    id: 3,
    type: 'icon',
    icon: 'mdi-check-decagram-outline',
    text: 'Verificar',
  },
  {
    id: 4,
    type: 'icon',
    icon: 'mdi-delete',
    text: 'Excluir',
    class: 'warning',
  },
]);

const items3 = ref([
  {
    id: 1,
    type: 'checkbox',
    text: 'Opção 1',
  },
  {
    id: 2,
    type: 'checkbox',
    text: 'Opção 2',
  },
  {
    id: 3,
    type: 'checkbox',
    text: 'Opção 3',
  },
]);

const options1 = ref({
  openOnClick: true,
  openOnHover: true,
  closeOnContentClick: true,
  location: 'end',
  isDarkMode: false,
});

const options2 = ref({
  openOnClick: true,
  openOnHover: false,
  closeOnContentClick: true,
  location: 'start',
  isDarkMode: true,
});
</script>
