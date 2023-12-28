<template>
  <v-tabs class="text-gray-800" :color="color" :direction="direction">
    <v-tab
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      :to="tab.to"
      class="text-body-1 tab"
      exact
      :class="!tab.notification ? 'px-7' : ''"
      rounded="0"
      @click="tab.notification = false"
    >
      <v-icon v-if="tab.icon">{{ tab.icon }}</v-icon>
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
  value: string;
  notification?: boolean;
  icon?: string;
};

const { vertical } = defineProps({
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
});

const direction = vertical ? 'vertical' : 'horizontal';
</script>

<style>
.tab:not(.v-tab--selected):hover {
  background-color: #ebedef !important;
}
</style>
