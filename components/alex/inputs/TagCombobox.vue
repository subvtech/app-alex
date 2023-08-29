<template>
  <v-combobox
    v-if="selectedTags && tags"
    v-model="selectedTags"
    v-model:search-input="search"
    :items="tags"
    :loading="loadingTags"
    :label="$t('components.tagCombobox.label')"
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
    :reverse="false"
    :clearable="!disabled"
    small-chips
    :readonly="disabled"
    @input="onInput"
  >
    <template #selection="data">
      <v-chip
        v-bind="data.item.raw.attributes"
        :input-value="data.item.raw.attributes.verified"
        close
        small
        @click="
          data.item.raw.attributes.verified = !data.item.raw.attributes.verified
        "
        @click:close="remove(data.item)"
      >
        <template v-if="data.item.raw.attributes.tag">
          {{ data.item.raw.attributes.tag }}
          <v-icon
            v-if="data.item.raw.attributes.verified"
            color="green"
            small
            :title="$t('components.tagCombobox.verified')"
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
          {{ data.item }}
          <v-icon
            v-if="data.item.raw.attributes.verified"
            color="green"
            :title="$t('components.tagCombobox.verified')"
            >mdi-check-decagram</v-icon
          >
        </v-list-item-title>
      </v-list-item-content>
    </template>
    <template #no-data>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{ $t('components.tagCombobox.noTag') }}<strong>{{ search }}</strong
            > {{ $t('components.tagCombobox.press') }}
            <kbd>enter</kbd>
            {{ $t('components.tagCombobox.newTag') }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-combobox>
</template>

<script setup lang="ts">
import {
  Strapi4ResponseData,
  Strapi4ResponseMany,
} from '@nuxtjs/strapi/dist/runtime/types';
import { PropType } from 'nuxt/dist/app/compat/capi';
import { Tag } from 'models/tag.model';
import * as queries from '~/assets/queries';
const { create } = useStrapi();
const graphql = useStrapiGraphQL();

const props = defineProps({
  modelValue: {
    type: Array as PropType<Strapi4ResponseData<Tag>[]>,
    default: () => [],
  },
});

const tags = ref<Strapi4ResponseData<Tag>[]>([]);
const selectedTags = ref<Strapi4ResponseData<Tag>[]>([]);
const loadingTags = ref(false);
const disabled = ref(false);
const search = ref('');

watch(
  () => search,
  async () => {
    await searchTags(search.value);
  },
);

const emit = defineEmits(['update:modelValue']);

watch(
  () => props.modelValue,
  async () => {
    await loadTags();
  },
);
onMounted(async () => {
  await loadTags();
});

const loadTags = async () => {
  if (props.modelValue && props.modelValue.length) {
    selectedTags.value = props.modelValue;
    await searchTags(
      '',
      props.modelValue.map((t) => t.id),
    );
  }
};

const searchTags = async (search = '', ids: number[] = []) => {
  if ((!search || search.length < 3) && !ids.length) return;
  loadingTags.value = true;

  // const
  const props = {
    query: ids.length ? queries.tagsByids : queries.tags,
    variables: ids.length ? { ids } : { search },
  };

  tags.value = (
    await graphql<Strapi4ResponseMany<Tag>>(props.query, props.variables)
  ).data;

  loadingTags.value = false;
};

const remove = (item) => {
  if (disabled.value) return;
  selectedTags.value = selectedTags.value!.filter((t) => t.id !== item.id);
};
const onInput = async () => {
  search.value = '';

  await checkForNewTags();
  emit('update:modelValue', selectedTags.value);
};
const checkForNewTags = async () => {
  const newTags = selectedTags.value!.filter((tag) => !tag.attributes.tag);

  if (newTags.length) {
    disabled.value = true;
    const newTagIdx = selectedTags.value!.findIndex(
      (tag) => !tag.attributes.tag,
    );

    const tag = (await create<Tag>('tags', { tag: newTags[0].attributes.tag }))
      .data;

    selectedTags.value![newTagIdx] = tag;

    disabled.value = false;
  }
};
</script>

<style scoped lang="scss"></style>
