<template>
  <v-autocomplete
    v-model="selectedUsers"
    :items="users"
    :loading="loadingUsers"
    label="Adicionar Colaboradores"
    prepend-inner-icon="mdi-plus-circle"
    append-icon="mdi-magnify"
    outlined
    dense
    chips
    multiple
    hide-no-data
    hide-selected
    cache-items
    item-value="id"
    :item-text="(item) => `${item.fullname} ${item.email}`"
    :search-input.sync="search"
    :reverse="false"
    small-chips
    @input="onInput"
  >
    <template #selection="data">
      <v-chip
        v-bind="data.item.raw.attributes"
        :input-value="data.selected"
        close
        small
        @click="data.select"
        @click:close="remove(data.item)"
      >
        <v-avatar left>
          <v-img v-if="data.item.raw.attributes.avatar" :src="data.item.raw.attributes.avatar.url"></v-img>
          <v-img v-else src="/images/not-found.png"></v-img>
        </v-avatar>
        {{ getReducedName(data.item.raw.attributes.fullname) }}
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-avatar>
        <img v-if="data.item.raw.attributes.avatar" :src="data.item.raw.attributes.avatar.url" />
        <img v-else src="/images/not-found.png" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ data.item.raw.attributes.fullname }} </v-list-item-title>
        <v-list-item-subtitle> {{ data.item.raw.attributes.email }} </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script setup lang="ts">
import { Strapi4ResponseData } from '@nuxtjs/strapi/dist/runtime/types';
import { User } from 'models/user.model';
import { stringify } from 'qs';
const user = useStrapiUser();
const { find } = useStrapi();

const props = defineProps(['value']);
const { value } = toRefs(props);

const users: globalThis.Ref<Strapi4ResponseData<User>[]> = ref([]);
const selectedUsers: globalThis.Ref<User[]> = ref([]);
const loadingUsers = ref(false);
const search = ref('');

watch(
  () => search.value,
  async () => await searchUsers(search.value),
);
watch(
  () => value!.value,
  async () => await loadUsers(),
);

onMounted(async () => await loadUsers());

const loadUsers = async () => {
  if (value!.value && value?.value.length) {
    selectedUsers.value = value.value;
    await searchUsers('', value.value);
  }
};

const searchUsers = async (search = '', ids = []) => {
  if ((!search || search.length < 3) && !ids.length) return;
  loadingUsers.value = true;

  const queryIds = { _where: { id: ids } };

  const querySearch = {
    _where: {
      id_ne: user.value!.id,
      _or: [{ email_contains: search }, { fullname_contains: search }],
    },
  };

  const query = stringify(ids.length ? queryIds : querySearch);

  users.value = (await find<User>(`/users?${query}&_limit=20`)).data;

  loadingUsers.value = false;
};
const remove = (item) => {
  selectedUsers.value = selectedUsers.value.filter((u) => u !== item.id);
};

const getReducedName = (fullname = '') => {
  if (!fullname) return '';
  const names = fullname.split(' ');

  if (names.length === 1) {
    return fullname;
  }

  return `${names[0]} ${names[names.length - 1]}`;
};

const onInput = () => {
  search.value = '';
  this.$emit('input', selectedUsers.value);
};
</script>

<style scoped lang="scss"></style>
