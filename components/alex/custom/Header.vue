<template>
  <div
    class="header d-flex align-center w-full"
    style="height: 44px; justify-content: space-between"
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
        @click="() => emits('secondary-action')"
      >
        {{ secondaryButtonText }}
      </alex-custom-button>
      <alex-custom-button
        v-if="hasMainButton"
        variant="primary"
        :prepend-icon="mainButtonIcon"
        @click="() => emits('main-action')"
      >
        {{ mainButtonText }}
      </alex-custom-button>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: 'Page Title',
  },
  hasMainButton: {
    type: Boolean,
    default: false,
  },
  hasSecondaryButton: {
    type: Boolean,
    default: false,
  },
  mainButtonText: {
    type: String,
    default: 'Main Button',
  },
  mainButtonIcon: {
    type: String,
    default: null,
  },
  secondaryButtonIcon: {
    type: String,
    default: null,
  },
  secondaryButtonText: {
    type: String,
    default: 'Secondary Button',
  },
  noBackArrow: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array as PropType<
      { title: string; disabled: boolean; href: string }[]
    >,
    default: () => [],
  },
});

const emits = defineEmits(['main-action', 'secondary-action']);
</script>
<style scoped lang="scss">
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
