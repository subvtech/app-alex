<template>
  <div>
    <div class="bg-white rounded my-6">
      <div
        class="d-flex px-6 py-6 justify-start align-start align-self-stretch flex-wrap"
      >
        <div class="header-row">
          <div class="d-flex header-img d-flex align-start align-self-stretch">
            <img
              :src="trailsCover || '/images/cover_image_course.svg'"
              :alt="$t('components.trails.header.imgAlt')"
              class="trailImg justify-end align-start object-cover"
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
      <alex-custom-tabs v-model="activePage" :tabs="tabs" class="customTabs" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { watch } from 'vue';
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
    type: Number as PropType<number>,
    default: 0,
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
const tab = {
  firstTitle: t('components.trails.header.firstTab'),
  secondTitle: t('components.trails.header.secondTab'),
};

const tabs = [
  { label: tab.firstTitle, value: '0' },
  { label: tab.secondTitle, value: '1' },
  { icon: 'mdi-cog-outline', label: '', value: '2' },
];
const currentPath = router.currentRoute.value.fullPath;
const activePage = ref(props.page);
watch(activePage, () => {
  if (activePage.value == 0) {
    if (currentPath.endsWith('settings')) {
      currentPath.replace('settings', '');
      router.push(currentPath);
    }
    router.push(`/courses/${props.courseId}/trails/${props.trailId}`);
  } else if (activePage.value == 2) {
    if (currentPath.endsWith('settings')) return;
    router.push(`${currentPath}settings`);
  } else if (activePage.value == 1) {
    if (currentPath.endsWith('tasks')) return;
    router.push(`${currentPath}tasks`);
  }
});
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
}

.header-img {
  max-width: 25%;
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
