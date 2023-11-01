<template>
  <v-tabs class="text-gray-800" color="accent">
    <v-tab
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="text-body-1 tab"
      :class="!tab.notification ? 'px-7' : ''"
      >{{ tab.label }}
      <v-icon
        v-if="tab.notification"
        class="ml-1 mt-1"
        icon="mdi-circle-medium"
        color="accent"
      />
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
defineProps({
  tabs: {
    type: Array as PropType<
      { label: string; value: string; notification?: boolean }[]
    >,
    default: () => [{}],
  },
});
</script>

<style>
.tab:not(.v-tab--selected):hover {
  background-color: #ebedef !important;
}
</style>
