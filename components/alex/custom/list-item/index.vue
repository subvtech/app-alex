<template>
  <v-list-item
    class="d-flex pa-2 px-4 text-decoration"
    :min-width="200"
    :class="{
      'v-list-item-dark': isDarkMode,
      'v-list-item-dark-warning': isDarkMode && warning,
      'v-list-item-light': !isDarkMode,
      'v-list-item-light-warning': !isDarkMode && warning,
    }"
    :ripple="false"
    @click="onClick(link, emit('click'))"
  >
    <div class="d-flex gap-4 text-body-4 align-center justify-center">
      <v-icon
        v-if="icon"
        data-testid="testint-dropdown-item-icon"
        :icon="icon"
        :size="24"
      />
      <span>{{ text }} </span>
    </div>
  </v-list-item>
</template>

<script setup lang="ts">
export interface AlexListItem {
  text: string;
  icon?: string;
  warning?: boolean;
  selected?: boolean;
  link?: string;
  theme?: 'light' | 'dark';
}
const props = withDefaults(defineProps<AlexListItem>(), {
  icon: undefined,
  link: undefined,
  checkbox: false,
  selected: false,
  theme: 'light',
});
const emit = defineEmits(['click']);
const { push } = useRouter();
const isDarkMode = computed(() => props.theme === 'dark');
const onClick = (link?: string, onClick?: () => unknown) => {
  if (link) {
    push(link);
  } else if (onClick) {
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
    .v-list-item-#{$mode} {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'default')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'default')})) !important;
    }
    .v-list-item-#{$mode}:hover {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'hover')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'hover')})) !important;
    }
    .v-list-item-#{$mode}:active {
      @if $component == 'background' {
        background-color: rgb(
          var(--v-theme-#{map-deep-get($status, 'active')})
        ) !important;
      }
      color: rgb(var(--v-theme-#{map-deep-get($status, 'active')})) !important;
    }
    .v-list-item-#{$mode}-warning {
      color: rgb(var(--v-theme-#{map-deep-get($status, 'warning')})) !important;
    }
    .v-list-item-#{$mode}-warning:hover {
      color: rgb(var(--v-theme-#{map-deep-get($status, 'warning')})) !important;
    }
  }
}
</style>
