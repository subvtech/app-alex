import * as queries from '~/assets/queries';

export const useGetData = () => {
  const breadcrumb = ref([]);
  const learningPlan = ref();
  const data = ref({});
  const route = useRoute();

  let isTrailRoute = computed(() => {
    const { trailId } = route.params;
    return !!trailId;
  });

  let userInitials = computed(() => {
    return getFullnameInitials(user.fullname);
  });
  const emit = defineEmits(['loaded']);
  onMounted(() => {
    emit('loaded', this.learningPlan);
  });

  function handleBack() {
    route.go(-1);
  }

  async function loadPlan({ error, params }, throwError = true) {
    const graphql = useStrapiGraphQL();
    const user = useStrapiUser();

    const { planId, trailId, tasksId } = params;
    const model = trailId ? 'trail' : 'learningplan';

    // eslint-disable-next-line
    let vars = { id: trailId || planId || tasksId, class_query: {} };
    if (trailId) vars.lp_id = planId;

    try {
      const queryGraphQl = {
        query: queries[model],
        variables: vars,
      };

      const res = !process.env.isElectronEnv
        ? await graphql(queryGraphQl)
        : await window.getPlanData(planId, trailId);

      const data = res[model];

      const queryUserClasses = {
        query: queries.userPlanClasses,
        variables: { plan_id: planId, user_id: user.id },
      };

      data.userClasses = (await graphql(queryUserClasses)).classes;

      const slug = `/learning-plans/${planId}`;

      // eslint-disable-next-line
      let labelTitle = {};

      if (trailId) {
        if (!process.env.isElectronEnv) {
          labelTitle = res.learningplan.title;
        } else {
          labelTitle = data.planData.title;
        }
      } else {
        labelTitle = data.title;
      }

      const breadcrumb = [
        { to: '/learning-plans', iconName: 'home' },
        {
          to: slug,
          label: labelTitle,
        },
      ];

      if (trailId) {
        breadcrumb.push({ to: `${slug}/trails`, label: 'Trilhas' });
        breadcrumb.push({ to: `${slug}/trails/${trailId}`, label: data.title });
      }

      data.isTrail = !!trailId;
      return { breadcrumb, learningPlan: data };
    } catch (err) {
      throwError && error({ message: err.message, statusCode: 404 });
    }
  }

  const reloadParams = {
    params: route.params,
  };

  loadPlan(reloadParams, false)
    .then((result) => {
      if (result) {
        learningPlan.value = result.learningPlan;
        breadcrumb.value = result.breadcrumb;
      }
    })
    .catch(() => {});
  return { learningPlan, breadcrumb, loadPlan, handleBack, isTrailRoute, userInitials };
};
