<template>
    <v-btn-secondary
      v-if="!hasCustomBtn"
      :icon="active.icon"
      :value="active.value"
      @click="onClick"
    />
    <slot
      v-else
      :icon="active.icon"
      :value="active.value"
      :click="onClick"
    >
    </slot>
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
const active = computed(() => props.items.filter((item) => item.value == props.modelValue)[0])

const hasCustomBtn = computed(() => !!slots.default);
const onClick = () => {
  const currentIndex =  props.items.findIndex((item) => item.value === props.modelValue);
  const nextItem =
    currentIndex + 1 > props.items.length - 1 ? props.items[0] : props.items[currentIndex + 1];
  emit('update:modelValue', nextItem.value);
};

</script>

<style scoped></style>
