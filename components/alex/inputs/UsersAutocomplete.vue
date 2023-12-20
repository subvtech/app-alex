<template>
  <alex-inputs-autocomplete
    v-model="value"
    v-model:search="search"
    :item-title="getItemTitle"
    :items="items"
    :name="name"
    v-bind="$attrs"
  >
    <template #item="{ props: propsItem, item, index }">
      <alex-custom-list-item-user
        v-bind="propsItem"
        :key="index"
        :user="{
          email: item.raw.email,
          name: item.raw.fullname,
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
const { find } = useStrapi();
const search = ref('');
const items = ref([]);
useOnStopTyping(search, async () => {
  const registeredFields = await find('users', {
    fields: ['email', 'fullname'],
    filters: {
      $or: [
        { email: { $containsi: search.value } },
        { fullname: { $containsi: search.value } },
      ],
    },
  });
  // findOne retorna o tipo Promise<Strapi4ResponseSingle<F> que tem como atributos data e meta, entretanto no retorno dessa função está vindo um array de objetos apenas. Por isso que temos que tipar dessa forma para que não haja erros
  if ((registeredFields as unknown as []).length > 0) {
    items.value = registeredFields as unknown as [];
  }
});
const getItemTitle = (item: { fullname: string; email: string }) => {
  return `${item.fullname} - ${item.email}`;
};
</script>
