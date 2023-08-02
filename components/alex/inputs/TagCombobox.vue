<template>
  <v-combobox
    v-model="selectedTags"
    :items="tags"
    :loading="loadingTags"
    label="Adicionar Tags"
    prepend-inner-icon="mdi-plus-circle"
    append-icon="mdi-magnify"
    outlined
    dense
    chips
    multiple
    hide-selected
    :hide-no-data="!search || search.length < 3"
    cache-items
    item-value="id"
    item-text="tag"
    :search-input.sync="search"
    :reverse="false"
    :clearable="!disabled"
    small-chips
    :readonly="disabled"
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
          <template v-if="data.item.tag">
            {{ data.item.tag }} <v-icon v-if="data.item.verified" color="green" small title="Tag Verificada Alex">mdi-check-decagram</v-icon>
          </template>
          <template v-else>
            {{ data.item }} <v-progress-circular class="ml-1" indeterminate color="primary" :size="11" :width="1" />
          </template>
        </v-chip>
      </template>
      <template #item="data">
        <v-list-item-content>
          <v-list-item-title> 
            {{ data.item.tag }} <v-icon v-if="data.item.verified" color="green" title="Tag Verificada Alex">mdi-check-decagram</v-icon> 
          </v-list-item-title>
        </v-list-item-content>
      </template>
      <template #no-data>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              Nenhuma tag encontrada para "<strong>{{ search }}</strong>". Aperte <kbd>enter</kbd> para criar uma tag nova
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
  </v-combobox>
</template>

<script>

import * as queries from '~/assets/queries';

export default {
  props: ['value'],
  data() {
    return {
      tags: [],
      selectedTags: [],
      loadingTags: false,
      disabled: false,
      search: "",

    };
  },

  computed: {
  },

  watch: {
    search: {
      async handler(search = "") {
        await this.searchTags(search);
      }
    },
    async value() {
      await this.loadTags();
    }
  },
  async created() {
    await this.loadTags()
  },
  methods: {
    async loadTags() {
      if (this.value && this.value.length) {
        this.selectedTags = this.value;
        await this.searchTags('', this.value.map(t => t.id));
      }
    },
    async searchTags(search = "", ids = []) {
      if ((!search || search.length < 3) && !ids.length) return
      this.loadingTags = true

      // const 
      const query = {
        query: ids.length ? queries.tagsByids : queries.tags,
        variables: ids.length ? { ids } : { search }
      }

      this.tags = (await this.$strapi.graphql(query)).tags;

      this.loadingTags = false
    },
    remove(item) {
      if (this.disabled) return;
      this.selectedTags = this.selectedTags.filter(t => t.id !== item.id);
    },
    async onInput() {
      this.search = ''

      await this.checkForNewTags();
      this.$emit('input', this.selectedTags)
    },
    async checkForNewTags() {
      const newTags = this.selectedTags.filter(tag => !tag.tag);
      

      if (newTags.length) {
        this.disabled = true;
        const newTagIdx = this.selectedTags.findIndex(tag => !tag.tag)

        const tag = await this.$strapi.create('tags', { tag: newTags[0] })

        this.selectedTags[newTagIdx] = tag;

        this.disabled = false;
      }

    }
  }
};
</script>

<style scoped lang="scss">
</style>
