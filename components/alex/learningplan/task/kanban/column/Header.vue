<template>
  <div class="pa-4 py-0 rounded-lg border-1 border-gray-100">
    <div class="flex-fill h-0 py-1 rounded-b-lg" :class="selectedColor"></div>
    <div class="d-flex align-center mt-1 py-4 px-0">
      <span class="flex-1-1 text-h5 text-gray-800">{{ title }}</span>
      <span
        class="flex items-center justify-center pt-[1px] bg-gray-100 rounded-lg h-7 w-6"
        >{{ quantity }}</span
      >
    </div>
  </div>
</template>

<script setup lang="ts">
interface ColumnHeader {
  title: string;
  quantity: number;
  color: 'orange' | 'green' | 'blue' | 'gray';
}
const props = defineProps<ColumnHeader>();

const colors = {
  orange: ' bg-warning-0',
  gray: ' bg-gray-300',
  blue: ' bg-info-0',
  green: ' bg-success-0',
};
const selectedColor = computed(() => colors[props.color] || colors.gray);
</script>

<style scoped></style>
