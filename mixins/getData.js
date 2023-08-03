import * as queries from '~/assets/queries';

async function loadPlan({ error, params, $strapi }, throwError = true) {
  const graphql = useStrapiGraphQL();

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
      variables: { plan_id: planId, user_id: $strapi.user.id },
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

export default {
  async asyncData({ error, params, $strapi }) {
    return await loadPlan({ error, params, $strapi });
  },
  mounted() {
    this.$emit('loaded', this.learningPlan);
  },
  data() {
    return { breadcrumb: [], data: {} };
  },
  computed: {
    isTrailRoute() {
      const { trailId } = this.$route.params;
      return !!trailId;
    },
    userInitials() {
      return getFullnameInitials(this.$strapi.user.fullname);
    },
  },
  methods: {
    handleBack() {
      this.$router.go(-1);
    },
    async reloadLearningPlanData() {
      const reloadParams = {
        $strapi: this.$strapi,
        params: this.$route.params,
      };

      this.learningPlan = (await loadPlan(reloadParams, false)).learningPlan;
    },
  },
};
