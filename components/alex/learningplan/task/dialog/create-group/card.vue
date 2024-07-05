<template>
  <div class="group_card d-flex align-center ga-4 py-2">
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

    <template v-if="anotherGroup !== undefined">
      <alex-custom-chip
        v-if="anotherGroup"
        color="orange"
        variant="text"
        icon="mdi-alert-circle-outline"
        size="small"
        :title="
          $t('components.learningPlan.drawer.task.dialog.message.onGroup')
        "
      />
    </template>

    <template v-if="!hideDetails"
      ><alex-custom-chip
        v-if="inCharge"
        :text="$t('components.learningPlan.drawer.task.dialog.responsible')"
        status="primary"
        size="x-small" />

      <alex-custom-button
        :class="iconColor ? `${iconColor}_icon` : ''"
        icon="mdi-trash-can-outline"
        variant="text"
        size="small"
        @click="emit('click:remove', name)"
    /></template>
  </div>
</template>

<script setup lang="ts">
interface CardProps {
  imageUrl?: string;
  name: string;
  email: string;
  inCharge?: boolean;
  hideDetails?: boolean;
  iconColor?: 'red' | undefined;
  anotherGroup?: boolean;
}

defineProps<CardProps>();

type Emit = {
  'click:remove': [name: string];
};

const emit = defineEmits<Emit>();
</script>

<style>
.group_card .red_icon i::before {
  color: red;
}
</style>
