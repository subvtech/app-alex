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
      :show-submit-button="showSubmitButton"
      :submit-button-text="submitButtonText"
      :submit-button-loading="submitButtonLoading"
      v-bind="$attrs"
      @click:button="emit('click:button')"
    >
      <template #item="{ props: propsItem, item, index }">
        <alex-custom-list-item-user
          v-bind="propsItem"
          :key="index"
          :user="{
            email: item.raw.email,
            name: item.raw.fullname,
            image: item.raw.avatar?.formats?.small?.url || item.raw.avatar?.url,
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
          image: item.avatar?.formats?.small?.url || item.avatar?.url,
        }"
        remove-selection
        @delete="() => removeSelf(item.email)"
        @reload="() => emit('refresh:invite')"
      />
    </v-slide-y-transition>
  </div>
</template>

<script setup lang="ts">
import { useField } from 'vee-validate';
export type User = {
  id?: string;
  email: string;
  fullname?: string;
  local?: boolean;
  avatar?: { url: string; formats?: { small: { url: string } } } | null;
};
interface AutoCompleteUsersProps {
  name: string;
  modelValue: User[];
  ignoreUserIds?: number[];
  ignoreEmails?: string[];
  submitButtonText?: string;
  showSubmitButton?: boolean;
  submitButtonLoading?: boolean;
}
const props = defineProps<AutoCompleteUsersProps>();
const emit = defineEmits([
  'update:modelValue',
  'refresh:invite',
  'remove:invite',
  'click:button',
]);
const { find } = useStrapi();
const { emailRegex } = useFormRules();
const user = useStrapiUser();
const { value: selectedUser, resetField } = useField<User | null>(
  () => props.name,
  undefined,
  {
    initialValue: null,
  },
);
const search = ref('');
const items = ref<User[]>([]);
const selectedUsers = defineModel<User[]>({ required: true });
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
  const wasNotSelectedUser = !selectedUsers.value.find(
    (v) => v.email === selectedUser.value?.email,
  );
  if (selectedUser.value && wasNotSelectedUser) {
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
    populate: ['avatar'],
  })) as unknown as User[];
  if (registeredFields.length) {
    items.value = registeredFields.filter(
      (itemRequest) =>
        !selectedUsers.value.find((item) => item.id === itemRequest?.id) &&
        itemRequest.email !== user.value?.email,
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
