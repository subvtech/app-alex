import itemVue from '../../tutorial/stepper/item.vue';
<template>
  <alex-custom-card
    class="participantes-card mb-6"
    align-content="align-center"
    :show-icon="false"
  >
    <template #content>
      <v-row v-if="loading" justify="center">
        <v-progress-circular
          indeterminate
          color="accent"
          size="100"
          width="6"
        />
      </v-row>
      <v-container v-else fluid>
        <v-row justify="space-between">
          <v-col cols="4">
            <alex-inputs-text-field
              v-model="modelSearch"
              density="comfortable"
              :placeholder="searchPlaceholder"
              prepend-inner-icon="mdi-magnify"
            />
          </v-col>
          <alex-custom-button :prepend-icon="actionIcon">
            {{ actionText }}
          </alex-custom-button>
        </v-row>
        <v-row justify="center"> </v-row>
        <div v-if="showEmptyState" class="d-flex flex-column align-center ga-6">
          <v-img
            :src="emptyStateImage"
            :height="imageHeight"
            :width="imageWidth"
          />
          <h3 class="text-h3 text-gray-400">
            {{ emptyStateMessage }}
          </h3>
        </div>
        <v-row
          v-else
          :class="{
            'bg-gray-blue': coloredBackground,
            'pa-6': coloredBackground,
            rounded: coloredBackground,
          }"
        >
          <v-data-iterator
            v-model:search="modelSearch"
            v-model:page="page"
            :items="items"
            :items-per-page="itemsPerPage"
            :filter-keys="filterKeys"
            class="d-flex flex-wrap"
            style="flex: 1; position: relative"
          >
            <template #default="{ items: iterateItems }">
              <template v-for="(item, i) in iterateItems" :key="`item-${i}`">
                <slot name="item" :item="item.raw"></slot>
              </template>
            </template>
            <template #footer="{ pageCount, groupedItems }">
              <div
                class="d-flex w-100 justify-space-between align-center pa-6 pb-0 flex-column flex-sm-row ga-3 footer mt-6"
              >
                <p class="text-body-3 text-gray-600">
                  {{ pagination.showingData(groupedItems) }}
                </p>
                <alex-custom-pagination
                  v-if="pageCount > 1"
                  v-model="page"
                  :length="pageCount"
                  :total-visible="5"
                />
              </div>
            </template>
          </v-data-iterator>
        </v-row>
      </v-container>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
const page = ref(1);
const emit = defineEmits(['update:search']);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  items: {
    type: Array,
    default: () => [],
  },
  filterKeys: {
    type: Array,
    default: () => [],
  },
  itemsPerPage: {
    type: Number,
    default: 12,
  },
  showEmptyState: {
    type: Boolean,
    default: false,
  },
  emptyStateImage: {
    type: String,
    default: '',
  },
  imageHeight: {
    type: String,
    default: '',
  },
  imageWidth: {
    type: String,
    default: '',
  },
  emptyStateMessage: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
  search: {
    type: String,
    default: '',
  },
  actionText: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: String,
    default: '',
  },
  coloredBackground: {
    type: Boolean,
    default: false,
  },
});

const modelSearch = computed({
  get() {
    return props.search;
  },
  set(value) {
    emit('update:search', value);
  },
});

const cardItems = computed(() => props.items);

const pagination = usePagination(modelSearch, page, cardItems);
</script>
