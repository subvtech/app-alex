<template>
  <v-menu :dark="isDarkMode" data-testid="testing-dropdown">
    <template #activator="{ props: propsActivator, isActive }">
      <alex-custom-button
        v-if="!hasActivatorSlot"
        v-bind="propsActivator"
        icon="mdi-dots-vertical"
      />
      <slot
        v-else
        name="activator"
        :props="propsActivator"
        :is-active="isActive"
      />
    </template>

    <v-list
      data-testid="dropdown-content"
      class="pa-0 py-2 rounded-lg my-2"
      :class="{ 'bg-primary-2': isDarkMode, 'bg-white': !isDarkMode }"
    >
      <v-list-item
        v-for="(
          { text, type, icon, link, warning, onClick: onClickItem }, index
        ) in items"
        :key="index"
        class="d-flex pa-2 px-4 text-decoration"
        :min-width="200"
        :class="{
          'v-menu-dark': isDarkMode,
          'v-menu-dark-warning': isDarkMode && warning,
          'v-menu-light': !isDarkMode,
          'v-menu-light-warning': !isDarkMode && warning,
        }"
        :ripple="false"
        @click="onClick(link, onClickItem)"
      >
        <div class="d-flex gap-4 text-body-4 align-center justify-center">
          <v-icon v-if="type === 'text-icon' || icon" :icon="icon" :size="24" />
          <span>{{ text }} </span>
        </div>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
export interface Item {
  type: 'text' | 'text-icon';
  text: string;
  link?: string;
  icon?: string;
  warning?: boolean;
  selected?: boolean;
  onClick?: () => unknown;
}

interface DropdownProps {
  items: Item[];
  isDarkMode?: boolean;
}

withDefaults(defineProps<DropdownProps>(), {
  isDarkMode: false,
  warning: false,
});

const { push } = useRouter();
const slots = useSlots();
const hasActivatorSlot = computed(() => !!slots.activator);
const onClick = (link?: string, onClick?: () => unknown) => {
  if (link) {
    push(link);
  } else if (!link && onClick) {
    onClick();
  }
};
</script>

<style scoped lang="scss">
.hidden {
  visibility: hidden !important;
}

@function map-deep-get($map, $keys...) {
  @each $key in $keys {
    $map: map-get($map, $key);
  }
  @return $map;
}

$variants: (
  dark: (
    background: (
      default: 'primary-2',
      hover: 'primary-1',
      active: 'primary-0',
      selected: 'primary-1',
    ),
    text: (
      default: 'gray-200',
      hover: 'gray-200',
      active: 'gray-200',
      selected: 'gray-200',
      warning: 'error-0',
    ),
  ),
  light: (
    background: (
      default: 'white',
      hover: 'gray-100',
      active: 'gray-200',
      selected: 'gray-blue',
    ),
    text: (
      default: 'gray-600',
      hover: 'gray-900',
      active: 'gray-900',
      selected: 'gray-600',
      warning: 'error-0',
    ),
  ),
);

@each $mode, $value in $variants {
  @each $component, $status in $value {
    .v-menu-#{$mode} {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'default')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'default')})) !important;
    }
    .v-menu-#{$mode}:hover {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'hover')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'hover')})) !important;
    }
    .v-menu-#{$mode}:active {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'active')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'active')})) !important;
    }
    .v-menu-#{$mode}-warning {
      color: rgb(var(--v-theme-#{map-deep-get($status, 'warning')})) !important;
    }
    .v-menu-#{$mode}-warning:hover {
      color: rgb(var(--v-theme-#{map-deep-get($status, 'warning')})) !important;
    }
  }
}
</style>
