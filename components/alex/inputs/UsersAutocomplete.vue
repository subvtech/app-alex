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
        v-bind="data.attrs"
        :input-value="data.selected"
        close
        small
        @click="data.select"
        @click:close="remove(data.item)"
      >
        <v-avatar left>
          <v-img v-if="data.item.avatar" :src="data.item.avatar.url"></v-img>
          <v-img v-else src="/images/not-found.png"></v-img>
        </v-avatar>
        {{ getReducedName(data.item.fullname) }}
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-avatar>
        <img v-if="data.item.avatar" :src="data.item.avatar.url" />
        <img v-else src="/images/not-found.png" />
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title> {{ data.item.fullname }} </v-list-item-title>
        <v-list-item-subtitle> {{ data.item.email }} </v-list-item-subtitle>
      </v-list-item-content>
    </template>
  </v-autocomplete>
</template>

<script>
import { stringify } from 'qs';
const user = useStrapiUser();
const { find } = useStrapi();

export default {
  props: ['value'],
  data() {
    return {
      users: [],
      selectedUsers: [],
      loadingUsers: false,
      search: '',
    };
  },

  computed: {},

  watch: {
    search: {
      async handler(search = '') {
        await this.searchUsers(search);
      },
    },
    async value() {
      await this.loadUsers();
    },
  },
  async created() {
    await this.loadUsers();
  },
  methods: {
    async loadUsers() {
      if (this.value && this.value.length) {
        this.selectedUsers = this.value;
        await this.searchUsers('', this.value);
      }
    },
    async searchUsers(search = '', ids = []) {
      if ((!search || search.length < 3) && !ids.length) return;
      this.loadingUsers = true;

      const queryIds = { _where: { id: ids } };

      const querySearch = {
        _where: {
          id_ne: user.id,
          _or: [{ email_contains: search }, { fullname_contains: search }],
        },
      };

      const query = stringify(ids.length ? queryIds : querySearch);

      this.users = await find(`/users?${query}&_limit=20`);

      this.loadingUsers = false;
    },
    remove(item) {
      this.selectedUsers = this.selectedUsers.filter((u) => u !== item.id);
    },
    getReducedName(fullname = '') {
      if (!fullname) return '';
      const names = fullname.split(' ');

      if (names.length === 1) {
        return fullname;
      }

      return `${names[0]} ${names[names.length - 1]}`;
    },
    onInput() {
      this.search = '';
      this.$emit('input', this.selectedUsers);
    },
  },
};
</script>

<style scoped lang="scss"></style>
