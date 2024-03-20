<template>
  <v-card
    class="d-flex align-center pa-4 justify-space-between bg-white"
    elevation="0"
    variant="outlined"
    color="gray-200"
    :rounded="'lg'"
  >
    <h4 class="text-gray-800 text-h4 w-100 ellipsis lines-1 text-break-all">
      {{ name }}
    </h4>
    <div class="d-flex align-center gap-2 ml-4">
      <v-avatar :size="48" :image="user?.img" color="gray-100">
        <template v-if="!user.img" #default>
          <p class="text-h4 text-gray-600">
            {{ getInitials(user.name) }}
          </p>
        </template>
      </v-avatar>
      <p
        class="text-body-2 text-gray-600 user-name ellipsis lines-1 text-break-al"
      >
        {{ user.name }}
      </p>
    </div>
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
  </v-card>
</template>

<script setup lang="ts">
type CreationCardProps = {
  name: string;
  user: {
    img?: string;
    name: string;
  };
};
withDefaults(defineProps<CreationCardProps>(), {});
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
.user-name {
  width: max-content;
  max-width: 185px;
}
</style>
