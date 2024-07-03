<template>
  <div class="d-flex align-center ga-4 py-2">
    <v-avatar
      :size="40"
      :image="imageUrl || undefined"
      class="alex-avatar-group-border alex-avatar-group-margin"
      color="gray-100"
    >
      <template v-if="!imageUrl" #default>
        <p class="text-gray-300 text-body-2">
          {{ getInitials(name) }}
        </p>
      </template>
    </v-avatar>
    <div class="flex-fill">
      <p class="text-body-4 text-gray-900 tw-truncate">{{ name }}</p>
      <p class="text-body-5 text-gray-500 tw-truncate">{{ email }}</p>
    </div>

    <alex-custom-chip
      v-if="inCharge"
      text="Responsável"
      status="primary"
      size="x-small"
    />

    <alex-custom-button
      class="tw-text-red-400"
      icon="mdi-trash-can-outline"
      variant="text"
      size="small"
    />
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  imageUrl?: string;
  name: string;
  email: string;
  inCharge?: boolean;
}

defineProps<CardProps>();
</script>
