<template>
  <div>
    <alex-inputs-autocomplete
      v-model="value"
      v-model:search="search"
      item-value="id"
      item-title="email"
      variant="outlined"
      :items="items"
      :custom-filter="filterByFullnameAndEmail"
      :name="name"
      v-bind="$attrs"
      :no-data-text="$t('components.usersAutocomplete.searchUserToCourse')"
      @update:model-value="(value) => updateModelValue(value)"
    >
      <template #item="{ props: propsItem, item, index }">
        <alex-custom-list-item-user
          v-bind="propsItem"
          :key="index"
          :user="{
            email: item.raw.email,
            name: item.raw.fullname,
          }"
          no-delete
          @click="
            () => {
              search = '';
              setState({ value: null });
            }
          "
        />
      </template>
    </alex-inputs-autocomplete>
    <div v-if="selectedItems.length">
      <alex-custom-list-item-user
        v-for="item in selectedItems"
        :key="item.id"
        :user="{
          email: item.email,
          name: item.fullname,
        }"
        no-delete
        no-select
        @delete="() => removeSelf(item.id)"
        @reload="() => emit('refresh:invite')"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
type User = { id?: string; email: string; fullname?: string };

interface AutoCompleteUsersProps {
  name: string;
  selectedItems: User[];
}

const props = defineProps<AutoCompleteUsersProps>();

const emit = defineEmits([
  'update:selectedItems',
  'refresh:invite',
  'remove:invite',
]);
const { find } = useStrapi();
const { emailRegex } = useFormRules();
const { value, setState } = useField<User | null>(() => props.name, undefined);
const search = ref('');
const items = ref<User[]>([]);
const selectedItems = computed({
  get() {
    return props.selectedItems;
  },
  set(value) {
    emit('update:selectedItems', value);
  },
});

const removeSelf = (id?: string) => {
  selectedItems.value = selectedItems.value.filter((item) => item.id !== id);
  emit('remove:invite');
};

const updateModelValue = (user?: User | null) => {
  const selectedItem = items.value.find((item) => item.id === user?.id);
  const alreadyInList = selectedItems.value.find(
    (item) => item.id === user?.id,
  );
  if (selectedItem && !alreadyInList) {
    emit('update:selectedItems', [...selectedItems.value, selectedItem]);
    items.value = [
      ...items.value.filter((item) => item.id !== selectedItem.id),
    ];
    setState({ value: null });
    search.value = '';
  }
};

useOnStopTyping(search, async () => {
  const registeredFields = (await find('users', {
    fields: ['email', 'fullname'],
    filters: {
      $or: [
        { email: { $containsi: search.value } },
        { fullname: { $containsi: search.value } },
      ],
    },
  })) as unknown as User[];
  if (registeredFields.length) {
    items.value = registeredFields.filter(
      (itemRequest) =>
        !selectedItems.value.find((item) => item.id === itemRequest?.id),
    );
  }
});

const filterByFullnameAndEmail = (
  _value: string,
  query: string,
  item?: any,
) => {
  const fullname = item.raw.fullname?.toLowerCase() || '';
  const email = item.raw.email?.toLowerCase();
  const searchText = query.toLowerCase();

  return fullname.includes(searchText) > -1 || email.includes(searchText) > -1;
};

watch(search, () => {
  const isValidEmail = emailRegex.test(search.value);
  const hasEmail = items.value.filter(
    (item) => !item.fullname && item.email,
  ).length;
  if (!isValidEmail) {
    items.value.filter((item) => item.email === search.value && !item.fullname);
    return;
  }
  if (!hasEmail) {
    items.value = [{ email: search.value }, ...items.value];
  } else {
    items.value.splice(0, 1, { email: search.value });
  }
});
</script>
