<template>
  <v-card
    class="grid pa-4 bg-white"
    elevation="0"
    variant="outlined"
    color="gray-200"
    rounded="lg"
  >
    <h4 class="text-gray-800 text-h4 ellipsis lines-1 text-break-all min-w-64">
      {{ name }}
    </h4>
    <div class="d-flex align-center justify-end gap-2 ml-4">
      <v-avatar :size="48" :image="user?.img" color="gray-100">
        <template v-if="!user.img" #default>
          <p class="text-h4 text-gray-600">
            {{ getInitials(user.name) }}
          </p>
        </template>
      </v-avatar>
      <p
        v-if="!mobile"
        class="text-body-2 text-gray-600 user-name ellipsis lines-1 text-break-all user-name"
      >
        {{ user.name }}
      </p>
      <alex-custom-dropdown :items="dropdownProps">
        <template #activator="{ props: activeProps }">
          <alex-custom-button
            v-bind="activeProps"
            class="ml-4"
            size="small"
            icon="mdi-dots-vertical"
            variant="text"
          />
        </template>
      </alex-custom-dropdown>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify/lib/framework.mjs';

type CreationCardProps = {
  name: string;
  user: {
    img?: string;
    name: string;
  };
};
withDefaults(defineProps<CreationCardProps>(), {});
const { mobile } = useDisplay({ mobileBreakpoint: 600 });
const emit = defineEmits(['edit', 'delete']);
const dropdownProps = [
  {
    icon: 'mdi-pencil',
    text: 'Editar', // t('components.courses.meeting.edit'),
    onClick: () => emit('edit'),
  },
  {
    icon: 'mdi-trash-can',
    text: 'Excluir', // t('components.courses.meeting.delete'),
    warning: true,
    onClick: () => emit('delete'),
  },
];
</script>

<style lang="scss" scoped>
.min-w-64 {
  min-width: 64px;
}
.user-name {
  min-width: 60px;
}
.grid {
  display: grid;
  grid-template-columns: 3fr auto;
  grid-template-rows: 1fr;
  align-items: center;
}
</style>
