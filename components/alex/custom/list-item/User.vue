<template>
  <v-list-item
    v-bind="$attrs"
    class="alex-list-item-user"
    :class="{
      'no-select': noSelect,
    }"
    :ripple="false"
    :disabled="status === 'participating'"
  >
    <template #prepend="{ isSelected }">
      <alex-inputs-checkbox
        v-if="!noSelect && status !== 'participating'"
        :model-value="isSelected"
        class="checkbox"
      />
      <v-avatar
        :size="40"
        :image="user?.image"
        class="alex-avatar-group-border alex-avatar-group-margin"
        color="gray-100"
      >
        <template v-if="!user?.image" #default>
          <p class="text-gray-300 text-body-2">
            {{ initials }}
          </p>
        </template>
      </v-avatar></template
    >
    <template #append
      ><alex-custom-chip
        v-if="status === 'participating'"
        text="Participando"
        status="success"
        size="small"
      />
      <p
        v-if="noSelect && status !== 'participating'"
        class="text-body-6 text-gray-300"
      >
        {{ status }}
      </p>
      <alex-custom-button
        v-if="noSelect && status !== 'participating'"
        icon="mdi-trash-can-outline"
        variant="text"
        color="error-0"
      />
    </template>
    <template #title
      ><p class="text-body-4 text-gray-900">{{ user.name }}</p></template
    >
    <template #subtitle
      ><p class="text-body-5 text-gray-500">{{ user.email }}</p></template
    >
  </v-list-item>
</template>

<script setup lang="ts">
interface AlexListItemUser {
  user: {
    name: string;
    email: string;
    image?: string;
  };
  noSelect?: boolean;
  status?: 'readyToSend' | 'pending' | 'participating';
}

defineEmits(['update:modelValue', 'delete']);
const props = withDefaults(defineProps<AlexListItemUser>(), {
  participating: false,
  noSelect: false,
  noDelete: false,
  status: 'readyToSend',
});

const initials = computed(() => {
  if (!props.user.image) return 'MN';
  return getInitials(props.user.name);
});
</script>

<style lang="scss">
.alex-list-item-user {
  padding: 8px 16px !important;
  grid-template-columns: auto 1fr auto;
  padding: 4px 16px;
  column-gap: 16px;
  margin-bottom: 2px !important;
  &:not(.no-select):hover {
    background-color: rgb(var(--v-theme-gray-100)) !important;
  }
  &:not(.no-select):active {
    background-color: rgb(var(--v-theme-gray-200)) !important;
  }

  .v-list-item__prepend {
    display: flex;
    width: min-content;
    justify-content: flex-start;
    align-items: center;
  }
  .v-list-item__append {
    display: flex;
    gap: 16px;
  }
  .checkbox input,
  .checkbox .v-selection-control__input,
  .checkbox .v-selection-control__wrapper {
    height: 30px !important;
    width: 30px !important;
  }

  .checkbox,
  .checkbox .v-input,
  .checkbox .v-input__control,
  .checkbox .v-selection-control {
    height: 30px !important;
    width: 30px !important;
    min-height: 33px;
    justify-content: center;
    margin-bottom: 0 !important;
    margin-top: 1px !important;
  }
  .checkbox {
    margin-right: 12px;
  }
  .none-events {
    pointer-events: none;
    user-select: none;
  }
  &.v-list-item--disabled {
    opacity: 1 !important;
  }
}
</style>
