<template>
  <div
    v-if="!loading"
    class="header d-flex align-center w-full height-11 justify-space-between"
    data-testid="header"
    role="heading"
    :aria-label="title"
  >
    <div
      class="d-flex grow align-center"
      role="navigation"
      aria-label="Page Breadcrumb"
    >
      <div class="header__breadcrumb">
        <alex-custom-breadcrumbs
          :title="title"
          :items="items"
          :arrow-back="!noBackArrow"
        />
      </div>
    </div>
    <div class="header__button d-flex">
      <alex-custom-button
        v-if="hasSecondaryButton"
        variant="tertiary"
        :prepend-icon="secondaryButtonIcon"
        class="mr-2"
        :size="buttonSize"
        @click="() => emits('secondary-action')"
      >
        {{ secondaryButtonText }}
      </alex-custom-button>
      <alex-custom-button
        v-if="hasMainButton"
        variant="primary"
        :prepend-icon="mainButtonIcon"
        :size="buttonSize"
        @click="() => emits('main-action')"
      >
        {{ mainButtonText }}
      </alex-custom-button>
    </div>
  </div>
  <div v-else class="d-flex gap-4 align-center height-11">
    <alex-custom-skeleton class="width-40 height-8" color="gray-200" />
    <alex-custom-skeleton
      class="width-1 height-8"
      color="gray-200"
      rounded="sm"
    />
    <div class="w-full d-flex gap-2 align-center">
      <alex-custom-skeleton class="width-20 height-8" color="gray-200" />
      <p class="text-gray-200">{{ '>' }}</p>
      <alex-custom-skeleton class="width-12 height-8" color="gray-200" />
      <p class="text-gray-200">{{ '>' }}</p>
      <alex-custom-skeleton class="width-24 height-8" color="gray-200" />
    </div>
  </div>
</template>
<script setup lang="ts">
interface itemType {
  title: string;
  disabled?: boolean;
  to?: string;
}

export interface HeaderComponentType {
  title?: string;
  hasMainButton?: boolean;
  hasSecondaryButton?: boolean;
  mainButtonText?: string;
  mainButtonIcon?: string;
  buttonSize?: 'default' | 'large' | 'small';
  secondaryButtonIcon?: string;
  secondaryButtonText?: string;
  noBackArrow: boolean;
  loading?: boolean;
  items: itemType[];
}

withDefaults(defineProps<HeaderComponentType>(), {
  title: 'Page Title',
  hasMainButton: false,
  hasSecondaryButton: false,
  mainButtonText: 'Main Button',
  mainButtonIcon: undefined,
  buttonSize: 'default',
  secondaryButtonIcon: undefined,
  secondaryButtonText: 'Secondary Button',
  noBackArrow: false,
  items: () => [],
  loading: false,
});

const emits = defineEmits(['main-action', 'secondary-action']);
</script>
<style scoped lang="scss">
.width-1 {
  width: 4px;
}
.button {
  font-size: 14px;
  font-weight: 700;
  text-transform: none;
}

.terciary {
  color: #6e7a87 !important;
  background-color: #ebedef !important;
}

.divider {
  align-self: center !important;
  height: 24px;
}

.header__arrow {
  margin-right: 16px;
}
</style>
