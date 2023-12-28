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
      <v-container v-else fluid class="pa-1 ga-2">
        <v-row justify="space-between" align="center" dense class="mb-6">
          <v-col cols="4">
            <alex-inputs-text-field
              v-model="modelSearch"
              name="search"
              density="comfortable"
              :placeholder="searchPlaceholder"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="max-width-320"
            />
          </v-col>
          <alex-custom-button :prepend-icon="actionIcon" size="large">
            {{ actionText }}
            <alex-custom-dialog
              v-model="openDialog"
              :title="dialogTitle"
              activator="parent"
            >
              <slot name="dialog-content"></slot>
              <template #footer>
                <alex-custom-dialog-footer
                  no-secondary-button
                  @on-main-action="emit('action')"
                />
              </template>
            </alex-custom-dialog>
          </alex-custom-button>
        </v-row>
        <v-row v-if="showEmptyState" dense align="center" justify="center">
          <div class="d-flex flex-column align-center ga-6">
            <v-img
              :src="emptyStateImage"
              :height="imageHeight"
              :width="imageWidth"
            />
            <h3 class="text-h3 text-gray-400">
              {{ emptyStateMessage }}
            </h3>
          </div>
        </v-row>
        <v-row
          v-else
          :class="{
            'bg-gray-blue': coloredBackground,
            'pa-6': coloredBackground,
            rounded: coloredBackground,
          }"
          dense
        >
          <v-data-iterator
            v-model:search="modelSearch"
            v-model:page="page"
            :items="items"
            :items-per-page="itemsPerPage"
            :filter-keys="filterKeys"
            class="d-flex flex-wrap"
          >
            <template #default="{ items: iterateItems }">
              <div class="d-flex flex-wrap gap-6 w-100 px-1">
                <template v-for="(item, i) in iterateItems" :key="`item-${i}`">
                  <slot name="item" :item="item.raw" />
                </template>
              </div>
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
import { usePagination } from '~/composables/usePagination';
const { t } = useI18n();
const page = ref(1);
const emit = defineEmits(['update:search', 'action']);
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
  dialogTitle: {
    type: String,
    default: '',
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

const pagination = usePagination(
  modelSearch,
  page,
  cardItems,
  t('pages.classes.participant'),
);

const openDialog = ref(false);
</script>

<style lang="scss" scoped>
.max-width-320 {
  max-width: 320px;
}
</style>
