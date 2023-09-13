<template>
  <template v-for="{ icon, value: itemValue } in items" :key="itemValue">
    <slot
      v-if="itemValue == modelValue"
      :icon="icon"
      :value="itemValue"
      :click="() => onClick(itemValue, items)"
    >
    </slot>
  </template>
</template>

<script setup lang="ts">
interface item {
  icon: string;
  value: string | number;
}
defineProps<{
  modelValue: string | number;
  items: item[];
}>();
const emit = defineEmits(['update:modelValue']);

const onClick = (value: string | number, list: item[]) => {
  const currentIndex = list.findIndex((item) => item.value === value);
  const nextItem =
    currentIndex + 1 > list.length - 1 ? list[0] : list[currentIndex + 1];
  emit('update:modelValue', nextItem.value);
};
</script>

<style scoped></style>
