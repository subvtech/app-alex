<template>
  <v-btn-secondary
    v-if="!hasCustomBtn"
    :icon="activeItem.icon"
    :value="activeItem.value"
    @click="onClick"
  />
  <slot
    v-else
    :icon="activeItem.icon"
    :value="activeItem.value"
    :click="onClick"
  />
</template>

<script setup lang="ts">
interface item {
  icon: string;
  value: string | number | boolean;
}
const props = defineProps<{
  modelValue: string | number | boolean;
  items: item[];
}>();
const emit = defineEmits(['update:modelValue']);
const slots = useSlots();
const activeItem = computed(
  () => props.items.filter((item) => item.value == props.modelValue)[0],
);
const hasCustomBtn = computed(() => !!slots.default);
const activeItemIndex = computed(() =>
  props.items.findIndex((item) => item.value === props.modelValue),
);
const onClick = () => {
  const nextItemIndex = activeItemIndex.value + 1;
  const maxItemIndex = props.items.length - 1;
  const nextItem =
    nextItemIndex > maxItemIndex ? props.items[0] : props.items[nextItemIndex];
  emit('update:modelValue', nextItem.value);
};
</script>