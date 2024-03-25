<template>
  <v-tabs
    class="text-gray-800 w-100"
    :color="color"
    :direction="direction"
    :loading="loading"
    :show-arrows="showArrows"
  >
    <v-tab
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :to="tab.to"
      :class="[!tab.notification ? 'px-4' : '', tab.classes]"
      :ripple="false"
      :disabled="tab.disabled"
      class="text-body-1 tab"
      :exact="exact"
      @click="tab.notification = false"
    >
      <v-icon v-if="tab.icon" size="large">{{ tab.icon }}</v-icon>
      <span v-else>{{ tab.label }}</span>
      <v-icon
        v-if="tab.notification"
        class="ml-1 mt-1"
        icon="mdi-circle-medium"
        :color="color"
      />
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
export type TabType = {
  label: string;
  to?: string;
  value: string | number;
  notification?: boolean;
  icon?: string;
  disabled?: boolean;
  classes?: string;
  exact?: boolean;
};

const props = defineProps({
  tabs: {
    type: Array as PropType<TabType[]>,
    default: () => [{}],
  },
  color: {
    type: String,
    default: 'accent',
  },
  vertical: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  showArrows: {
    type: Boolean,
    default: false,
  },
  exact: {
    type: Boolean,
    default: true,
  },
});

const direction = computed(() => (props.vertical ? 'vertical' : 'horizontal'));
</script>

<style>
.tab:not(.v-tab--selected):hover {
  background-color: #ebedef !important;
}
.v-tab__slider {
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
}
</style>
