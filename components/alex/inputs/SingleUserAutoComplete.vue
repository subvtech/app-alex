<template>
  <alex-inputs-autocomplete
    v-model="selectedUser"
    v-model:search="search"
    item-title="fullname"
    variant="outlined"
    density="comfortable"
    return-object
    :items="items"
    :name="name"
    v-bind="$attrs"
  >
    <template #item="{ props: propsItem, item }">
      <alex-custom-list-item-user
        v-bind="propsItem"
        :user="{
          email: item.raw.email,
          image: item.raw.avatar?.url,
          name: item.raw.fullname,
        }"
        no-checkbox
      />
    </template>
  </alex-inputs-autocomplete>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query';
import { useField } from 'vee-validate';
interface SingleAutocompleteUserProps {
  name: string;
  modelValue: UserSimple | null;
  facilitator?: boolean;
}

const props = withDefaults(defineProps<SingleAutocompleteUserProps>(), {
  facilitator: false,
});
const { find } = useStrapiUtils();
const search = ref('');
const { value: selectedUser } = useField<UserSimple | null>(
  () => props.name,
  undefined,
  {
    initialValue: null,
    syncVModel: true,
  },
);
const { data: items, refetch } = useQuery({
  queryKey: ['single-user-auto-complete'],
  queryFn: async () => {
    const response = await find<UserSimple>('users', {
      filters: {
        ...(props.facilitator && { isProfessor: props.facilitator }),
        $or: [
          { email: { $containsi: search.value } },
          { fullname: { $containsi: search.value } },
        ],
      },
      populate: ['avatar'],
    });
    return response.data;
  },
  initialData: [],
  staleTime: 4 * 1000,
});
useOnStopTyping(search, () => refetch(), 700, true);
</script>
