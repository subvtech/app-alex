<template>
  <v-tabs class="text-gray-800" :color="color" :direction="direction">
    <v-tab
      v-for="tab in tabs"
      :key="tab.value"
      :value="tab.value"
      class="text-body-1 tab"
      :class="!tab.notification ? 'px-7' : ''"
      @click="tab.notification = false"
      >{{ tab.label }}
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
defineProps({
  tabs: {
    type: Array as PropType<
      { label: string; value: string; notification?: boolean }[]
    >,
    default: () => [{}],
  },
  color: {
    type: String,
    default: 'accent',
  },
  direction: {
    type: String as PropType<'horizontal' | 'vertical'>,
    default: 'horizontal',
  },
});
</script>

<style>
.tab:not(.v-tab--selected):hover {
  background-color: #ebedef !important;
}
</style>
