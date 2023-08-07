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
          {{ data.item.tag }}
          <v-icon
            v-if="data.item.verified"
            color="green"
            small
            title="Tag Verificada Alex"
            >mdi-check-decagram</v-icon
          >
        </template>
        <template v-else>
          {{ data.item }}
          <v-progress-circular
            class="ml-1"
            indeterminate
            color="primary"
            :size="11"
            :width="1"
          />
        </template>
      </v-chip>
    </template>
    <template #item="data">
      <v-list-item-content>
        <v-list-item-title>
          {{ data.item.tag }}
          <v-icon
            v-if="data.item.verified"
            color="green"
            title="Tag Verificada Alex"
            >mdi-check-decagram</v-icon
          >
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template #no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            Nenhuma tag encontrada para "<strong>{{ search }}</strong
            >". Aperte <kbd>enter</kbd> para criar uma tag nova
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
import * as queries from '~/assets/queries';
const { create } = useStrapi();
const graphql = useStrapiGraphQL();

const props = defineProps(['value']);
const { value } = toRefs(props);

const tags = ref([]);
const selectedTags = ref([]);
const loadingTags = ref(false);
const disabled = ref(false);
const search = ref('');

watch(
  () => search,
  async () => {
    await searchTags(search.value);
  },
);

watch(
  () => value,
  async () => {
    await loadTags();
  },
);
onMounted(async () => {
  await loadTags();
});

const loadTags = async () => {
  if (value && value.value.length) {
    selectedTags.value = value.value;
    await searchTags(
      '',
      value.value.map((t) => t.id),
    );
  }
};

const searchTags = async (search = '', ids: string[] = []) => {
  if ((!search || search.length < 3) && !ids.length) return;
  loadingTags.value = true;

  // const
  const props = {
    query: ids.length ? queries.tagsByids : queries.tags,
    variables: ids.length ? { ids } : { search },
  };

  tags.value = (await graphql(props.query, props.variables)).tags;

  loadingTags.value = false;
};

const remove = (item) => {
  if (disabled.value) return;
  selectedTags.value = selectedTags.value.filter((t) => t.id !== item.id);
};
const onInput = async () => {
  search.value = '';

  await checkForNewTags();
  this.$emit('input', selectedTags.value);
};
const checkForNewTags = async () => {
  const newTags = selectedTags.value.filter((tag) => !tag.tag);

  if (newTags.length) {
    disabled.value = true;
    const newTagIdx = selectedTags.value.findIndex((tag) => !tag.tag);

    const tag = await create('tags', { tag: newTags[0] });

    selectedTags.value[newTagIdx] = tag;

    disabled.value = false;
  }
};
</script>

<style scoped lang="scss"></style>
