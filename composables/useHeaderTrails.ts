const headerStore = usePageHeaderStore();
const trailStore = useTrailStore();
const learningPlanStore = useLearningPlanStore();
const { t } = useI18n();

export const useHeaderTrails = () => {
  const route = useRoute();
  const { trailId, id } = route.params;
  onBeforeMount(() => {
    headerStore.showHeader = true;
  });

  const headerItems = computed(() => {
    if (!learningPlanStore.loading || !trailStore.loading) return [];

    return [
      {
        title: learningPlanStore.learningPlan?.title || '',
        disabled: false,
        to: `/courses/${id}`,
      },
      {
        title: t('pages.courses.trails'),
        disabled: false,
        to: `/courses/${id}/trails`,
      },
      {
        title: trailStore.trail?.title || '',
        disabled: false,
        to: `/courses/${id}/trails/${trailId}`,
      },
      {
        title: t('components.trails.settings.title'),
        disabled: true,
        to: `/courses/${id}/trails/${trailId}/settings`,
      },
    ];
  });

  headerStore.title = t('components.trails.header.breadcrumbs.title');
  headerStore.items = headerItems.value;

  return {};
};
