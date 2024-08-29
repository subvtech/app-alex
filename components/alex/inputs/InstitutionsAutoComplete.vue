<template>
  <alex-inputs-autocomplete
    v-model="selectedInstitution"
    v-model:search="search"
    item-title="name"
    variant="outlined"
    density="comfortable"
    return-object
    :items="items"
    :name="name"
    v-bind="$attrs"
  >
    <template #item="{ props: propsItem, item }">
      <alex-custom-list-item
        v-bind="propsItem"
        :text="`${item.raw.acronym} - ${item.raw.name}`"
        no-checkbox
      />
    </template>
  </alex-inputs-autocomplete>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useField } from 'vee-validate';
interface InstitutionAutocompleteProps {
  name: string;
  modelValue: Institution | null;
}

const props = withDefaults(defineProps<InstitutionAutocompleteProps>(), {});
const { find } = useStrapiUtils();
const search = ref('');
const { value: selectedInstitution } = useField<Institution | null>(
  () => props.name,
  undefined,
  {
    initialValue: null,
    syncVModel: true,
  },
);
const { data: items, refetch } = useQuery({
  queryKey: [`institutions-auto-complete-${props.name}`],
  queryFn: async () => {
    const response = await find<Institution>('institutions');
    return response.data;
  },
  initialData: [],
  staleTime: 4 * 1000,
});
useOnStopTyping(search, () => refetch(), 700, true);
</script>
