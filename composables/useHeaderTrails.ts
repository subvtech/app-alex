export const useHeaderTrails = (currentPageRoute, currentPageTitle = '') => {
  const route = useRoute();
  const headerStore = usePageHeaderStore();
  const trailStore = useTrailStore();
  const learningPlanStore = useLearningPlanStore();
  const { t } = useI18n();

  const { trailId, id } = route.params;
  onBeforeMount(() => {
    headerStore.showHeader = true;
  });

  watch(
    () => [learningPlanStore.loading || trailStore.loading],
    () => {
      if (learningPlanStore.loading || trailStore.loading) return [];

      const items = [
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
          disabled: !currentPageRoute,
          to: `/courses/${id}/trails/${trailId}`,
        },
      ];

      if (currentPageRoute)
        items.push({
          title: t(currentPageTitle),
          disabled: true,
          to: `/courses/${id}/trails/${trailId}/${currentPageRoute}`,
        });
      headerStore.items = items;
    },
    { deep: true },
  );
  headerStore.title = t('components.trails.header.breadcrumbs.title');

  return {};
};
