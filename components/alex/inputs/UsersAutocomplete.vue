<template>
  <div>
    <alex-inputs-autocomplete
      v-model="selectedUser"
      v-model:search="search"
      item-title="email"
      variant="outlined"
      density="comfortable"
      return-object
      :items="filteredItems"
      :custom-filter="filterByFullnameAndEmail"
      :name="name"
      v-bind="$attrs"
      :no-data-text="$t('components.usersAutocomplete.searchUserToCourse')"
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
          no-checkbox
        />
      </template>
    </alex-inputs-autocomplete>

    <v-slide-y-transition group>
      <alex-custom-list-item-user
        v-for="item in selectedUsers"
        :key="`user-${item.id}`"
        :user="{
          email: item.email,
          name: item.fullname,
        }"
        remove-selection
        @delete="() => removeSelf(item.email)"
        @reload="() => emit('refresh:invite')"
      />
    </v-slide-y-transition>
  </div>
</template>

<script setup lang="ts">
import { verify } from 'crypto';
import { useField } from 'vee-validate';
type User = { id?: string; email: string; fullname?: string; local?: boolean };

interface AutoCompleteUsersProps {
  name: string;
  modelValue: User[];
  ignoreUserIds?: number[];
  ignoreEmails?: string[];
}

const props = defineProps<AutoCompleteUsersProps>();

const emit = defineEmits([
  'update:modelValue',
  'refresh:invite',
  'remove:invite',
]);
const { find } = useStrapi();
const { emailRegex } = useFormRules();
const user = useStrapiUser().value;
const { value: selectedUser, resetField } = useField<User | null>(
  () => props.name,
  undefined,
  {
    initialValue: null,
  },
);
const search = ref('');
const items = ref<User[]>([]);

const selectedUsers = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit('update:modelValue', value);
  },
});

const cleanInput = () => {
  search.value = '';

  resetField();
};

const removeSelf = (email?: string) => {
  selectedUsers.value = selectedUsers.value.filter(
    (item) => item.email !== email,
  );
  emit('remove:invite');
};

const filteredItems = computed(() => {
  const idSelectedUsers = selectedUsers.value.map((user) => user.email);
  return items.value.filter((item) => !idSelectedUsers.includes(item.email));
});

const updateModelValue = () => {
  if (
    selectedUser.value &&
    !selectedUsers.value.find((v) => v.email === selectedUser.value?.email)
  ) {
    selectedUsers.value.push(selectedUser.value);
  }
  cleanInput();
};

useOnStopTyping(search, async () => {
  const registeredFields = (await find('users', {
    fields: ['email', 'fullname'],
    filters: {
      $or: [
        { email: { $containsi: search.value } },
        { fullname: { $containsi: search.value } },
      ],
      id: { $notIn: props.ignoreUserIds || [] },
    },
  })) as unknown as User[];
  if (registeredFields.length) {
    items.value = registeredFields.filter(
      (itemRequest) =>
        !selectedUsers.value.find((item) => item.id === itemRequest?.id) &&
        itemRequest.email !== user?.email,
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

watch(
  search,
  () => {
    const isValidEmail = emailRegex.test(search.value);
    const local = items.value.filter((item) => item?.local);
    if (
      search.value.length &&
      isValidEmail &&
      !(props.ignoreEmails || []).includes(search.value)
    ) {
      if (!local.length) {
        items.value = [{ email: search.value, local: true }, ...items.value];
      }
      items.value = items.value.map((item) => {
        if (item.local) {
          return { ...item, email: search.value, local: true };
        }
        return item;
      });
    }
  },
  { deep: true },
);

watch(selectedUser, updateModelValue);
</script>
