<template>
  <v-list-item
    class="alex-list-item-user"
    :class="{
      'no-select': removeSelection,
    }"
    :ripple="false"
    :disabled="selected"
    v-bind="$attrs"
  >
    <template #prepend="{ isSelected }">
      <div class="d-flex gap-4">
        <alex-inputs-checkbox
          v-if="!noCheckbox && !removeSelection"
          :model-value="isSelected"
          :disabled="selected"
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
        </v-avatar>
      </div></template
    >
    <template #append
      ><alex-custom-chip
        v-if="!noChip && !hasChip && selected"
        :text="$t('pages.classes.participating')"
        status="green"
        size="small"
      />
      <slot name="chip" />
      <template v-if="removeSelection">
        <alex-custom-button
          v-if="!noSecondButton && !hasSecondButton"
          icon="mdi-cached"
          variant="text"
          :loading="loadingSecondButton"
          @click="$emit('secondButtonAction')"
        />
        <slot
          name="secondButton"
          :click="() => $emit('secondButtonAction')"
          :loading="loadingSecondButton"
        />
        <alex-custom-button
          v-if="!noDelete"
          icon="mdi-trash-can-outline"
          variant="text"
          color="error-0"
          :loading="loadingDelete"
          @click="$emit('delete')"
        />
      </template>
    </template>
    <template #title
      ><p
        v-if="!user.name"
        class="text-body-4 text-gray-900 ellipsis lines-1 overflow-x-hidden"
      >
        {{ user.email }}
      </p>
      <p
        v-else
        class="text-body-4 text-gray-900 ellipsis lines-1 overflow-x-hidden"
      >
        {{ user.name }}
      </p></template
    >
    <template v-if="user.name" #subtitle
      ><p class="text-body-5 text-gray-500 ellipsis lines-1 overflow-x-hidden">
        {{ user?.email }}
      </p></template
    >
  </v-list-item>
</template>

<script setup lang="ts">
interface AlexListItemUser {
  user: {
    email: string;
    name?: string;
    image?: string;
  };
  loadingDelete?: boolean;
  loadingSecondButton?: boolean;
  removeSelection?: boolean;
  noDelete?: boolean;
  noChip?: boolean;
  selected?: boolean;
  noCheckbox?: boolean;
  noSecondButton?: boolean;
}

defineEmits(['delete', 'secondButtonAction']);
const props = withDefaults(defineProps<AlexListItemUser>(), {
  participating: false,
  noSelect: false,
  noDelete: false,
  noCheckbox: false,
  noSecondButton: true,
  noChip: false,
  selected: false,
  noReload: false,
  loadingDelete: false,
  loadingSecondButton: false,
});
const initials = computed(() => {
  return getInitials(props.user?.name || props.user.email);
});
const slots = useSlots();
const hasChip = computed(() => !!slots.chip);
const hasSecondButton = computed(() => !!slots.secondButton);
</script>

<style lang="scss">
.alex-list-item-user {
  padding: 8px 16px !important;
  grid-template-columns: min-content 1fr min-content;
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

  .none-events {
    pointer-events: none;
    user-select: none;
  }
  &.v-list-item--disabled {
    opacity: 1 !important;
  }
  & .v-list-item__prepend {
    display: grid;
    column-gap: 8px;
    grid-template-columns: auto;
    max-width: fit-content !important;
  }
  &.no-select .v-list-item__prepend.v-list-item__prepend {
    grid-template-columns: auto;
  }
}

@media screen and (max-width: 599px) {
  .alex-list-item-user.no-select {
    padding: 8px 0px !important;
  }
}
</style>
