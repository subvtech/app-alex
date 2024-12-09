<template>
  <alex-custom-card title="" class="participantes-card mb-6" align-content="align-center">
    <template #content>
      <v-row v-if="loading" class="w-100 gap-4">
        <div class="d-flex w-full align-center justify-space-between flex-wrap gap-6 w-100 px-1">
          <alex-custom-skeleton color="gray-100" class="width-76 height-12 absolute" rounded="rounded" />
          <alex-custom-skeleton color="gray-100" class="width-40 height-11 absolute" rounded="rounded" />
        </div>
        <div class="d-flex align-start flex-wrap gap-6 w-100 px-1">
          <alex-learningplan-skeleton-class-member-card
            v-for="(_item, index) in Array.from(Array(3).keys())"
            :key="index"
          />
        </div>
      </v-row>
      <v-container v-else fluid class="pa-1 ga-2">
        <alex-learningplan-class-section-card-header
          v-model:dialog-model="dialogModelValue"
          v-model:search-model="searchModel"
          :action-icon="actionIcon"
          :action-text="actionText"
          :dialog-title="dialogTitle"
          :dialog-action-text="dialogActionText"
          :dialog-action-disabled="dialogActionDisabled"
          :dialog-action-loading="dialogActionLoading"
          :search-placeholder="searchPlaceholder"
          :hide-action="hideAction"
          :hide-secondary-action="hideSecondaryAction"
          :use-custom-dialog="useCustomDialog"
          @action="emit('action')"
        >
          <template #custom-dialog>
            <slot name="custom-dialog" />
          </template>

          <template #dialog-content><slot name="dialog-content"></slot></template>
        </alex-learningplan-class-section-card-header>

        <v-row v-if="!items.length" dense align="center" justify="center">
          <div class="d-flex flex-column align-center ga-6">
            <v-img :src="emptyStateImage" :height="imageHeight" :width="imageWidth" />
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
            v-model:search="searchModel"
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
                <alex-custom-pagination v-if="pageCount > 1" v-model="page" :length="pageCount" :total-visible="5" />
              </div>
            </template>
          </v-data-iterator>
        </v-row>
      </v-container>
    </template>
  </alex-custom-card>
</template>
<script setup lang="ts">
import { SectionCardHeaderProps } from './Header.vue';

const { t } = useI18n();
const page = ref(1);

const emit = defineEmits(['update:search', 'action']);

export interface SectionCardProps extends SectionCardHeaderProps {
  loading?: boolean;
  items?: any[];
  filterKeys?: string[];
  itemsPerPage?: number;
  emptyStateImage?: string;
  imageHeight?: string;
  imageWidth?: string;
  emptyStateMessage?: string;
  search?: string;
  coloredBackground?: boolean;
  dialogModel?: boolean;
  emptyStateActionText?: string;
  emptyStateObjectName?: string;
  entity?: string;
}

const props = withDefaults(defineProps<SectionCardProps>(), {
  loading: false,
  items: () => [],
  filterKeys: () => [],
  itemsPerPage: 12,
  emptyStateImage: '',
  imageHeight: '',
  imageWidth: '',
  emptyStateMessage: '',
  searchPlaceholder: '',
  search: '',
  coloredBackground: false,
  dialogTitle: '',
  dialogModel: false,
  emptyStateActionText: '',
  emptyStateObjectName: 'pages.classes.participant',
  entity: '',
});

const dialogModelValue = defineModel<boolean>('dialogModel', {
  default: false,
});

const searchModel = computed({
  get() {
    return props.search;
  },
  set(value) {
    emit('update:search', value);
  },
});

const cardItems = computed(() => props.items);

const pagination = usePagination(searchModel, page, cardItems, t(props.emptyStateObjectName), props.entity);
</script>

<style lang="scss" scoped>
.max-width-320 {
  max-width: 320px;
}
</style>
