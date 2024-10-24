export const useHeaderTrails = (currentPageRoute, currentPageTitle = '', project = false) => {
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

      const items = !project
        ? [
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
          ]
        : [
            {
              title: t('pages.projects.common.my_projects'),
              to: '/projects/me',
            },
            {
              title: learningPlanStore.learningPlan?.title || '',
              to: `/projects/${id}/overview`,
              disabled: /projects\/[0-9]+\/overview/.test(route.path),
            },
            {
              title: t('components.trails.header.chip'),
              to: `/projects/${id}/individual_learning${route.query?.from ? `/${route.query.from}` : ''}`,
              disabled: false,
            },
            {
              title: t('pages.courses.trails'),
              to: `/projects/${id}/individual_learning${route.query?.from ? `/${route.query.from}/trails` : ''}`,
              disabled: !route.query?.from,
            },
            {
              title: trailStore.trail?.title ?? '',
              disabled: true,
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
