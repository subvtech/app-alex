<template>
  <alex-custom-card
    title=""
    class="participantes-card mb-6"
    align-content="align-center"
    :show-icon="false"
  >
    <template #content>
      <v-row v-if="loading" class="w-100 gap-4">
        <div
          class="d-flex w-full align-center justify-space-between flex-wrap gap-6 w-100 px-1"
        >
          <alex-custom-skeleton
            color="gray-100"
            class="width-76 height-12 absolute"
            rounded="rounded"
          />
          <alex-custom-skeleton
            color="gray-100"
            class="width-40 height-11 absolute"
            rounded="rounded"
          />
        </div>
        <div class="d-flex align-start flex-wrap gap-6 w-100 px-1">
          <alex-learningplan-skeleton-class-member-card
            v-for="(_item, index) in Array.from(Array(3).keys())"
            :key="index"
          />
        </div>
      </v-row>
      <v-container v-else fluid class="pa-1 ga-2">
        <v-row justify="space-between" align="center" dense class="mb-6">
          <v-col>
            <alex-inputs-text-field
              v-model="modelSearch"
              :name="`search-${$attrs.title}`"
              density="comfortable"
              :placeholder="searchPlaceholder"
              hide-details
              prepend-inner-icon="mdi-magnify"
              class="max-width-320"
            />
          </v-col>
          <v-col cols="auto"
            ><alex-custom-button
              v-if="showAction"
              size="large"
              :prepend-icon="!mobile ? actionIcon : undefined"
              :icon="mobile ? actionIcon : undefined"
            >
              <template v-if="!mobile">{{ actionText }}</template>
              <template v-else><v-icon :icon="actionIcon" /></template>
              <slot v-if="useCustomDialog" name="custom-dialog"></slot>
              <alex-custom-dialog
                v-else
                v-model="dialogModelValue"
                :title="dialogTitle"
                activator="parent"
              >
                <slot name="dialog-content"></slot>
                <template #footer>
                  <alex-custom-dialog-footer
                    no-secondary-button
                    :main-button-text="dialogActionText"
                    :main-button-loading="dialogActionLoading"
                    :main-button-disabled="dialogActionDisabled"
                    @on-main-action="emit('action')"
                  />
                </template>
              </alex-custom-dialog> </alex-custom-button
          ></v-col>
        </v-row>
        <v-row v-if="!items.length" dense align="center" justify="center">
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
            class="d-flex flex-wrap w-100"
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
import { useDisplay } from 'vuetify/lib/framework.mjs';
import { usePagination } from '~/composables/usePagination';
const { t } = useI18n();
const page = ref(1);
const { mobile } = useDisplay({ mobileBreakpoint: 600 });
const emit = defineEmits(['update:search', 'action']);
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  showAction: {
    type: Boolean,
    default: true,
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
  dialogActionText: {
    type: String,
    default: '',
  },
  dialogActionLoading: {
    type: Boolean,
    default: false,
  },
  dialogActionDisabled: {
    type: Boolean,
    default: false,
  },
  coloredBackground: {
    type: Boolean,
    default: false,
  },
  dialogTitle: {
    type: String,
    default: '',
  },
  dialogModel: {
    type: Boolean,
    default: false,
  },
  emptyStateObjectName: {
    type: String,
    default: 'pages.classes.participant',
  },
  useCustomDialog: {
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

const dialogModelValue = defineModel<boolean>('dialogModel', {
  default: false,
});

const cardItems = computed(() => props.items);

const pagination = usePagination(
  modelSearch,
  page,
  cardItems,
  t(props.emptyStateObjectName),
);
</script>

<style lang="scss" scoped>
.max-width-320 {
  max-width: 320px;
}
</style>
