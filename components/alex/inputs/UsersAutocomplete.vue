<template>
  <alex-inputs-autocomplete
    v-model="value"
    v-model:search="search"
    :item-title="getItemTitle"
    :name="name"
    v-bind="$attrs"
  >
    <template #item="{ props: propsItem, item, index }">
      <alex-custom-list-item-user
        v-bind="propsItem"
        :key="index"
        :user="{
          email: item.raw.email,
          name: item.raw.name,
          image: item.raw.image,
        }"
        :status="item.raw.status"
        no-delete
      />
    </template>
  </alex-inputs-autocomplete>
</template>

<script setup lang="ts">
interface AutoCompleteUsersProps {
  name: string;
  modelValue?: string;
}

const props = withDefaults(defineProps<AutoCompleteUsersProps>(), {
  modelValue: undefined,
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const search = ref('');

useOnStopTyping(search, async () => await console.log(search.value));
const getItemTitle = (item: { name: string; email: string }) => {
  return `${item.name} - ${item.email}`;
};
</script>
