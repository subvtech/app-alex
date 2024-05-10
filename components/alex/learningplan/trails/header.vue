<template>
  <div
    v-if="trailStore.loading && showSkeleton"
    class="d-flex flex-column gap-1 my-6 bg-white rounded"
  >
    <div class="d-flex gap-4 w-100 px-6 pt-6">
      <alex-custom-skeleton
        color="gray-300"
        class="width-50 height-37"
        rounded="md"
      />
      <alex-custom-skeleton color="gray-300" class="w-100 height-37" />
    </div>
    <div class="flex-row px-6 py-2">
      <alex-custom-skeleton color="gray-300" class="w-100 height-12" />
    </div>
  </div>
  <div v-else>
    <div class="bg-white rounded my-6">
      <div
        class="d-flex px-6 py-6 justify-start align-start align-self-stretch flex-wrap"
      >
        <div class="header-row">
          <div class="d-flex header-img d-flex align-start align-self-stretch">
            <img
              :src="trailsCover || '/images/cover_image_course.svg'"
              :alt="$t('components.trails.header.imgAlt')"
              class="trailImg justify-end align-start"
            />
          </div>
          <div class="h-text">
            <div class="header-text">
              <span class="text-h3 text-gray-800">{{ trailsTitle }}</span>
              <span class="text-body-1 text-gray-600 w-100">
                {{ trailsDescription }}</span
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="d-flex flex-row justify-space-between align-center pr-2 customTabs"
      >
        <div class="d-flex w-100">
          <alex-custom-tabs v-model="activePage" :tabs="tabs" show-arrows />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { TabType } from '@/components/alex/custom/Tabs.vue';
const router = useRouter();

const props = defineProps({
  trailsTitle: {
    type: String,
    required: true,
  },
  trailsDescription: {
    type: String,
    required: true,
  },
  trailsCover: {
    type: String,
    required: true,
  },
  page: {
    type: String as PropType<string>,
    required: true,
  },
  courseId: {
    type: Number as PropType<number>,
    required: true,
  },
  trailId: {
    type: Number as PropType<number>,
    required: true,
  },
});
const { t } = useI18n();

const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();

const tab = {
  firstTitle: t('components.trails.header.firstTab'),
  secondTitle: t('components.trails.header.secondTab'),
};

const showSkeleton = computed(() => trailStore.trail?.id !== props.trailId);

const tabs = computed(() => {
  const defaultTabs: TabType[] = [
    { label: tab.firstTitle, value: '0' },
    { label: tab.secondTitle, value: '1' },
    { label: 'Contribuições', value: '2' },
  ];

  if (learningPlanStore.userIsFacilitator) {
    defaultTabs.push({
      label: '',
      icon: 'mdi-cog-outline',
      value: '3',
      classes: 'ml-auto',
    });
  }

  return defaultTabs;
});

const activePage = ref(props.page);
const defaultURL = computed(() => {
  return `/courses/${props.courseId}/trails/${props.trailId}`;
});

watch(activePage, () => {
  switch (activePage.value) {
    case '0':
      router.replace(`${defaultURL.value}`);
      break;
    case '1':
      router.replace(`${defaultURL.value}/tasks`);
      break;
    case '2':
      router.replace(`${defaultURL.value}/contributions`);
      break;
    case '3':
      router.replace(`${defaultURL.value}/settings`);
      break;
  }
});

computed(() => {});
</script>
<style scoped lang="scss">
.header-row {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px !important;
  width: 100%;
  flex-shrink: calc(100% / 3);
}

.trailImg {
  width: 200px !important;
  height: 150px !important;
  border-radius: 12px;
  object-fit: cover;
}

.header-text {
  display: flex;
  gap: 8px;
  flex-direction: column;
  max-width: 100%;
  max-height: fit-content;
  word-break: break-all;
  overflow-y: hidden;
  text-overflow: ellipsis;
  text-align: justify;
  flex-shrink: 1;
}

.customTabs {
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}

@media screen and (max-width: 900px) {
  .header-row {
    flex-direction: column;
  }
  .trailImg {
    width: 85% !important;
    height: auto !important;
    max-height: 400px !important;
    max-width: fit-content !important;
  }
  .header-img {
    max-width: 100%;
    align-items: center;
    justify-content: center;
  }
  .header-text {
    max-width: 100%;
  }
}
</style>
