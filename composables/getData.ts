import {
  Strapi4ResponseMany,
  Strapi4ResponseSingle,
} from '@nuxtjs/strapi/dist/runtime/types';
import * as queries from '~/assets/queries';
import { getFullnameInitials } from '@/helpers/utils';
import { User } from '@/models/user.model';
import { LearningPlan } from 'models/learningPlan.model';
import { Class } from 'models/class.model';

export const useGetData = () => {
  const user = useStrapiUser<User>();
  const breadcrumb = ref<any[]>([]);
  const learningPlan = ref<Strapi4ResponseSingle<LearningPlan>>();
  const router = useRouter();
  const route = useRoute();
  const graphql = useStrapiGraphQL();

  const isTrailRoute = computed(() => {
    const { trailId } = route.params;
    return !!trailId;
  });

  const userInitials = computed(() => {
    return getFullnameInitials(user?.value?.fullname ?? '');
  });

  function handleBack() {
    router.go(-1);
  }

  async function loadPlan({ params }, throwError = true) {
    const { planId, trailId, tasksId } = params;
    const model = trailId ? 'trail' : 'learningplan';
    const query = trailId ? queries.trail : queries.learningplan;

    // eslint-disable-next-line
    let vars: any = { id: trailId || planId || tasksId, class_query: {} };
    if (trailId) vars.lp_id = planId;

    try {
      const res = await graphql<{
        data: {
          learningplan: Strapi4ResponseSingle<LearningPlan>;
          trail: Strapi4ResponseSingle<LearningPlan>;
        };
      }>(query, vars);

      const data = res.data[model];

      data.data.attributes.userClasses = (
        await graphql<{ data: { classes: Strapi4ResponseMany<Class> } }>(
          queries.userPlanClasses,
          {
            plan_id: planId,
            user_id: user.value.id,
          },
        )
      ).data.classes;

      const slug = `/learning-plans/${planId}`;

      // eslint-disable-next-line
      let labelTitle = {};

      if (trailId) {
        labelTitle = res.data.learningplan.data.attributes.title;
      } else {
        labelTitle = data.data.attributes.title;
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
        breadcrumb.push({
          to: `${slug}/trails/${trailId}`,
          label: data.data.attributes.title,
        });
      }

      data.data.attributes.isTrail = !!trailId;
      return { breadcrumb, learningPlan: data };
    } catch (err: any) {
      throwError && console.log(err.message);
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
  return {
    learningPlan,
    breadcrumb,
    loadPlan,
    handleBack,
    isTrailRoute,
    userInitials,
  };
};
