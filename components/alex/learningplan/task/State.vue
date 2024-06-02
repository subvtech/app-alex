<template>
  <v-menu :disabled="!edit">
    <!-- Chip de exibição -->
    <template #activator="{ props }">
      <alex-custom-chip
        v-bind="props"
        :text="items[model].title"
        :status="items[model].variant"
        :prepend-icon="edit ? 'mdi-chevron-down' : ''"
        :clickable="edit"
        variant="tonal"
        size="x-small"
      />
    </template>

    <!-- Opções -->
    <v-list>
      <v-list-item
        v-for="(data, status) in items"
        :key="status"
        :value="status"
      >
        <v-list-item-title @click="model = status">{{
          data.title
        }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
type TaskStatus = 'draft' | 'published' | 'closed';

interface ItemProps {
  title: string;
  variant: 'secondary' | 'blue' | 'red' | 'orange';
}
const model = defineModel<string>({ required: true });

interface StateProps {
  edit?: boolean;
  items: Record<TaskStatus, ItemProps>;
}

defineProps<StateProps>();
</script>
