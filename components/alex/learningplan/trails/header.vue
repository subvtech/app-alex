<template>
  <div>
    <alex-custom-breadcrumbs
      :arrow-back="true"
      title="Trilha de aprendizagem "
      :items="[
        { title: 'Home', disabled: false, href: '/' },
        { title: 'Meus Cursos', disabled: false, href: '/courses/me' },
        {
          title: props.courseTitle,
          disabled: false,
          href: `/courses/${props.courseId}`,
        },
        {
          title: props.trailsTitle,
          disabled: false,
          href: `/courses/${props.courseId}/trails/${props.trailId}`,
        },
      ]"
    />
    <div class="bg-white rounded my-6">
      <v-container fluid class="header">
        <v-row class="header-row">
          <v-col
            cols="12"
            md="6"
            lg="3"
            class="d-flex align-center justify-center"
          >
            <img
              :src="trailsCover || '/images/cover_image_course.svg'"
              alt="Imagem da trilha"
              class="trailImg"
            />
          </v-col>
          <v-col cols="12" md="6" lg="9">
            <div class="header-text">
              <span class="header-h3">{{ trailsTitle }}</span>
              <span class="body-p1" style="width: 100%">{{
                trailsDescription
              }}</span>
              <alex-custom-chip
                v-if="page === 3"
                text="Jornada Individual"
                prepend-icon="mdi-check"
                :size="'x-small'"
                :status="'dark'"
                >{{ $t('pages.trails.settings.chip') }}</alex-custom-chip
              >
            </div>
          </v-col>
        </v-row>
      </v-container>
      <alex-custom-tabs v-model="activePage" :tabs="tabs" class="customTabs" />
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
  trailId: {
    type: String,
    required: true,
  },
  courseTitle: {
    type: String,
    required: true,
  },
  courseId: {
    type: String,
    required: true,
  },
  page: {
    type: Number,
    required: true,
  },
});

const activePage = ref(props.page);

watch(activePage, () => {
  if (activePage.value == 0) {
    let currentPath = router.currentRoute.value.fullPath;
    if (currentPath.endsWith('settings')) {
      currentPath = currentPath.replace('settings', '');
      router.push(currentPath);
    }
  } else if (activePage.value == 2) {
    if (router.currentRoute.value.fullPath.endsWith('settings')) return;
    router.push(`${router.currentRoute.value.fullPath}settings`);
  }
});
const tabs: TabType[] = [
  { label: 'Visão Geral', value: '0' },
  { label: 'Tarefas', value: '1' },
  { icon: 'mdi-cog-outline', label: '', value: '2' },
];
</script>
<style scoped lang="scss">
.header {
  display: flex;
  padding: 24px;
  justify-content: flex-end;
  align-items: flex-start;
  align-content: flex-start;
  align-self: stretch;
  flex-wrap: wrap;
}
.header-h3 {
  overflow: hidden;
  color: var(--Cinza-Cinza-800, #454d54);
  text-overflow: ellipsis;
  /* Header/H3 */
  font-family: Sen;
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: normal;
}

.body-p1 {
  font-family: Sen;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 135%; /* 21.6px */
  letter-spacing: 0.32px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  align-self: stretch;
  color: var(--Cinza-Cinza-600, #6e7a87);
}

.trailImg {
  width: 200px !important;
  height: 150px !important;
  justify-content: flex-end !important;
  align-items: flex-start !important;
  border-radius: 12px !important;
}

.header-text {
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: flex-start;
  align-self: stretch;
}

.customTabs {
  border-top: 1px solid var(--cinza-cinza-100, #ebedef);
}
</style>
